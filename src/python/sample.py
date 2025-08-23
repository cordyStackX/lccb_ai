from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from transformers import pipeline, AutoTokenizer
import faiss
import numpy as np
import re
import spacy

try:
    from pdf2image import convert_from_path
    import pytesseract
except ImportError:
    convert_from_path = None
    pytesseract = None

def clean_text(text):
    # Remove excessive whitespace and non-printable characters
    return re.sub(r'\s+', ' ', text).strip()

def ask_pdf_ai(pdf_path, question):
    # Load PDF
    reader = PdfReader(pdf_path)
    text_pages = []
    for page in reader.pages:
        raw = page.extract_text()
        if raw:
            cleaned = clean_text(raw)
            if cleaned:  # Only add if not empty after cleaning
                text_pages.append(cleaned)

    # OCR fallback if no extractable text
    if not text_pages and convert_from_path and pytesseract:
        print("No extractable text found, running OCR...")
        images = convert_from_path(pdf_path)
        for img in images:
            ocr_text = pytesseract.image_to_string(img)
            cleaned = clean_text(ocr_text)
            if cleaned:
                text_pages.append(cleaned)
    elif not text_pages:
        raise ValueError("PDF has no extractable text and OCR dependencies are missing.")

    text = " ".join(text_pages)

    # Sentence-based chunking with spaCy
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]
    chunk_size = 3  # Try 3-4 sentences per chunk
    chunks = []
    for i in range(0, len(sentences), chunk_size):
        chunk = " ".join(sentences[i:i+chunk_size])
        if chunk.strip():
            chunks.append(chunk)
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

    q_emb = model.encode([question])
    q_emb = np.array(q_emb)
    if q_emb.ndim == 1:
        q_emb = np.expand_dims(q_emb, axis=0)

    D, I = index.search(q_emb, k=min(3, len(chunks)))

    # Summarization
    print("\nBuilding summary...")
    summarizer = pipeline(
        "summarization",
        model="sshleifer/distilbart-cnn-12-6",
        device=0  # Use GPU (CUDA device 0)
    )

    # Load tokenizer for the summarizer model
    tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")
    model_max_length = tokenizer.model_max_length  # usually 1024 for BART

    def get_safe_max_length(text, default=148, min_out=40):
        # Tokenize input and set max_length to 1/3 of input tokens, but not more than model_max_length
        input_tokens = len(tokenizer.encode(text, truncation=True, max_length=model_max_length))
        # Output summary should be shorter than input
        safe_max = min(default, max(min_out, input_tokens // 3, 60))
        # Never exceed model's max_length
        return min(safe_max, model_max_length)

    # Streaming summaries
    print("\nStreaming summaries:")
    intermediate = []
    for i, c in enumerate(chunks):
        # Skip extremely short fragments
        if len(c.split()) < 15:
            continue
        max_len = get_safe_max_length(c)
        summary_part = summarizer(
            c,
            max_length=max_len,
            min_length=40,
            do_sample=False,
            truncation=True,
        )[0]["summary_text"]
        print(f"Chunk {i+1}/{len(chunks)} \n summary:{summary_part}\n")
        intermediate.append(summary_part)

    if not intermediate:
        raise ValueError("Could not produce intermediate summaries.")

    # Final consolidation
    joined = " ".join(intermediate)
    final_max_len = get_safe_max_length(joined, default=180, min_out=60)
    final_summary = summarizer(
        joined[:6000],  # keep within model context
        max_length=final_max_len,
        min_length=10,
        do_sample=False,
        truncation=True,
    )[0]["summary_text"]

    print("\n=== PDF SUMMARY ===")
    print(final_summary)

    # After retrieval
    print(f"\nAI Answer to your question: {question}")
    context = chunks[I[0][0]]

    prompt = f"Question: {question}\nContext: {context}\nAnswer:"
    qa_max_len = get_safe_max_length(prompt, default=100, min_out=30)
    answer = summarizer(
        prompt,
        max_length=qa_max_len,
        min_length=30,
        do_sample=False,
        truncation=True,
    )[0]["summary_text"]
    print(f"AI Answer:\n{answer}\n")

    return answer, final_summary
