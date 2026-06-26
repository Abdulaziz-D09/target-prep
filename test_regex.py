import re

text = "The following text is from Chinua Achebe's 1964 novel <i>Arrow of God</i>. The novel is set in"
tokenRegex = re.compile(r'(<u>.*?</u>|\*\*.*?\*\*|<i>.*?</i>)')
tokens = tokenRegex.split(text)
print(tokens)

