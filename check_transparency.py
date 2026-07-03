from PIL import Image

img = Image.open('public/math-bank/3f5a3602.png')
print("Mode:", img.mode)
if img.mode == 'RGBA':
    extrema = img.getextrema()
    print("Alpha extrema:", extrema[3])
