import fitz
import os

pdf_path = "CV.pdf"
en_path = "frontend/public/downloads/CV_en.pdf"
es_path = "frontend/public/downloads/CV_es.pdf"

# Open the original PDF
doc = fitz.open(pdf_path)

# Extract Page 1 (English)
doc_en = fitz.open()
doc_en.insert_pdf(doc, from_page=0, to_page=0)
doc_en.save(en_path)
doc_en.close()

# Extract Page 2 (Spanish)
doc_es = fitz.open()
doc_es.insert_pdf(doc, from_page=1, to_page=1)
doc_es.save(es_path)
doc_es.close()

doc.close()
print("PDFs successfully split into English (page 1) and Spanish (page 2).")
