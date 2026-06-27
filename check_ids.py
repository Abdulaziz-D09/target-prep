import json

provided_ids = [
"a15b3219", "75e07a4d", "702eb7e3", "1281dfd5", "d83c3d54", "95388117", "403fb4e4", "0147b080", "040583a5", "7a1877be",
"bc7b1a04", "3dc911d6", "d5b9ed0d", "6a6bbac3", "ccb1ab92", "be19faa1", "645fd11a", "6177abc5", "a9040290", "bc1b8a42",
"15873d14", "8a584241", "7edfb2c5", "f452410b", "a16128e2", "0cf13ece", "da438257", "f8244f7c", "9debe79a", "3fc06a91",
"8a668840", "b8199d5a", "30c3aa98", "239d3535", "4042ff0b", "b30a2613", "b71861fc", "a95075c5", "742fd8ba", "a9ac31e4",
"df34b586", "b29c520a", "53c6c179", "7c21b4b5", "f71802d6", "e1546fd6", "9452092c", "626a1308", "3233c162", "d74b9bc6",
"a2b0fc3b", "d5da74be", "4411e15b", "81498c6a", "38e79659", "02848335", "25b70215", "55df0275", "1703403b", "cbecb873",
"eb775f90", "80fd9454", "c4bee178", "b470d853", "ff18829b", "e2829dd7", "a7c52fa4", "ccf414c9", "e18d75ea", "a04807d8",
"a0203977", "6af80ff3", "0ec15b5a", "cf7491c1", "df37c087", "2df730d0", "5d453dcc", "d102706f", "23b5cb59", "cebfb2c6",
"e441da80", "e37f79a7", "82bdf676", "0b634641", "dd349efc", "010fa3f0", "2c06139b", "e99a38ec", "01c1d9ee", "0b96fa93",
"b074cc05", "1db1a9a6", "37a49687", "89f71526", "3430be35", "5cf5c0d3", "b2e54b50", "cca6fae9", "8af28416", "303bcc41",
"145da981", "224428ac", "ede3f942", "7dab4d5d", "014b3394", "46e45728", "84136d69", "faaf484f", "627d93e3", "df9c5a1d",
"23e2421a", "df8caadd", "94c726fb", "5ff1ba73", "94978129", "0014477f", "5c73f0cc", "800771e5", "35ec767c", "24c1b7e4",
"11c00ab9", "56f477fb", "af125459", "cbdd5287", "6317295c", "ab94d40a", "54be8f96"
]

with open('src/data/ebrw_bank.json', 'r') as f:
    data = json.load(f)

bank_ids = {q['id'] for q in data}

found = []
missing = []
for pid in provided_ids:
    if pid in bank_ids:
        found.append(pid)
    else:
        missing.append(pid)

print(f"Total provided: {len(provided_ids)}")
print(f"Found in bank: {len(found)}")
print(f"Missing from bank: {len(missing)}")

if missing:
    print("\nMissing IDs:")
    print(", ".join(missing))

