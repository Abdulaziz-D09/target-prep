const text = "$8x + 4y = 32$\n$-10x - 4y = -64$";
const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
const parts = text.split(regex);
console.log("PARTS:", JSON.stringify(parts));
parts.forEach((part, index) => {
    let currentPart = part;
    if (index % 2 === 0) {
        if (index < parts.length - 1 && parts[index + 1].startsWith('$$')) {
            currentPart = currentPart.replace(/\s+$/, '');
        }
        if (index > 0 && parts[index - 1].startsWith('$$')) {
            currentPart = currentPart.replace(/^\s+/, '');
        }
    }
    console.log(`PART ${index}: ${JSON.stringify(currentPart)}`);
});
