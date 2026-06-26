import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

os.makedirs('public/pt2', exist_ok=True)

# 1. Scatterplot (m1-q6.png)
fig, ax = plt.subplots(figsize=(6, 5))
ax.set_xlim(0, 7)
ax.set_ylim(0, 14)
ax.set_xticks(range(1, 8))
ax.set_yticks(range(2, 15, 2))
ax.grid(True, color='black', linestyle='-', linewidth=0.8)
ax.set_xlabel("Square footage of store\n(in thousands of square feet)", fontsize=12, labelpad=10)
ax.set_ylabel("Annual sales\n(in millions of dollars)", fontsize=12, labelpad=10)

# Make the bottom and left spines thicker and add arrows
ax.spines['left'].set_position('zero')
ax.spines['bottom'].set_position('zero')
ax.spines['right'].set_visible(False)
ax.spines['top'].set_visible(False)
ax.spines['left'].set_linewidth(2)
ax.spines['bottom'].set_linewidth(2)

# Arrows
ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False, markersize=8)
ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False, markersize=8)

ax.text(7.2, 0, '$x$', fontsize=14, va='center', ha='left')
ax.text(0, 14.5, '$y$', fontsize=14, va='bottom', ha='center')
ax.text(-0.2, -0.5, '$O$', fontsize=14, va='center', ha='center')

points = [
    (1, 2.3), (1.3, 2.6), (1.7, 2.5), (2, 4), (2.4, 5.6), 
    (3, 4), (3, 6.9), (3.1, 5.7), (5, 7.7), (5.3, 10.7), 
    (5.5, 9.9), (6, 12)
]
x_coords = [p[0] for p in points]
y_coords = [p[1] for p in points]
ax.plot(x_coords, y_coords, 'ko', markersize=8)

plt.tight_layout()
plt.savefig('public/pt2/m1-q6.png', dpi=300, bbox_inches='tight')
plt.close()


# 2. Parallel lines (m1-q10.png)
fig, ax = plt.subplots(figsize=(6, 5))
ax.set_xlim(0, 10)
ax.set_ylim(0, 8)
ax.axis('off')

# lines l and k
ax.plot([1, 9], [5, 5], 'k-', linewidth=1.5)
ax.plot([1, 9], [3, 3], 'k-', linewidth=1.5)
ax.text(9.5, 5, r'$\ell$', fontsize=16, va='center')
ax.text(9.5, 3, '$k$', fontsize=16, va='center')

# transversal t
ax.plot([1.5, 8.5], [7, 1], 'k-', linewidth=1.5)
ax.text(1.3, 7.2, '$t$', fontsize=14)

# angles
ax.text(4, 5.2, '$x^\circ$', fontsize=14)
ax.text(5.5, 3.2, '$y^\circ$', fontsize=14)

ax.text(5, 0, "Note: Figure not drawn to scale.", fontsize=12, ha='center')
plt.savefig('public/pt2/m1-q10.png', dpi=300, bbox_inches='tight')
plt.close()


# 3. Box plot (m1-q13.png)
fig, ax = plt.subplots(figsize=(7, 2))
ax.set_xlim(31, 51)
ax.set_ylim(0, 2)
ax.axis('off')

# Main axis line
ax.plot([32, 50], [0.5, 0.5], 'k-', linewidth=1.5)
for x in range(32, 51, 1):
    tick_len = 0.2 if x % 2 == 0 else 0.1
    ax.plot([x, x], [0.5 - tick_len, 0.5 + tick_len], 'k-', linewidth=1.5)
    if x % 2 == 0:
        ax.text(x, 0.1, str(x), fontsize=14, ha='center', va='top')

ax.text(41, -0.6, "Shoal bass length (cm)", fontsize=14, ha='center')

# Box plot elements
y = 1.2
h = 0.4
# Box
ax.add_patch(patches.Rectangle((36, y - h/2), 10, h, fill=False, edgecolor='black', linewidth=1.5))
# Median
ax.plot([41, 41], [y - h/2, y + h/2], 'k-', linewidth=1.5)
# Whiskers
ax.plot([34, 36], [y, y], 'k-', linewidth=1.5)
ax.plot([46, 48], [y, y], 'k-', linewidth=1.5)
# Caps
ax.plot([34, 34], [y - h/4, y + h/4], 'k-', linewidth=1.5)
ax.plot([48, 48], [y - h/4, y + h/4], 'k-', linewidth=1.5)

plt.savefig('public/pt2/m1-q13.png', dpi=300, bbox_inches='tight')
plt.close()


# 4. Triangle (m1-q14.png)
fig, ax = plt.subplots(figsize=(6, 3))
ax.set_xlim(0, 12)
ax.set_ylim(0, 5)
ax.axis('off')

# Triangle vertices
A = (1, 1)
B = (6, 4)
C = (11, 1)

# Draw triangle
ax.plot([A[0], B[0], C[0], A[0]], [A[1], B[1], C[1], A[1]], 'k-', linewidth=2)

# Altitude
ax.plot([B[0], B[0]], [B[1], A[1]], 'k--', linewidth=1.5)

# Right angle square
sq_size = 0.4
ax.plot([B[0], B[0] + sq_size], [A[1] + sq_size, A[1] + sq_size], 'k-', linewidth=1)
ax.plot([B[0] + sq_size, B[0] + sq_size], [A[1], A[1] + sq_size], 'k-', linewidth=1)

# Labels
ax.text(A[0]-0.3, A[1], '$A$', fontsize=14, ha='right', va='center')
ax.text(B[0], B[1]+0.2, '$B$', fontsize=14, ha='center', va='bottom')
ax.text(C[0]+0.3, C[1], '$C$', fontsize=14, ha='left', va='center')
ax.text(6.4, 2.5, '$h$', fontsize=14, ha='left', va='center')
ax.text(6, 0.5, '10 cm', fontsize=14, ha='center', va='top')

ax.text(6, -0.5, "Note: Figure not drawn to scale.", fontsize=12, ha='center')

plt.savefig('public/pt2/m1-q14.png', dpi=300, bbox_inches='tight')
plt.close()

print("Graphs generated successfully.")
