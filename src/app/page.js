"use client";
import { useState, useEffect } from "react";
import { Header, Banner, ChatBot } from '@/app/components/GlobalImports';
import { CheckConnections } from '@/app/modules/Modules__Imports';
import { GridLoader } from 'react-spinners';
import config from "@/app/config/conf/setting";

const RPC_Endpoint_json = process.env.NEXT_PUBLIC_LINK_PROJECT_ID || config.PUBLIC_ACCESS.RPC_Endpoint;

export default function Home() {
  const [showChatBot, setShowChatBot] = useState(false);
  const [RPC_Endpoint, setRPC_Endpoint] = useState(false);
  const [connections, setConnections] = useState(false);

  useEffect(() => {
  let isMounted = true;

  const checkLoop = async () => {

    if (RPC_Endpoint_json !== "") {
        setRPC_Endpoint(true);
        console.log("RPC Connected:", RPC_Endpoint_json);
    }

    while (isMounted) {

      const res = await CheckConnections();

      if (res.status === "ok") {
        setConnections(true);
        break; // stop checking once connected
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  checkLoop();

  return () => {
    isMounted = false;
  };
}, []);


  return (
    <main>
      <div className="Home">

        <div className="warning__container">
          <div className={`${RPC_Endpoint ? "hidden" : "warning"}`}><p>⚠️ Missing <u>RPC_Endpoint</u> at src/app/config/conf/setting.json</p> </div>

          <div className={`${connections ? "hidden" : "warning"}`}><p>⚠️ No Connection <u>API__python__check__connections</u> at src/app/config/conf/setting.json </p> <div><GridLoader color="#fff" size={5}/></div> </div>
        </div>

        
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
