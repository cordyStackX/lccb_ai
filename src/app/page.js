"use client";
import { useState, useEffect } from "react";
import { Header, Banner, ChatBot } from '@/app/components/GlobalImports';
import config from "@/app/config/conf/setting";

const PROJECT_ID = process.env.NEXT_PUBLIC_LINK_PROJECT_ID || config.PUBLIC_ACCESS.RPC_Endpoint;

export default function Home() {
  const [showChatBot, setShowChatBot] = useState(false);
  const [warning, setWarning] = useState(true);

  

  

  useEffect(() => {
    if (!PROJECT_ID) {
      setWarning(false);
      
    }
  }, []);

  return (
    <main>
      <div className="Home">

        <div className={`${warning ? "hidden" : "warning"}`}><p>⚠️ Missing <u>PROJECT_ID</u> at src/app/config/conf/setting.json</p></div>

        <Header />

        <Banner onDemoClick={() => setShowChatBot(true)} />

        <ChatBot visible={showChatBot} onClose={() => setShowChatBot(false)} />

        <footer>

        </footer>
      </div>
    </main>
  );
}
