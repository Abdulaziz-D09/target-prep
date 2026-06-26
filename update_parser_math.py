import re

with open('parser_all.py', 'r') as f:
    text = f.read()

math_format_logic = """
        if "Math" in start_marker:
            question = main_text
            passage = ""
            
            # Auto-format math in questions and options!
            def format_math(text_str):
                # Replace fractions like 1/2 with \\frac{1}{2}
                text_str = re.sub(r'(\\b\\d+)/(\\d+\\b)', r'$$\\frac{\\1}{\\2}$$', text_str)
                # Ensure single variables are italicized? 
                # Actually, the user manually added <i> to some things, let's leave <i>.
                return text_str
                
            question = format_math(question)
            options = [format_math(opt) for opt in options]
"""

text = text.replace('        if "Math" in start_marker:\n            question = main_text\n            passage = ""', math_format_logic)

with open('parser_all.py', 'w') as f:
    f.write(text)

