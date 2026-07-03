const strings = [
    "The cost is $40 per unit, and the demand is $60 per unit.",
    "The equation $ax + ky = [?]$ is a line in the $xy$-plane.",
    "The value is $5$.",
    "Here is block math: $$\\frac{1}{2}$$",
    "Nested math $y = -\\frac{ax}{k} + \\frac{6}{k}$",
    "Mismatched currency $5 and $ x$",
];

// const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s).*?[^\s\\]\$(?!\\))/gs;
// Wait, for `$5$`, the inside is `5`. Length 1. `.*?[^\s\\]` requires at least 1 character. 
// If it's `$x$`, `x` is 1 char. It works.
const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/gs;

strings.forEach(s => {
    console.log("STRING:", s);
    const matches = s.match(regex);
    console.log("MATCHES:", matches);
    console.log("---");
});
