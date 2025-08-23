"use client";

export default function ChatBot({ visible, onClose }) {
    
  if (!visible) return null;

  return (
    <section className='ChatBot'>
      <h2>Try the Demo</h2>

      <div className="Response">
        <p>Upload your PDF file and ask questions about its content.</p>
      <div className="InputText">
        <input type="text" placeholder="Ask a question about your PDF..." />
      </div>
      </div>

      <div className="InputArea">
        <input type="file" accept="application/pdf" required/>
      </div>

      <div className="ButtonArea">
        <button onClick={() => alert("Under Development")}>Upload PDF</button>
        <button onClick={onClose}>Close</button>
      </div>
    </section>
  );
}
