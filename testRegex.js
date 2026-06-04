const str = "Home Console and Computer Games of the 1980s\n\n| Title | Approximate number of units sold worldwide | Genre | Developer |\n|---|---|---|---|\n| Super Mario Brothers 2 | 7,460,000 | platformer | Nintendo EAD Nintendo |\n| Ice Hockey | 2,420,000 | sports | |\n| Where in the World Is Carmen Sandiego? | 4,000,000 | education | Broderbund R&D2 Nintendo |\n| Tetris | 43,000,000 | puzzle | R&D1 |\n\nA student is writing a paper on the global rise of the home video game industry during the 1980s. The student is researching the relative popularity of various genres of console and computer games. Looking at the information in the table, the student finds that the games in the genres of _____";

let cleaned = str.replace(/(?:\n|^)([\s\S]*?)(\n?\|.*\|\n\|[-| ]+\|\n(?:\|.*\|\n?)+)/g, function(match, before, table) {
  if (before.includes('__TABLE__') || match.includes('__TABLE__')) return match;
  return `${before}\n__TABLE__\n${table.trim()}\n__ENDTABLE__\n`;
});
console.log(cleaned);
