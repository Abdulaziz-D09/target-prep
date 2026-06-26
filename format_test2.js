const fs = require('fs');

try {
    const text = fs.readFileSync('test2_questions.txt', 'utf8');

    // Split by double newlines or more
    const blocks = text.split(/\n{2,}/);

    const formatted = blocks.map(block => {
        // If it looks like a poetry block or math equations with intentional line breaks, maybe don't touch it.
        // But the user was removing newlines everywhere.
        // Let's just remove single newlines.
        
        // Split by single newlines
        const lines = block.split('\n');
        
        // If it's a list of options (e.g. A. B. C. D. separated by newlines within the same block), we shouldn't merge them if they are distinct options.
        // But wait, the OCR separates options by double newlines usually.
        // If a block has "A. ..." and "B. ...", they should be split.
        // Actually, looking at the user's edits, they were even merging lines in options:
        // "D. the narwhals weren't as sensitive to human-caused sounds as the researchers had \n predicted."
        // They want it merged!
        
        // We can just merge lines safely, EXCEPT if a line starts with A., B., C., D. and the previous line didn't end with a period?
        // Actually, in the file, A, B, C, D are separated by DOUBLE newlines anyway, so they are in their own blocks!
        // Let's check block format:
        return block.replace(/(?<!\n)\n(?!\n)/g, ' ');
    }).join('\n\n');

    fs.writeFileSync('test2_questions.txt', formatted);
    console.log("Formatting complete");
} catch(e) {
    console.log("Error:", e);
}
