const fs = require('fs');
const file = 'src/app/classroom/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `<motion.div className="flex flex-col gap-4" variants={itemRevealVariants}>
                            {visibleAssignments.map(({ assignment, total, answered, completed, classroomLabel }) => {`;

const newStr = `<motion.div className="flex flex-col gap-4 min-h-[500px] overflow-y-auto pr-2 pb-10" variants={itemRevealVariants}>
                            {visibleAssignments.map(({ assignment, total, answered, completed, classroomLabel }) => {`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log("Fixed student dashboard list height");
} else {
    console.log("Could not find the target to replace");
}
