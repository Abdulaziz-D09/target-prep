import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Fix M2 Q10 "Note: Figure not drawn to scale." floating without context
# The user's screenshot for pic4 shows M2 Q10, where there is a "Note: Figure not drawn to scale."
# and an image, and then "In the figure shown..."
# Actually let's look at the text for M2 Q10.
# The user's screenshot "pic4" (M1 Q10) says "Note: Figure not drawn to scale." above the image.
# Let's fix the M1 Q10:
# Right now it's:
# 10.
# 
# Note: Figure not drawn to scale.
# 
# ![Graph](/pt2/m1-q10.png)
# 
# In the figure shown, lines <$l$> and <$k$> are parallel and line $j$ intersects both lines. If $z$ > 116,
# which of the following must be true?
# A. y < 64

# Wait, let's fix Question 15! In the pic3, the user showed Q15 with red error "\displaystyle $x^2$ - 2x = 29".
# The user said "the fuck is this bitch... THE FUCK IS THAT NOTE DOING THERE... pic3 is question 9 dumbass this is how it need sto look like pic4 is what you did bithc what the fuck is this".
# The user might be complaining about Q15 because of the \displaystyle text showing up.
# Let's look at Q15 again.

