"use client";

export default function Banner({ onDemoClick }) {
  return (
    <section className="Banner">
      <div className="Banner__content">
        <h1>La Consolacion College Bacolod AI</h1>
        <div className="Banner__subtitle">
          <p>Summarize and chat with your PDFs using AI.</p>
        </div>
        <div className="Banner__actions">
          <button onClick={onDemoClick}>Ask AI</button>
          <button onClick={() => window.open("https://github.com/cordy001/lccb_ai", "_blank")}>Use Github Repo</button>
        </div>
      </div>
      <span className="Banner__background">
        <span className="Banner__circle1"></span>
        <span className="Banner__circle2"></span>
      </span>
      
    </section>
  );
}
