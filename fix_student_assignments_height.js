const fs = require('fs');
const file = 'src/app/classroom/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The wrapper around the assignments map
const oldContent = `<motion.div className="flex flex-col gap-4" variants={itemRevealVariants}>
                            {myAssignments.map((assignment) => {`;
const newContent = `<motion.div className="flex flex-col gap-4 min-h-[500px] max-h-[800px] overflow-y-auto pr-2 pb-10" variants={itemRevealVariants}>
                            {myAssignments.map((assignment) => {`;

if (content.includes(oldContent)) {
    content = content.replace(oldContent, newContent);
    fs.writeFileSync(file, content);
    console.log("Fixed height");
} else {
    console.log("Could not find the target to replace");
}
