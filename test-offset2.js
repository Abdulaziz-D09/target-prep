const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html><div id="container"><div>Hello <span>world</span>!</div></div>`);
const document = dom.window.document;
const container = document.getElementById("container");

const span = container.querySelector('span');
const range = document.createRange();
range.setStart(span, 0); 
range.setEnd(span, 1); 

const preSelectionRange = range.cloneRange();
preSelectionRange.selectNodeContents(container);
preSelectionRange.setEnd(range.startContainer, range.startOffset);
const startOffset1 = preSelectionRange.toString().length;
console.log("startOffset1:", startOffset1); 

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
