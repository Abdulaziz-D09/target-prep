import re

with open('test1_questions.txt', 'r') as f:
    text = f.read()

# 1. Fix massive newlines between options.
# A pattern like "A. ... \n\n\nB. ..."
# We will just replace 3 or more newlines with 2 newlines globally, 
# or maybe specifically between A., B., C., D.
text = re.sub(r'\n{3,}', '\n\n', text)

# Also fix the weird spaces like "A.  y(x-3) " -> "A. y(x-3)"
text = re.sub(r'([A-D]\.)\s+', r'\1 ', text)

# 2. Wrap math options in $ $
# Let's do this safely by only applying it to the Math sections
math_start_1 = text.find("### Section 2, Module 1: Math")
if math_start_1 != -1:
    before_math = text[:math_start_1]
    math_part = text[math_start_1:]
    
    # In math_part, find any option A. B. C. D. and wrap its content
    # Options are like "A. y(x-3)" or "A. 12"
    # We want to match: ^(A|B|C|D)\. (.*)$
    def wrap_option(m):
        letter = m.group(1)
        content = m.group(2).strip()
        
        # If it's already wrapped or contains text, maybe skip, but for Math, almost all are equations/numbers.
        if content.startswith('$') and content.endswith('$'):
            return f"{letter}. {content}"
        
        # If it's pure english words, don't wrap. But math options like "10" or "y(x-3)" should be wrapped.
        if re.search(r'[a-zA-Z]{5,}', content) and '^' not in content and '=' not in content:
            # It's an english sentence
            return f"{letter}. {content}"
        
        return f"{letter}. ${content}$"
        
    math_part = re.sub(r'^([A-D])\.\s*(.+)$', wrap_option, math_part, flags=re.MULTILINE)
    text = before_math + math_part

with open('test1_questions.txt', 'w') as f:
    f.write(text)

print("Fixed test1_questions.txt")
