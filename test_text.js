let preprocessed = "8x + 4y = \\\[?]-10x - 4y = -64$";
preprocessed = preprocessed.replace(/([^$\n]+?)\s*\\\[\?\]\s*([^$\n]+)\$?$/gm, '$$\\begin{cases} $1 \\\\ $2 \\end{cases}$$');
console.log(preprocessed);
