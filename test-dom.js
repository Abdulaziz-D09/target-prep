const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html><div id="container"><div>Hello <span>world</span>!</div></div>`);
const document = dom.window.document;
const container = document.getElementById("container");

const walker = document.createTreeWalker(container, dom.window.NodeFilter.SHOW_TEXT);
const textNodes = [];
let offset = 0;
let n;
while ((n = walker.nextNode())) {
    const len = n.textContent.length;
    if (len > 0) {
        textNodes.push({ node: n, start: offset, end: offset + len });
        offset += len;
    }
}
console.log("Text nodes:", textNodes.map(tn => tn.node.textContent + " (" + tn.start + "-" + tn.end + ")"));

const h = { start: 0, end: 11, color: 'yellow' };
const overlaps = textNodes.filter(tn => tn.end > h.start && tn.start < h.end);
overlaps.reverse().forEach(tn => {
    const relStart = Math.max(0, h.start - tn.start);
    const relEnd = Math.min(tn.node.length, h.end - tn.start);
    const range = document.createRange();
    range.setStart(tn.node, relStart);
    range.setEnd(tn.node, relEnd);
    const span = document.createElement('span');
    span.className = 'highlight';
    range.surroundContents(span);
});

console.log("Result:", container.innerHTML);
