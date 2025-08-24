from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from pathlib import Path
import uvicorn

app = FastAPI()

# CORS (so frontend like Next.js can talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory where files will be stored
UPLOAD_DIR = Path("/tmp/lccb_ai_uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Root test route
@app.get("/", response_class=PlainTextResponse)
def root():
    return "FastAPI running. Upload a PDF at /upload"

# Upload PDF route
@app.post("/upload")
async def upload_pdf(pdf: UploadFile = File(...)):
    # Generate a unique file ID
    file_id = uuid4().hex
    
    # Destination path for saving file
    dest = UPLOAD_DIR / f"{file_id}.pdf"
    
    # Save the uploaded PDF
    with open(dest, "wb") as f:
        f.write(await pdf.read())
    
    # Respond with file info
    return JSONResponse({
        "file_id": file_id,
        "filename": pdf.filename,
        "content_type": pdf.content_type,
        "saved_to": str(dest)
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
