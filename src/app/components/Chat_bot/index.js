"use client";
import { useState } from 'react';
import { HandleSubmit } from '@/app/modules/Modules__Imports';

export default function ChatBot({ visible, onClose }) {
  // const [question, setQuestion] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const OnSubmit = async (event) => {
    await HandleSubmit(event, pdfFile);
  };

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
      <form onSubmit={OnSubmit}>
      <div className="InputArea">
        <input  type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} required/>
      </div>

      <div className="ButtonArea">
        <button type="submit">Upload PDF</button>
        <button onClick={onClose}>Close</button>
      </div>
    </form>
    </section>
  );
}
