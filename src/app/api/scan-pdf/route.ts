import { NextRequest, NextResponse } from 'next/server';

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert at extracting multiple-choice questions from educational texts, such as SAT practice tests.

Extract ALL multiple-choice questions from the provided text or document. Each question should have exactly 4 answer choices labeled A, B, C, D.

MOST CRITICAL INSTRUCTION — PASSAGE vs STEM SEPARATION:
There are exactly TWO distinct pieces of content per question:
  1. "passage": The reading material — any text, paragraph, poem, excerpt, or notes that the student READS. This goes in the "passage" field.
  2. "stem": The actual question being asked — a single sentence like "Which choice best completes the text?", "What is the main purpose of the passage?", or a math problem. This goes in the "stem" field.

THE STEM FIELD MUST NEVER CONTAIN THE READING TEXT OR PASSAGE. The stem must be ONLY the question prompt sentence itself — typically 1-2 sentences. If the reading material (passage) accidentally ends up in the stem field, that is WRONG.
THE PASSAGE FIELD MUST NEVER CONTAIN THE QUESTION PROMPT. If there is genuinely no reading passage (e.g., a pure math equation question with no text to read), set "passage" to null.

CRITICAL INSTRUCTION FOR MATHEMATICAL FORMULAS (LaTeX):
If a question, passage, or option contains algebraic equations, numbers, variables, exponents, or mathematical formulas, you MUST write them in standard inline LaTeX enclosed in single dollar signs (e.g., $x^2 + 5x + 6 = 0$) or block LaTeX enclosed in double dollar signs ($$y = mx + b$$) so they render correctly in the LaTeX component.

CRITICAL INSTRUCTION FOR TABLES:
If a question contains a data grid or table, you MUST reconstruct it as a clean Markdown table (e.g., using | Column 1 | Column 2 | and separators like |---|---|) directly inside the "passage" or "stem" field. Do not ignore tables.

CRITICAL INSTRUCTION FOR GRAPHS, CHARTS, AND DIAGRAMS:
If a question contains a graph, chart, diagram, or geometric figure, you MUST write a highly detailed textual paragraph describing all key details of the visual data (such as the axes, labels, data trends, points of intersection, coordinates, geometric parameters, or angles) and place it directly inside the "passage" or "stem" field. For example: "[Graph details: A coordinate plane showing y = f(x) intersecting the x-axis at (2,0) and y-axis at (0,4)...]". This ensures students have full visual context.

Return ONLY a valid JSON object with this EXACT structure (no markdown fences, no extra text):
{
  "questions": [
    {
      "passage": "The COMPLETE reading text/passage the student reads. Must NEVER include the question prompt. Set to null if there is no reading passage (e.g., pure math).",
      "stem": "ONLY the question being asked — one or two sentences max. Example: 'Which choice best completes the text?' or 'What is the value of x?'. MUST NOT contain reading material.",
      "options": {
        "A": "First option text (use LaTeX $...$ for math if needed)",
        "B": "Second option text (use LaTeX $...$ for math if needed)",
        "C": "Third option text (use LaTeX $...$ for math if needed)",
        "D": "Fourth option text (use LaTeX $...$ for math if needed)"
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
6. DOUBLE-CHECK before outputting: confirm that the "stem" field contains ONLY the question sentence, and "passage" contains ONLY the reading text.
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

    const cleanExtracted = (questions: ParsedQuestion[]) => {
        return questions.map(q => {
            if (q.passage && q.stem) {
                const pClean = q.passage.trim().replace(/\s+/g, ' ');
                const sClean = q.stem.trim().replace(/\s+/g, ' ');
                if (pClean === sClean || sClean.includes(pClean)) {
                    return { ...q, passage: null };
                }
            }
            return q;
        });
    };

    const direct = tryParse(rawText);
    if (direct) return cleanExtracted(direct);

    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error('Unexpected Gemini response format.');
    }

    const extracted = tryParse(match[0]);
    if (extracted === null) {
        throw new Error('Unexpected Gemini response format.');
    }
    return cleanExtracted(extracted);
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
    const bytes = new Uint8Array(await file.arrayBuffer());

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

                if (lastFailure && (lastFailure.status === 401 || lastFailure.status === 403)) {
                    return NextResponse.json(
                        { error: 'Gemini API authentication failed on the server. Check server API key configuration.' },
                        { status: 401 }
                    );
                }
                if (lastFailure && lastFailure.status === 400) {
                    return NextResponse.json(
                        { error: `Gemini API Bad Request: ${lastFailure.errorText.slice(0, 100)}` },
                        { status: 400 }
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

    } catch (err: any) {
        console.error('[scan-pdf] Unexpected error:', err);
        return NextResponse.json({ error: err?.message || 'Unexpected server error. Please try again.' }, { status: 500 });
    }
}
