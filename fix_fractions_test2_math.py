import json

with open('test2_math.json', 'r') as f:
    data = json.load(f)

# The user is complaining about fractions rendering as e.g. "a/b" instead of top and bottom numerator/denominator.
# We probably have a few instances where we parsed fractions to `a/b` instead of `\frac{a}{b}` or `a / b` using keyboard slash.
# But wait, looking at pt2-math-m1-q15:
# "options": [
#   "-\n\nrolor",
#   "-\n\nofr",
#   "dolor",
#   "op"
# ],
# This is clearly OCR artifacting.

with open('math_parsed.json', 'r') as f:
    math_parsed = json.load(f)

# Let's map over all questions in test2_math.json and update options/questions to use \frac{a}{b} and fix OCR issues
for m_idx, m_key in enumerate(['m1', 'm2']):
    test_module = data[m_idx]['questions']
    parsed_module = math_parsed[m_key]
    
    for i in range(len(test_module)):
        test_q = test_module[i]
        parsed_q = parsed_module[i]
        
        # If the question was fully parsed from LaTeX, use it. But test2_math.json already has \frac for some things?
        # Let's just fix test2_math.json using math_parsed.json since it's cleaner.
        if parsed_q['question']:
            test_q['question'] = parsed_q['question']
        
        if parsed_q['options'] and len(parsed_q['options']) > 0:
            # We skip if test_q['options'] was already manually set to __TABLE__ stuff (like q5)
            if '__TABLE__' not in str(test_q['options']):
                test_q['options'] = parsed_q['options']

with open('test2_math.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated test2_math.json with parsed LaTeX math content, which uses \frac instead of keyboard slashes where applicable.")
