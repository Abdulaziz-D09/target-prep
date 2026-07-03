const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/gs;
const str = "Gabriella deposits $35 in a savings account at the end of each week. At the beginning of the 1<sup>st</sup> week of a year there was $600 in that savings account.";
console.log(str.match(regex));
