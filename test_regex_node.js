const text = "The following text is from Chinua Achebe's 1964 novel <i>Arrow of God</i>. The novel is set in";
const tokenRegex = /(<u>.*?<\/u>|\*\*.*?\*\*|<i>.*?<\/i>)/g;
const tokens = text.split(tokenRegex);
console.log(tokens);
