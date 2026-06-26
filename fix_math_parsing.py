import json
import re

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# OH NO! The options for Q5 contain Q6 and Q7!
# "Answer: A\n\n\n6.          \n\nAnnual sales..."
# The parser for Math broke completely!

# Let's fix the parser for Math from scratch!
