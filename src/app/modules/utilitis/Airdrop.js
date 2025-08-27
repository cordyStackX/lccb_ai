export default function Airdrop(isConnected, address, setAirdropStatus) {
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
}