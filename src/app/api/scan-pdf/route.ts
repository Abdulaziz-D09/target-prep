import { NextRequest, NextResponse } from 'next/server';

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert at extracting multiple-choice questions from educational texts.

Extract ALL multiple-choice questions from the provided text. Each question should have exactly 4 answer choices labeled A, B, C, D.
If the question is associated with a passage, text, or poem, extract it into the "passage" field. If there is no passage, set it to null. The "stem" should only contain the actual question being asked.

Return ONLY a valid JSON object with this EXACT structure (no markdown fences, no extra text):
{
  "questions": [
    {
      "passage": "The text or passage associated with the question, if any.",
      "stem": "The question being asked (e.g. 'Which choice completes the text...')",
      "options": {
        "A": "First option text",
        "B": "Second option text",
        "C": "Third option text",
        "D": "Fourth option text"
      }
    }
  ]
}

Rules:
1. Include the COMPLETE passage and question stem — do not truncate them.
2. Keep all option text complete and accurate
3. Skip questions that do not have exactly 4 labeled options
4. Do NOT include the correct answer — the teacher will mark answers manually
5. Output raw JSON only — no surrounding commentary or code blocks
`;

// ─── Gemini config ────────────────────────────────────────────────────────────

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';
const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'] as const;
const FILE_STATUS_POLL_INTERVAL_MS = 700;
const MAX_FILE_STATUS_POLLS = 12;

type ParsedQuestion = {
    passage?: string | null;
    stem: string;
    options: { A: string; B: string; C: string; D: string };
};

type GeminiUploadedFile = {
    name?: string;
    uri?: string;
    mimeType?: string;
    state?: string | { name?: string };
};

type GeminiAttemptFailure = {
    model: string;
    status: number;
    errorText: string;
};

function resolveApiKey(requestKey?: string): string {
    return (requestKey ?? '').trim() || (process.env.GEMINI_API_KEY ?? '').trim();
}

function normalizeFileState(state: GeminiUploadedFile['state']): string {
    if (typeof state === 'string') return state.toUpperCase();
    if (state && typeof state === 'object' && typeof state.name === 'string') {
        return state.name.toUpperCase();
    }
    return '';
}

function extractRawModelText(geminiData: unknown): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts = (geminiData as any)?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return '';

    return parts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
        .join('\n')
        .trim();
}

function parseQuestionsFromModelText(rawText: string): ParsedQuestion[] {
    const tryParse = (payload: string): ParsedQuestion[] | null => {
        try {
            const parsed = JSON.parse(payload) as { questions?: ParsedQuestion[] };
            return Array.isArray(parsed?.questions) ? parsed.questions : [];
        } catch {
            return null;
        }
    };

    const direct = tryParse(rawText);
    if (direct) return direct;

    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error('Unexpected Gemini response format.');
    }

    const extracted = tryParse(match[0]);
    if (extracted === null) {
        throw new Error('Unexpected Gemini response format.');
    }
    return extracted;
}

async function callGeminiGenerate(parts: Array<Record<string, unknown>>, apiKey: string): Promise<{
    data: unknown | null;
    model: string | null;
    failures: GeminiAttemptFailure[];
}> {
    const failures: GeminiAttemptFailure[] = [];

    for (const model of GEMINI_MODELS) {
        const res = await fetch(
            `${GEMINI_BASE_URL}/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        temperature: 0.1,
                    },
                }),
            }
        );

        const payloadText = await res.text();
        if (res.ok) {
            try {
                return { data: JSON.parse(payloadText), model, failures };
            } catch {
                failures.push({
                    model,
                    status: 502,
                    errorText: 'Gemini returned non-JSON payload.',
                });
                continue;
            }
        }

        failures.push({
            model,
            status: res.status,
            errorText: payloadText.slice(0, 800),
        });

        // Auth/config errors won't improve on fallback models.
        if (res.status === 400 || res.status === 401 || res.status === 403) {
            break;
        }
    }

    return { data: null, model: null, failures };
}

async function uploadFileToGemini(file: File, apiKey: string): Promise<GeminiUploadedFile> {
    const mimeType = file.type || 'application/pdf';
    const bytes = Buffer.from(await file.arrayBuffer());

    const startRes = await fetch(
        `${GEMINI_BASE_URL}/upload/v1beta/files?key=${encodeURIComponent(apiKey)}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Upload-Protocol': 'resumable',
                'X-Goog-Upload-Command': 'start',
                'X-Goog-Upload-Header-Content-Length': String(bytes.length),
                'X-Goog-Upload-Header-Content-Type': mimeType,
            },
            body: JSON.stringify({
                file: { display_name: file.name || 'uploaded.pdf' },
            }),
        }
    );

    if (!startRes.ok) {
        const errText = await startRes.text();
        throw new Error(`Could not start Gemini file upload (${startRes.status}): ${errText}`);
    }

    const uploadUrl = startRes.headers.get('x-goog-upload-url');
    if (!uploadUrl) {
        throw new Error('Gemini file upload URL was missing.');
    }

    const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Length': String(bytes.length),
            'Content-Type': mimeType,
            'X-Goog-Upload-Offset': '0',
            'X-Goog-Upload-Command': 'upload, finalize',
        },
        body: bytes,
    });

    if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Gemini file upload failed (${uploadRes.status}): ${errText}`);
    }

    const uploadData = (await uploadRes.json()) as { file?: GeminiUploadedFile };
    const uploadedFile = uploadData.file;

    if (!uploadedFile?.uri || !uploadedFile?.mimeType) {
        throw new Error('Gemini file upload returned incomplete file metadata.');
    }

    return uploadedFile;
}

