const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/gs;
const str = "Gabriella deposits $35 in a savings account. She has $600 total.";
console.log(str.match(regex));
