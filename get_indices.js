const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));
const fixedIds = ["a15b3219", "702eb7e3", "1281dfd5", "d83c3d54", "403fb4e4", "040583a5", "3dc911d6", "d5b9ed0d", "ccb1ab92", "be19faa1", "645fd11a", "a9040290", "15873d14", "8a584241", "7edfb2c5", "a16128e2", "da438257", "8a668840", "30c3aa98", "239d3535", "b30a2613", "b71861fc", "742fd8ba", "a9ac31e4", "df34b586", "b29c520a", "53c6c179", "f71802d6", "3233c162", "d74b9bc6", "a2b0fc3b", "d5da74be", "02848335", "1703403b", "b470d853", "ff18829b", "e2829dd7", "6af80ff3", "df37c087", "2df730d0", "5d453dcc", "e441da80", "82bdf676", "0b634641", "e99a38ec", "b074cc05", "1db1a9a6", "37a49687", "89f71526", "3430be35", "8af28416", "303bcc41", "224428ac", "7dab4d5d", "627d93e3", "23e2421a", "5c73f0cc", "800771e5", "cbdd5287"];

const results = fixedIds.map(id => {
    const index = data.findIndex(q => q.id === id);
    return `${index + 1} / ${data.length}`;
});

console.log(results.join('\n'));
