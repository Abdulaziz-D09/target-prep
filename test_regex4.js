let text1 = "$8x + 4y = \\\[?]$-10x - 4y = -64$";
let text2 = "8x + 4y = \\\[?]-10x - 4y = -64";
let text3 = "$4x + 10y = \\\[?]$-8x - 10y = -64$";

let regex = /(?:^\s*\$?)?([^$\n]+?)\s*\\\[\?\](?:[$\s]*)([^$\n]+?)(?:[$\s]*)$/gm;

console.log("1:", text1.replace(regex, '$$\\begin{cases} $1 \\\\ $2 \\end{cases}$$'));
console.log("2:", text2.replace(regex, '$$\\begin{cases} $1 \\\\ $2 \\end{cases}$$'));
console.log("3:", text3.replace(regex, '$$\\begin{cases} $1 \\\\ $2 \\end{cases}$$'));
