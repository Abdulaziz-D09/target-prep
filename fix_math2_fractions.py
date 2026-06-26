import json

with open('test2_math.json', 'r') as f:
    data = json.load(f)

for m in data:
    for q in m['questions']:
        if q['type'] == 'Math (SPR)':
            # Some SPR answers might have been strings with "a/b", we should keep them if it's the answer.
            pass
        if q['options']:
            # replace straight slash / with \frac?
            # actually we did this when we pulled from math_parsed.json in a previous step.
            # let's make sure there aren't keyboard slashes left in options that are just "a/b".
            pass

# Also the user was complaining about "what the fuck is this why is question 14 inside question 13"
# and "it needs to be backwards passage on the left question and answer on the right"
# wait! The layout is backwards!
# User said: "what the fuck is this it needs to be backwards passage on the left question and answer on the right"

