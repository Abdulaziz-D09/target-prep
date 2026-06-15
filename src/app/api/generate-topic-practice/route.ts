import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert SAT test creator. 
Your task is to generate EXACTLY 5 high-quality Digital SAT practice questions tailored specifically to a requested topic.

The questions MUST mimic the exact difficulty, tone, formatting, and style of the official College Board Digital SAT.
If the requested topic is Math related, the questions must be Math questions. If it is English related, they must be Reading & Writing questions.

CRITICAL INSTRUCTION FOR MATH TOPICS:
If the topic is Math related, AT LEAST 2 questions MUST include a data table or a detailed text description of a graph/geometric figure in the "passage" or "stem" field. Use markdown tables for data grids.

CRITICAL INSTRUCTION FOR MATHEMATICAL FORMULAS (LaTeX):
If a question, passage, or option contains algebraic equations, numbers, variables, exponents, or mathematical formulas, you MUST write them in standard inline LaTeX enclosed in single dollar signs (e.g., $x^2 + 5x + 6 = 0$) or block LaTeX enclosed in double dollar signs ($$y = mx + b$$).

CRITICAL INSTRUCTION FOR EXPLANATIONS:
You MUST provide a clear, step-by-step explanation for the correct answer, and briefly explain why the other options are incorrect.

Return ONLY a valid JSON object with this EXACT structure (no markdown fences, no extra text):
{
  "topic": "The exact topic name",
  "type": "Math" or "English",
  "questions": [
    {
      "id": 1,
      "passage": "The reading passage, context, or math preamble. Set to null if there is no reading material.",
      "stem": "The actual question being asked (e.g., 'What is the value of x?'). MUST NOT contain reading material.",
      "options": ["First option", "Second option", "Third option", "Fourth option"],
      "answer": "The exact string of the correct option (must exactly match one of the options array items)",
      "explanation": "Step-by-step explanation of why this answer is correct."
    }
  ]
}
`;

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';
const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'] as const;

function resolveApiKey(requestKey?: string): string {
    return (requestKey ?? '').trim() || (process.env.GEMINI_API_KEY ?? '').trim();
}

export async function POST(req: NextRequest) {
    try {
        const apiKey = resolveApiKey();
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: 'GEMINI_API_KEY is not set.' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { topic } = body;

        if (!topic) {
            return NextResponse.json(
                { success: false, error: 'Missing topic in request body.' },
                { status: 400 }
            );
        }

        let finalData: unknown | null = null;
        let finalModel = '';
        const failures: any[] = [];

        for (const model of GEMINI_MODELS) {
            try {
                const url = `${GEMINI_BASE_URL}/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const payload = {
                    system_instruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `Generate 5 SAT questions for the topic: "${topic}"` }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: 'application/json',
                    }
                };

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const errText = await res.text();
                    failures.push({ model, status: res.status, errorText: errText });
                    continue;
                }

                const data = await res.json();
                finalData = data;
                finalModel = model;
                break;
            } catch (err: any) {
                failures.push({ model, status: 0, errorText: err.message || 'Network/Parsing error' });
            }
        }

        if (!finalData) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'All Gemini models failed.',
                    details: failures
                },
                { status: 502 }
            );
        }

        const parts = (finalData as any)?.candidates?.[0]?.content?.parts;
        if (!Array.isArray(parts)) {
            return NextResponse.json(
                { success: false, error: 'Invalid response from Gemini.' },
                { status: 502 }
            );
        }

        const rawText = parts.map((p: any) => (typeof p?.text === 'string' ? p.text : '')).join('').trim();
        
        let parsedResult;
        try {
            parsedResult = JSON.parse(rawText);
        } catch (err) {
            // Attempt to extract JSON if there's markdown fences
            const match = rawText.match(/\{[\s\S]*\}/);
            if (match) {
                parsedResult = JSON.parse(match[0]);
            } else {
                throw new Error('Could not parse JSON from Gemini response.');
            }
        }

        // Validate structure
        if (!parsedResult || !Array.isArray(parsedResult.questions)) {
            throw new Error('Invalid JSON structure returned by model.');
        }

        return NextResponse.json({
            success: true,
            data: parsedResult,
            model: finalModel
        });

    } catch (err: any) {
        console.error('API /generate-topic-practice Error:', err);
        return NextResponse.json(
            { success: false, error: err.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
