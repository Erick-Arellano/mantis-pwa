import fitz
import sys

def extract_text(pdf_path, txt_path):
    print(f"Extracting text from {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
        with open(txt_path, 'w', encoding='utf-8') as f:
            for page in doc:
                f.write(page.get_text())
        print(f"Saved text to {txt_path}")
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")

extract_text('docs/U1_indice.pdf', 'U1_indice.txt')
