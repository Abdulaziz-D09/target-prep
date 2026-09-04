const fs = require('fs');

let content = fs.readFileSync('src/components/MockTestFilesEditor.tsx', 'utf8');

// Find the motion.div for the grid item
const searchStr = `<motion.div 
                                                    key={q.id} 
                                                    onClick={() => setExpandedQuestionId(isExpanded ? null : \`\${test.id}-\${q.id}\`)}
                                                    className={\`flex flex-col bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transition-shadow hover:shadow-md self-start \${isExpanded ? 'col-span-full ring-2 ring-blue-500 border-blue-500' : ''}\`}
                                                    style={{ alignSelf: 'start' }}
                                                >`;

const replaceStr = `<motion.div 
                                                    layout
                                                    key={q.id} 
                                                    onClick={() => setExpandedQuestionId(isExpanded ? null : \`\${test.id}-\${q.id}\`)}
                                                    className={\`flex flex-col bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transition-shadow hover:shadow-md \${isExpanded ? 'ring-2 ring-blue-500 border-blue-500 shadow-blue-500/20' : ''}\`}
                                                    style={{ 
                                                        alignSelf: 'start',
                                                        gridColumn: isExpanded ? '1 / -1' : undefined
                                                    }}
                                                >`;

if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync('src/components/MockTestFilesEditor.tsx', content);
    console.log('done');
} else {
    console.log('Not found, trying flexible search');
    
    // Flexible search in case spacing is different
    const lines = content.split('\n');
    let startIdx = -1;
    let endIdx = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<motion.div') && lines[i+2] && lines[i+2].includes('setExpandedQuestionId')) {
            startIdx = i;
            for (let j = i; j < i + 10; j++) {
                if (lines[j].includes('style={{ alignSelf: \'start\' }}')) {
                    endIdx = j + 1; // Include the closing >
                    break;
                }
            }
            break;
        }
    }
    
    if (startIdx !== -1 && endIdx !== -1) {
        const block = lines.slice(startIdx, endIdx + 1).join('\n');
        content = content.replace(block, replaceStr);
        fs.writeFileSync('src/components/MockTestFilesEditor.tsx', content);
        console.log('done via flexible search');
    } else {
        console.log('Failed to find block completely.');
    }
}
