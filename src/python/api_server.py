from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pydantic import BaseModel
import uvicorn
from sample import ask_pdf_ai

app = FastAPI()

# CORS (so frontend like Next.js can talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory where files will be stored
UPLOAD_DIR = Path("./tmp/lccb_ai_uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Root test route
@app.get("/", response_class=PlainTextResponse)
def root():
    return "FastAPI running. Upload a PDF at /upload"

# Upload PDF route
@app.post("/upload")
async def upload_pdf(pdf: UploadFile = File(...), address: str = Form(...)):
    # Generate a unique file ID
    dest = UPLOAD_DIR / f"{address}.pdf"

    # Destination path for saving file
    dest = UPLOAD_DIR / f"{address}.pdf"

    # Save the uploaded PDF
    with open(dest, "wb") as f:
        f.write(await pdf.read())
    
    # Respond with file info
    return JSONResponse({
        "address": address,
        "filename": pdf.filename,
        "content_type": pdf.content_type,
        "saved_to": str(dest)
    })

# Health (optional)
@app.get("/healthz")
def healthz():
    return {"ok": True}

# JSON request model
class AskRequest(BaseModel):
    questions: str
    address: str

@app.post("/ask")
async def ask_ai(req: AskRequest):
    pdf_path = UPLOAD_DIR / f"{req.address}.pdf"
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="PDF not found. Upload first.")

    answer, summary = ask_pdf_ai(str(pdf_path), req.questions)
    return {"answer": answer, "summary": summary}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
