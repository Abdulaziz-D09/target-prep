const text = `
$$\\frac{|3x-30|+3}{6} = 5$$

What is the sum of the solutions to the given equation?`;

const preprocessed = text
  .replace(/\n{2,}/g, '\n')
  .trim();

console.log("PREPROCESSED:", JSON.stringify(preprocessed));

const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
const parts = preprocessed.split(regex);

parts.forEach((part, index) => {
  let currentPart = part;
  if (index % 2 === 0) {
    if (index < parts.length - 1 && parts[index + 1].startsWith('$$')) {
      currentPart = currentPart.replace(/\n+$/, '');
    }
    if (index > 0 && parts[index - 1].startsWith('$$')) {
      currentPart = currentPart.replace(/^\n+/, '');
    }
  }
  console.log(`Part ${index}:`, JSON.stringify(currentPart));
});
