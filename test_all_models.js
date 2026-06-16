const apiKey = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a helpful assistant.`;
const userPrompt = `Generate 1 SAT question. JSON format: {"questions": [{"stem": "...", "options": ["A", "B", "C", "D"], "answer": 0, "explanation": "...", "passage": null}]}`;

const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-flash-latest'
];

async function testModels() {
    for (const model of modelsToTest) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = {
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
        };

        try {
            console.log(`Testing ${model}...`);
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const status = res.status;
            if (status === 200) {
                console.log(`SUCCESS: ${model} works!`);
                return;
            } else {
                console.log(`FAIL: ${model} returned ${status}`);
            }
        } catch(e) {
            console.log(`ERROR on ${model}:`, e.message);
        }
    }
}
testModels();
