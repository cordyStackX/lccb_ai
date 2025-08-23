"use client";

export default function ChatBot({ visible, onClose }) {
    
  if (!visible) return null;

  return (
    <section className='ChatBot'>
      <h2>Try the Demo</h2>
      <p>Upload your PDF file and ask questions about its content.</p>
      <button>Upload PDF</button>
      <button onClick={onClose}>Close</button>
    </section>
  );
}
