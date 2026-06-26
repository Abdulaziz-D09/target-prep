import re

with open('src/app/practice/test/[id]/page.tsx', 'r') as f:
    text = f.read()

print("Is passage rendered on the left?", "PassageRenderer" in text.split('Left Pane')[1].split('Right Pane')[0])
print("Is question rendered on the right?", "currentQuestion?.question" in text.split('Right Pane')[1])
