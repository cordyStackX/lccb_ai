"use client";
import { useState } from "react";
import { Header, Banner, ChatBot } from '@/app/components/GlobalImports';

export default function Home() {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <main>
      <div className="Home">

        <Header />

        <Banner onDemoClick={() => setShowChatBot(true)} />

        <ChatBot visible={showChatBot} onClose={() => setShowChatBot(false)} />

        <footer>

        </footer>
      </div>
    </main>
  );
}
