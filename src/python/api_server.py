from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import uvicorn

# Import your AI logic here (move your functions/classes to a separate module if needed)
# For this example, let's assume you move your AI logic into a function called `ask_pdf_ai`

app = FastAPI()

@app.post("/ask")
async def ask_ai(
    question: str = Form(...),
    pdf: UploadFile = File(...)
):
    # Save uploaded PDF to disk
    pdf_path = f"/tmp/{pdf.filename}"
    with open(pdf_path, "wb") as f:
        f.write(await pdf.read())

    # Call your AI logic (refactor your script into a function that takes pdf_path and question)
    # Example:
    # answer, summary = ask_pdf_ai(pdf_path, question)
    # For now, just return a placeholder:
    answer, summary = "This is a placeholder answer.", "This is a placeholder summary."

    return JSONResponse({
        "answer": answer,
        "summary": summary
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)