import re
import json

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# One more thing to fix: the user said "remove 1 why is it still liek this"
# Because the regex `.replace(/^\s*\d+[\.\)]\s*/, '')` doesn't remove "1." if it's not at the very start, or if there's text before it.
# Wait, look at `test2_parsed.json`:
# Q1: "num": 1
# "question": "1. \nWhich choice completes the text..." 
# No, it's just "Which choice completes the text..."
# Where does the "1" come from?
# Look at Q1:
# "passage": "Scientists have used machine learning tools to study elephant sounds..."
# Did I remove all numbers?
# Earlier I ran `q['passage'] = re.sub(r'^\s*\d+[\.\)]\s*', '', q['passage'])` but the python script failed!
# I need to run that cleanup AGAIN!
