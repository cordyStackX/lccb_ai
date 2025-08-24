"use client";
import { useState } from 'react';
import { HandleSubmit, HandleAsk } from '@/app/modules/Modules__Imports';
import { useAccount } from 'wagmi';

export default function ChatBot({ visible, onClose }) {
  // const [question, setQuestion] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const OnSubmit = async (event) => {
    await HandleSubmit(event, pdfFile, address);
  };

  const OnAsk = async (event) => {
    await HandleAsk(event, questions, address, setResponse, setLoading);
  };

  if (!visible) return null;

  return (
    <section className='ChatBot'>
      <h2>Ask AI</h2>

      <div className="Response">
        {loading && <p>AI is thinking... <br /> This may take a moment.</p>}
        {!loading && response && (
          <>
            {response.answer && <p><strong>Answer:</strong> {response.answer}</p>}
            {response.summary && <p><strong>Summary:</strong> {response.summary}</p>}
            {response.error && <p style={{ color: "salmon" }}>{response.error}</p>}
          </>
        )}
        <div className="InputText">
          <form onSubmit={OnAsk}>
            <input type="text" onChange={(e) => setQuestions(e.target.value)} placeholder="Ask a question about your PDF..." />
          </form>
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
