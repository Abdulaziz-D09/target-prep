import re

with open('src/app/login/actions.ts', 'r') as f:
    content = f.read()

content = content.replace("if (error.message.includes(", "if (error?.message?.includes(")

with open('src/app/login/actions.ts', 'w') as f:
    f.write(content)
