const { renderToString } = require('katex');
const math = "\\displaystyle \\frac{12x+28}{4} - \\frac{s}{13} = r(x - 8)";
try {
  console.log(renderToString(math, { throwOnError: false }));
} catch (e) {
  console.log('Error:', e);
}
