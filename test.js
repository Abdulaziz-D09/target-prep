const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><div id="root">Hello world this is a test</div>`);
const document = dom.window.document;

const container = document.getElementById("root");

const highlights = [{ id: '1', start: 6, end: 11, color: 'yellow' }];

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

highlights.forEach(h => {
    const overlaps = textNodes.filter(tn => tn.end > h.start && tn.start < h.end);
    
    overlaps.reverse().forEach(tn => {
        const relStart = Math.max(0, h.start - tn.start);
        const relEnd = Math.min(tn.node.length, h.end - tn.start);
        
        try {
            const range = document.createRange();
            range.setStart(tn.node, relStart);
            range.setEnd(tn.node, relEnd);

            const span = document.createElement('span');
            span.className = `highlight-${h.color}`;
            range.surroundContents(span);
        } catch (e) {
            console.error("Failed:", e);
        }
    });
});

console.log(container.innerHTML);
