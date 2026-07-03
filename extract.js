const fs = require('fs');
const str = fs.readFileSync('.next/dev/server/chunks/ssr/src_data_math_bank_json_91171041._.js', 'utf8');

// Find the string inside JSON.parse('...') or JSON.parse("...") or JSON.parse(`...`)
const match = str.match(/JSON\.parse\(([`'"])(.*?)\1\)/s);
if (match) {
  // It's a string literal, we need to unescape it if it's parsed as JSON
  try {
    // We can evaluate the string to get the actual JSON text
    const jsonStr = eval(match[1] + match[2] + match[1]);
    
    // Parse it to make sure it's valid, then stringify beautifully
    const parsed = JSON.parse(jsonStr);
    fs.writeFileSync('src/data/math_bank.json', JSON.stringify(parsed, null, 2));
    console.log('Extracted successfully, array length:', parsed.length);
  } catch (e) {
    console.log('Error parsing extracted string', e);
  }
} else {
  console.log('Failed to match JSON.parse');
}
