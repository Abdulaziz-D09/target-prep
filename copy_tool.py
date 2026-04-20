import shutil
import os

source_paths = [
    '/Users/abdulazizdavronov/.gemini/antigravity/brain/3c6d4ecd-90e5-404c-bba7-a44e50038369/sat_prep_card_1776311388165.png',
    '/Users/abdulazizdavronov/.gemini/antigravity/brain/3c6d4ecd-90e5-404c-bba7-a44e50038369/ielts_prep_card_1776311402531.png',
    '/Users/abdulazizdavronov/.gemini/antigravity/brain/3c6d4ecd-90e5-404c-bba7-a44e50038369/mock_exam_card_1776311420250.png',
    '/Users/abdulazizdavronov/.gemini/antigravity/brain/3c6d4ecd-90e5-404c-bba7-a44e50038369/portal_background_1776311434267.png'
]

file_names = [
    'sat_prep.png',
    'ielts_prep.png',
    'mock_exam.png',
    'background.png'
]

dest_dir = 'public/portal'

os.makedirs(dest_dir, exist_ok=True)

for src, name in zip(source_paths, file_names):
    dest = os.path.join(dest_dir, name)
    try:
        shutil.copy2(src, dest)
        print(f"Copied {src} to {dest}")
    except Exception as e:
        print(f"Error copying {src}: {e}")

try:
    os.makedirs('src/app/dashboard', exist_ok=True)
    shutil.copy2('src/app/page.tsx', 'src/app/dashboard/page.tsx')
    print("Moved dashboard")
except Exception as e:
    print(f"Error moving page: {e}")
