"use client";
import { useEffect, useState } from 'react';
import { 
  // APIS Connections
  HandleSubmit, HandleAsk,
  // Providers
  WagmiTransferToken,
  // Utilities
  Airdrop
} from '@/app/modules/Modules__Imports';
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
    const confirmed = await WagmiTransferToken(address); 
    if (confirmed) {
      await HandleSubmit(pdfFile, address);
    }
  };

  const OnAsk = async (event) => {
    event.preventDefault();
    await HandleAsk(questions, address, setResponse, setLoading);
  };

  useEffect(() => {
      Airdrop(isConnected, address, setAirdropStatus);
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
