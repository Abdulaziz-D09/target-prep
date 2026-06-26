import json

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# The user is complaining about "question 14 inside question 13"
# Let's check test2_questions.txt
# Test 2 questions file had overlap around here.
# Let's also check if we need to format the table in m2 q13 properly.
q13 = data[1]['questions'][12]
if "Highest Major Summits in India" in q13['passage'] and "__TABLE__" not in q13['passage']:
    q13['passage'] = """Highest Major Summits in India

__TABLE__
Summit | Elevation (meters) | Mountain range | Prominence (meters)
--- | --- | --- | ---
Kangto | 7,060 | Assam Himalaya | 2,195
Saser Kangri III | 7,495 | Saser Karakoram | 850
Langpo | 6,965 | Sikkim Himalaya | 560
Sri Kailash | 6,932 | Garhwal Himalaya | 1,092
Mount Lakshmi | 6,983 | Rimo Karakoram | 800
__ENDTABLE__

Mountain summits are often described in terms of their elevation, or height above sea level.
But a summit's elevation may not be as good an indication of how high the mountain appears
to observers as is the summit’s prominence, or its height above its surroundings, and these
values can differ significantly. For example, the Indian mountain of"""

with open('test2_parsed.json', 'w') as f:
    json.dump(data, f, indent=2)

with open('test2_reading.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed module 2 q13 table.")
