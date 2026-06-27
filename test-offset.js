const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html><div id="container"><div>Hello <span>world</span>!</div></div>`);
const document = dom.window.document;
const container = document.getElementById("container");

const textNode = container.querySelector('span').firstChild; // "world"
const range = document.createRange();
range.setStart(textNode, 1); // "o"
range.setEnd(textNode, 4); // "l"

const preSelectionRange = range.cloneRange();
preSelectionRange.selectNodeContents(container);
preSelectionRange.setEnd(range.startContainer, range.startOffset);
const startOffset1 = preSelectionRange.toString().length;
console.log("startOffset1:", startOffset1); // should be "Hello w" -> 7 chars? "Hello " = 6, + "w" = 7.

let startOffset2 = 0;
const offsetWalker = document.createTreeWalker(container, dom.window.NodeFilter.SHOW_TEXT);
let nNode;
while ((nNode = offsetWalker.nextNode())) {
    if (nNode === range.startContainer) {
        startOffset2 += range.startOffset;
        break;
    }
    startOffset2 += nNode.textContent?.length || 0;
}
console.log("startOffset2:", startOffset2);
