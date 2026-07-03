let text = "$8x + 4y = \\\[?]$-10x - 4y = -64$";
let regex = /(?:^\s*\$?)?([^$\n]+?)\s*\\\[\?\](?:[$\s]*)([^$\n]+?)(?:[$\s]*)$/gm;
console.log(text.replace(regex, '$$$1 32$$\n$$$2$$'));
