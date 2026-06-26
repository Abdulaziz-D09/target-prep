import json

with open('test2_parsed.json', 'r') as f:
    data = json.load(f) # this is a list of modules, where each is {"questions": [...]}

# Module 1 is data[0], Module 2 is data[1]
# Module 1 Q12:
# In test2_questions.txt:
# 12.
# Which choice most effectively uses data from the table to complete the text?
# Effect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size
# Weight Length Diameter
# Soil treatment (grams) (centimeters) (centimeters)
# Control 825.9 6.14 13.63
# Biochar 915.7 6.56 13.63
# Compost 864.8 6.15 13.22
# Biochar and compost 893.3 6.76 13.68
# Biochar and NPK fertilizer 1032.1 6.78 13.96
# Working in Ghana, Emmanuel Hanyabui...
# A. compost alone.
# B. biochar alone.
# C. biochar and compost.
# D. biochar and NPK fertilizer.
# Answer: C

# Right now in test2_parsed.json, m1 q12 got split into q12 and q13!
# Let's fix q12 to contain the full text and options.
data[0]['questions'][11]['passage'] = "Effect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size\n\n__TABLE__\nSoil treatment | Weight (grams) | Length (centimeters) | Diameter (centimeters)\n--- | --- | --- | ---\nControl | 825.9 | 6.14 | 13.63\nBiochar | 915.7 | 6.56 | 13.63\nCompost | 864.8 | 6.15 | 13.22\nBiochar and compost | 893.3 | 6.76 | 13.68\nBiochar and NPK fertilizer | 1032.1 | 6.78 | 13.96\n__ENDTABLE__\n\nWorking in Ghana, Emmanuel Hanyabui and colleagues compared the impact on pineapple growth of different combinations of soil additives, including NPK fertilizer (an inorganic fertilizer containing nitrogen, phosphorus, and potassium), organic compost, and biochar (a carbon-rich material produced from organic waste matter). Based on data in the table, pineapple farmers with no access to inorganic soil additives would likely increase the weight and size of their fruits by the greatest amount by using"
data[0]['questions'][11]['question'] = "Which choice most effectively uses data from the table to complete the text?"
data[0]['questions'][11]['options'] = [
    "compost alone.",
    "biochar alone.",
    "biochar and compost.",
    "biochar and NPK fertilizer."
]
data[0]['questions'][11]['answer'] = 2

# We need to remove the broken q13 and shift the remaining ones.
# Also fix the IDs so they are sequential again!
del data[0]['questions'][12]

# Let's check if the remaining have correct IDs and nums.
for i, q in enumerate(data[0]['questions']):
    q['num'] = i + 1
    q['id'] = f"pt2-reading-m1-q{i+1}"

with open('test2_parsed.json', 'w') as f:
    json.dump(data, f, indent=2)

with open('test2_reading.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed module 1 overlap and renumbered.")
