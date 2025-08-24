"use client";
import { useState, useEffect } from "react";
import { Header, Banner, ChatBot } from '@/app/components/GlobalImports';
import config from "@/app/config/conf/setting";

const RPC_Endpoint = process.env.NEXT_PUBLIC_LINK_PROJECT_ID || config.PUBLIC_ACCESS.RPC_Endpoint;

export default function Home() {
  const [showChatBot, setShowChatBot] = useState(false);
  const [warning, setWarning] = useState(true);

  useEffect(() => {
    if (!RPC_Endpoint) {
      setWarning(false);
      
    }
  }, []);

  return (
    <main>
      <div className="Home">

        <div className={`${warning ? "hidden" : "warning"}`}><p>⚠️ Missing <u>RPC_Endpoint</u> at src/app/config/conf/setting.json</p></div>

        <Header />

        <Banner onDemoClick={() => setShowChatBot(true)} />

        <ChatBot visible={showChatBot} onClose={() => setShowChatBot(false)} />

        <footer>
            <a href="https://lcc.edu.ph/">© La Consolacion College Bacolod</a>
            <p>Developed by <a href="https://cordy-portfolio.vercel.app/">Cordy</a></p>
        </footer>
      </div>
    </main>
  );
}
