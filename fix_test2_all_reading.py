import json

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# The parser broke text for Reading sections.
# Let's fix EVERY question in Test 2 Reading where the text was split improperly.
for m_idx in range(2): # modules 0 and 1
    for q_idx, q in enumerate(data[m_idx]['questions']):
        # If question contains \n and some text that doesn't belong
        if q['type'] == 'Reading and Writing':
            pass
            # wait, it's easier to just re-parse test2_questions.txt with a BETTER parser script,
            # or fix the specific ones that are broken.
            # "what the fuck is this why is question 14 inside question 13" -> we already fixed M2 Q13 and M1 Q12 overlap.
            
