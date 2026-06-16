const apiKey = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are an expert SAT test creator. 
Your task is to generate EXACTLY the requested number of high-quality Digital SAT practice questions tailored specifically to the requested topics.

The questions MUST mimic the exact difficulty, tone, formatting, and style of the official College Board Digital SAT.
If the requested section is Math, the questions must be Math questions. If it is Reading & Writing, they must be Reading & Writing questions.

CRITICAL INSTRUCTION FOR MATH TOPICS:
If the section is Math, AT LEAST 2 questions MUST include a data table or a detailed text description of a graph/geometric figure in the "passage" or "stem" field. Use markdown tables for data grids.

CRITICAL INSTRUCTION FOR MATHEMATICAL FORMULAS (LaTeX):
If a question, passage, or option contains algebraic equations, numbers, variables, exponents, or mathematical formulas, you MUST write them in standard inline LaTeX enclosed in single dollar signs (e.g., $x^2 + 5x + 6 = 0$) or block LaTeX enclosed in double dollar signs ($$y = mx + b$$).

CRITICAL INSTRUCTION FOR EXPLANATIONS:
You MUST provide a clear, step-by-step explanation for the correct answer, and briefly explain why the other options are incorrect.

Return ONLY a valid JSON object with this EXACT structure (no markdown fences, no extra text):
{
  "questions": [
    {
      "id": 1,
      "passage": "The reading passage, context, or math preamble. Set to null if there is no reading material.",
      "stem": "The actual question being asked (e.g., 'What is the value of x?'). MUST NOT contain reading material.",
      "options": ["First option", "Second option", "Third option", "Fourth option"],
      "answer": 0,
      "explanation": "Step-by-step explanation of why this answer is correct."
    }
  ]
}

NOTE: "answer" MUST be the integer index (0, 1, 2, or 3) of the correct option in the options array.
`;

const userPrompt = `Generate 5 unique SAT-style Math questions on the topics: Geometry, at Medium difficulty.
For each question, return: a question stem, 4 answer choices, the correct answer index (0-3), and a brief explanation. Format as a JSON array inside the "questions" key as requested in the system prompt.`;

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

const payload = {
    systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [
        {
            parts: [{ text: userPrompt }]
        }
    ],
    generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
    }
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(res => {
    console.log("Status:", res.status);
    console.log("Text:", res.text);
})
.catch(console.error);
