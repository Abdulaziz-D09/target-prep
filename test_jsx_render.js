const React = require('react');
const { renderToString } = require('react-dom/server');

// Simplified mock of LatexRenderer behavior
function LatexRenderer({ text }) {
  const segments = [];
  const tokenRegex = /(<u>.*?<\/u>|\*\*.*?\*\*|<i>.*?<\/i>)/g;
  const tokens = text.split(tokenRegex);
  
  const formattedSegments = tokens.map((token, tIdx) => {
    const isUnderline = token.startsWith('<u>') && token.endsWith('</u>');
    const isBold = token.startsWith('**') && token.endsWith('**');
    const isItalic = token.startsWith('<i>') && token.endsWith('</i>');
    
    const innerText = isUnderline ? token.slice(3, -4) : (isBold ? token.slice(2, -2) : (isItalic ? token.slice(3, -4) : token));
    
    if (isItalic) {
      return React.createElement('i', { key: tIdx, className: 'italic' }, innerText);
    }
    return React.createElement('span', { key: tIdx }, innerText);
  });
  
  return React.createElement('span', null, formattedSegments);
}

console.log(renderToString(React.createElement(LatexRenderer, { text: "The following text is from Chinua Achebe's 1964 novel <i>Arrow of God</i>. The novel is set in" })));
