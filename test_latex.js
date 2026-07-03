const text = "$$\\frac{12x+28}{4} - \\frac{s}{13} = r(x - 8)$$\n\nIn the given equation, $s$ and $r$ are constants, and $s > 0$. If the equation has infinitely many solutions, what is the value of $s$?";

let preprocessed = text
    .replace(/(^|[\s(\[{])\*([a-zA-Z]+[a-zA-Z0-9\s]*)\*(?=[.,!?:;)\]}\s]|$)/g, '$1<i>$2</i>')
    .replace(/__IMAGE__[^\n]*\n?!\[[^\]]*\]\([^)]*\)\n?__ENDIMAGE__/g, '')
    .replace(/(!\[[^\]]*\]\([^)]+\))\n+/g, '$1')
    .replace(/(?:\\_){4,}/g, '_______')
    .replace(/\\n/g, '\n');

preprocessed = preprocessed.replace(
    /(\n|^)([ \t]*\|[^\n]+\n[ \t]*\|[-:| ]+\|\n(?:[ \t]*\|[^\n]*\n?)*)/gm,
    function(match, newline, table) {
      if (match.includes('__TABLE__')) return match;
      return `${newline}\n__TABLE__\n${table.trim()}\n__ENDTABLE__\n`;
    }
);

const tableRegex = /(__TABLE__[\s\S]*?__ENDTABLE__|(?:(?:^|\n)(?:\|[^\n]+\|(?:\n|$))+))/g;
const tableParts = preprocessed.split(tableRegex);

tableParts.forEach((tPart, tIndex) => {
    if (!tPart) return;
    if (tPart.startsWith('__TABLE__') || (tPart.trim().startsWith('|') && tPart.trim().endsWith('|') && tPart.includes('\n'))) {
        console.log("TABLE:", tPart);
        return;
    }
    const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
    const parts = tPart.replace(/^\n+|\n+$/g, '').split(regex);
    console.log("PARTS:", parts);
});

