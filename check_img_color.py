from PIL import Image

img = Image.open('public/math-bank/3f5a3602.png')
print("Image size:", img.size)
# Check the color of the top-left pixel
print("Top-left pixel:", img.getpixel((0, 0)))
# Check the color of the middle pixel
print("Middle pixel:", img.getpixel((img.size[0]//2, img.size[1]//2)))

# Check if there is a grey border
colors = img.getcolors(maxcolors=1000000)
# sort colors by count
colors.sort(key=lambda x: x[0], reverse=True)
print("Top 5 colors:", colors[:5])

