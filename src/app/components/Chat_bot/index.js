"use client";
import { useEffect, useState } from 'react';
import { HandleSubmit, HandleAsk, WagmiTransferToken } from '@/app/modules/Modules__Imports';
import { useAccount, useBalance } from 'wagmi';
import config from '@/app/config/conf/setting';

export default function ChatBot({ visible, onClose }) {
  // const [question, setQuestion] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const [airdropStatus, setAirdropStatus] = useState("");

  const tokenAddress = process.env.NEXT_PUBLIC_LACOcoinAddress || config.PUBLIC_ACCESS.CONTRACT_ADDRESS;

  const { data: tokenBalance, isLoading } = useBalance({
      address,
      token: tokenAddress,
      watch: true,
  });

  const OnSubmit = async (event) => {

    event.preventDefault();

    await WagmiTransferToken(address);

    await HandleSubmit(pdfFile, address);
  };

  const OnAsk = async (event) => {
    await HandleAsk(event, questions, address, setResponse, setLoading);
  };

  useEffect(() => {
    if (isConnected && address) {
      setAirdropStatus("Checking for airdrop...");
      fetch("/services/api/airdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAirdropStatus("🎉 Free token sent!");
          } else {
            setAirdropStatus(data.message || "Already received airdrop.");
          }
        })
        .catch(() => setAirdropStatus("Airdrop error."));
    }
  }, [isConnected, address]);

  if (!visible) return null;

  return (
    <section className='ChatBot'>
      {isConnected && (
        <div style={{ marginLeft: 12 }}>
            {isLoading
                ? "Loading token balance..."
                : `Balance: ${tokenBalance?.formatted} ${tokenBalance?.symbol}`}
        </div>
      )}
      <h2>Ask AI</h2>
      {isConnected && <div>{airdropStatus}</div>}

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
