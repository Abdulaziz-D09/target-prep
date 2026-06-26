with open('src/app/globals.css', 'r') as f:
    text = f.read()

if '.italic {' not in text:
    text += """
.italic {
  font-style: italic !important;
}
"""
    with open('src/app/globals.css', 'w') as f:
        f.write(text)
    print("Added italic class to globals.css")
else:
    print("Already exists")