async function waitForGeminiFileIfProcessing(file: GeminiUploadedFile, apiKey: string): Promise<GeminiUploadedFile> {
    if (!file.name) return file;

    const initialName = file.name;
    let current = file;
    let state = normalizeFileState(current.state);
    let attempts = 0;

    while (state === 'PROCESSING' && attempts < MAX_FILE_STATUS_POLLS) {
        attempts += 1;
        await new Promise((resolve) => setTimeout(resolve, FILE_STATUS_POLL_INTERVAL_MS));

        const currentName = current.name ?? initialName;
        const lookupName = currentName.startsWith('files/') ? currentName : `files/${currentName}`;
        const getRes = await fetch(
            `${GEMINI_BASE_URL}/v1beta/${lookupName}?key=${encodeURIComponent(apiKey)}`
        );

        if (!getRes.ok) break;

        const getData = (await getRes.json()) as { file?: GeminiUploadedFile };
        current = getData.file ?? current;
        state = normalizeFileState(current.state);
    }

    if (normalizeFileState(current.state) === 'FAILED') {
        throw new Error('Gemini reported file processing failure.');
    }

    return current;
}

async function deleteGeminiFile(fileName: string | undefined, apiKey: string) {
    if (!fileName) return;

    const lookupName = fileName.startsWith('files/') ? fileName : `files/${fileName}`;
    try {
        await fetch(`${GEMINI_BASE_URL}/v1beta/${lookupName}?key=${encodeURIComponent(apiKey)}`, {
            method: 'DELETE',
        });
    } catch (deleteErr) {
        console.warn('[scan-pdf] Could not delete uploaded Gemini file:', deleteErr);
    }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let textToProcess = '';
        let apiKey = '';
        let uploadedFile: File | null = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file     = formData.get('file')   as File | null;
            const text     = formData.get('text')   as string | null;
            const keyField = formData.get('apiKey') as string | null;

            apiKey = resolveApiKey(keyField ?? '');
            uploadedFile = file && file.size > 0 ? file : null;
            textToProcess = (text ?? '').trim();
        } else {
            const body    = await req.json();
            textToProcess = (body.text   ?? '').trim();
            apiKey        = resolveApiKey(body.apiKey ?? '');
        }

        if (!uploadedFile && !textToProcess.trim()) {
            return NextResponse.json({ error: 'No text or PDF provided to scan.' }, { status: 400 });
        }

        if (!apiKey) {
            return NextResponse.json(
                {
                    error: 'Gemini API key is not configured on the server.',
                },
                { status: 500 }
            );
        }

        let fileNameToDelete: string | undefined;
        try {
            let geminiResult: {
                data: unknown | null;
                model: string | null;
                failures: GeminiAttemptFailure[];
            };

            if (uploadedFile) {
                let geminiFile = await uploadFileToGemini(uploadedFile, apiKey);
                geminiFile = await waitForGeminiFileIfProcessing(geminiFile, apiKey);
                fileNameToDelete = geminiFile.name;

                geminiResult = await callGeminiGenerate(
                    [
                        {
                            text:
                                SYSTEM_PROMPT +
                                '\n\nExtract all multiple-choice questions from this uploaded PDF. Return JSON only.',
                        },
                        {
                            file_data: {
                                mime_type: geminiFile.mimeType,
                                file_uri: geminiFile.uri,
                            },
                        },
                    ],
                    apiKey
                );
            } else {
                geminiResult = await callGeminiGenerate(
                    [
                        {
                            text:
                                SYSTEM_PROMPT +
                                '\n\nText to extract questions from:\n\n' +
                                textToProcess.slice(0, 32000),
                        },
                    ],
                    apiKey
                );
            }

            if (!geminiResult.data) {
                const lastFailure = geminiResult.failures.at(-1);
                console.error('[scan-pdf] Gemini error (all model attempts failed):', geminiResult.failures);

                if (lastFailure && (lastFailure.status === 400 || lastFailure.status === 401 || lastFailure.status === 403)) {
                    return NextResponse.json(
                        { error: 'Gemini API authentication failed on the server. Check server API key configuration.' },
                        { status: 401 }
                    );
                }
                if (lastFailure?.status === 429) {
                    return NextResponse.json(
                        { error: 'Gemini quota limit reached. Please retry shortly or check your API plan limits.' },
                        { status: 429 }
                    );
                }
                if (lastFailure?.status === 404) {
                    return NextResponse.json(
                        { error: 'Configured Gemini model is unavailable for this API key. Please try again shortly.' },
                        { status: 502 }
                    );
                }

                return NextResponse.json(
                    { error: 'AI service returned an error. Please try again.' },
                    { status: 502 }
                );
            }

            const geminiData = geminiResult.data;
            const rawText = extractRawModelText(geminiData);
            if (!rawText) {
                return NextResponse.json({ error: 'AI returned an empty response. Please try again.' }, { status: 502 });
            }

            let questions: ParsedQuestion[];
            try {
                questions = parseQuestionsFromModelText(rawText);
            } catch {
                return NextResponse.json({ error: 'AI returned an unexpected format. Please try again.' }, { status: 502 });
            }

            return NextResponse.json({ questions });
        } finally {
            await deleteGeminiFile(fileNameToDelete, apiKey);
        }

    } catch (err) {
        console.error('[scan-pdf] Unexpected error:', err);
        return NextResponse.json({ error: 'Unexpected server error. Please try again.' }, { status: 500 });
    }
}
