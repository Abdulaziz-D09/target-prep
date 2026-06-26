import re

with open('test1_questions.txt', 'r') as f:
    lines = f.readlines()

new_lines = []
in_pineapple_table = False

for i, line in enumerate(lines):
    # Fix Edison bullets (replace * with -)
    if line.startswith('* '):
        new_lines.append(line.replace('* ', '- ', 1))
        continue
    
    # Fix Magical Realism HTML tags
    if '<i>' in line or '</i>' in line:
        line = line.replace('<i>', '*').replace('</i>', '*')
        
    if '<u>' in line or '</u>' in line:
        line = line.replace('<u>', '').replace('</u>', '')

    # Fix Pineapple table
    if "Effect of Various Soil Treatments on Mean Pineapple Fruit Weight and Size" in line:
        in_pineapple_table = True
        new_lines.append(line)
        new_lines.append("\n")
        new_lines.append("| Soil treatment | Weight (grams) | Length (centimeters) | Diameter (centimeters) |\n")
        new_lines.append("|---|---|---|---|\n")
        continue
        
    if in_pineapple_table:
        if line.strip() == "Weight Length Diameter":
            continue
        elif line.strip() == "Soil treatment (grams) (centimeters) (centimeters)":
            continue
        elif line.startswith("Control "):
            new_lines.append("| Control | 825.9 | 6.14 | 13.63 |\n")
            continue
        elif line.startswith("Biochar "):
            if "Biochar and compost" in line:
                new_lines.append("| Biochar and compost | 979.3 | 6.76 | 13.68 |\n")
            elif "Biochar and NPK fertilizer" in line:
                new_lines.append("| Biochar and NPK fertilizer | 1032.1 | 6.78 | 13.96 |\n")
            else:
                new_lines.append("| Biochar | 915.7 | 6.56 | 13.63 |\n")
            continue
        elif line.startswith("Compost "):
            new_lines.append("| Compost | 864.8 | 6.15 | 13.22 |\n")
            continue
        elif line.strip() == "":
            if i > 0 and lines[i-1].startswith("Biochar and NPK fertilizer"):
                in_pineapple_table = False
                new_lines.append("\n")
            else:
                if not lines[i-1].startswith("Biochar ") and not lines[i-1].startswith("Compost ") and not lines[i-1].startswith("Control "):
                    new_lines.append(line)
            continue
            
    new_lines.append(line)

with open('test1_questions.txt', 'w') as f:
    f.writelines(new_lines)
    
print("Fixed test1_questions.txt markdown formatting.")
