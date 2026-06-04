import json
import re

with open('pt1_english_full.json', 'r') as f:
    data = json.load(f)

def process_qs(qs):
    for q in qs:
        text = q['question']
        # Look for common question prompts
        prompts = [
            "Which choice completes the text with the most logical and precise word or phrase?",
            "As used in the text, what does the word",
            "Which choice best describes the function of the underlined",
            "Which choice best describes the overall structure of the text?",
            "Which statement about",
            "Based on the text,",
            "Based on the texts,",
            "Which choice most effectively uses data from the table",
            "Which choice most effectively uses data from the graph",
            "Which choice most logically completes the text?",
            "Which choice completes the text so that it conforms to the conventions of Standard English?",
            "Which choice completes the text with the most logical transition?",
            "The student wants to",
            "Which quotation from",
            "Which finding, if true, would most directly support",
            "Which finding, if true, would most directly weaken",
            "Which choice most effectively uses relevant information from the notes",
            "Which choice best states the main purpose of the text?",
            "What does the text most strongly suggest",
            "According to the text,"
        ]
        
        passage = text
        question_text = ""
        
        # Split by empty lines
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        for i, p in enumerate(paragraphs):
            is_prompt = False
            for pr in prompts:
                if p.startswith(pr) or (pr in p and p.endswith('?')):
                    is_prompt = True
                    break
            if is_prompt:
                question_text = p
                # Passage is everything else
                passage = "\n\n".join([x for j, x in enumerate(paragraphs) if j != i])
                break
        
        # fallback
        if not question_text and len(paragraphs) > 1:
            if paragraphs[0].endswith('?'):
                question_text = paragraphs[0]
                passage = "\n\n".join(paragraphs[1:])
            elif paragraphs[-1].endswith('?'):
                question_text = paragraphs[-1]
                passage = "\n\n".join(paragraphs[:-1])
                
        # Handle cases where there's no passage
        if not passage and question_text:
            passage = ""
            
        # If still no prompt found, just keep everything in question
        if question_text:
            q['passage'] = passage
            q['question'] = question_text

process_qs(data[0]['questions'])
process_qs(data[1]['questions'])

with open('pt1_english_full.json', 'w') as f:
    json.dump(data, f, indent=2)

