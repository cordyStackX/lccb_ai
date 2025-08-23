from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import faiss
import numpy as np
import re

def clean_text(text):
    # Remove excessive whitespace and non-printable characters
    return re.sub(r'\s+', ' ', text).strip()

# Load PDF
reader = PdfReader("file.pdf")
text_pages = []
for page in reader.pages:
    raw = page.extract_text()
    if raw:
        cleaned = clean_text(raw)
        if cleaned:  # Only add if not empty after cleaning
            text_pages.append(cleaned)

if not text_pages:
    raise ValueError("PDF has no extractable text (might be scanned; try OCR).")

text = " ".join(text_pages)

# Split into chunks (simple char-based)
chunk_size = 500
chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
if not chunks:
    raise ValueError("No text chunks created from PDF!")

# Embeddings + FAISS (for retrieval if needed)
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(chunks)
embeddings = np.array(embeddings)
if embeddings.ndim == 1:
    embeddings = np.expand_dims(embeddings, axis=0)

index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

# Example semantic query
query = "What is the Marc expertise?"
q_emb = model.encode([query])
q_emb = np.array(q_emb)
if q_emb.ndim == 1:
    q_emb = np.expand_dims(q_emb, axis=0)

D, I = index.search(q_emb, k=min(3, len(chunks)))
print("Top retrieved chunks:")
for i in I[0]:
    print("----")
    print(chunks[i])

# Summarization
print("\nBuilding summary...")
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

intermediate = []
for c in chunks:
    # Skip extremely short fragments
    if len(c.split()) < 15:
        continue
    summary_part = summarizer(
        c,
        max_length=140,
        min_length=40,
        do_sample=False,
        truncation=True,
    )[0]["summary_text"]
    intermediate.append(summary_part)

if not intermediate:
    raise ValueError("Could not produce intermediate summaries.")

# Final consolidation
joined = " ".join(intermediate)
final_summary = summarizer(
    joined[:6000],  # keep within model context
    max_length=180,
    min_length=60,
    do_sample=False,
    truncation=True,
)[0]["summary_text"]

print("\n=== PDF SUMMARY ===")
print(final_summary)
