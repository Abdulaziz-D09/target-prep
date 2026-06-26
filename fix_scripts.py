import re

def fix_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Find the block where these lines are:
    old_block = """
        q_chunk = re.sub(r'^\\s*\\d+\\.\\s*\\n*', '', q_chunk).strip()
        
        if 'hard (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('hard (27 questions)')[-1].strip()
        if 'unknown (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('unknown (27 questions)')[-1].strip()
        if 'questions)' in q_chunk and 'Section' in q_chunk:
             q_chunk = q_chunk.split('questions)')[-1].strip()
"""

    new_block = """
        if 'hard (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('hard (27 questions)')[-1].strip()
        if 'unknown (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('unknown (27 questions)')[-1].strip()
        if 'questions)' in q_chunk and 'Section' in q_chunk:
             q_chunk = q_chunk.split('questions)')[-1].strip()
             
        q_chunk = re.sub(r'^\\s*\\d+\\.\\s*\\n*', '', q_chunk).strip()
"""
    # Just to be safe, let's do a more robust regex replacement
    
    # We want to make sure that the `re.sub` is right after the `split` statements
    
    content = content.replace("q_chunk = re.sub(r'^\\s*\\d+\\.\\s*\\n*', '', q_chunk).strip()", "")
    
    content = content.replace("q_chunk = q_chunk.split('questions)')[-1].strip()", 
        "q_chunk = q_chunk.split('questions)')[-1].strip()\n        q_chunk = re.sub(r'^\\\\s*\\\\d+\\\\.\\\\s*\\\\n*', '', q_chunk).strip()")
        
    with open(filename, 'w') as f:
        f.write(content)

fix_file("update_english_m1.py")
fix_file("update_english_m2.py")
