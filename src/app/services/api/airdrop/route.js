import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import ERC20_ABI from '@/app/services/web3_providers/transactions/ERC20_ABI';
import setting from '@/app/config/conf/setting.json';

const CLAIMED_PATH = path.resolve(process.cwd(), 'src/app/config/conf/claimed.json');

// Helper to load claimed addresses
function loadClaimed() {
  try {
    return new Set(JSON.parse(fs.readFileSync(CLAIMED_PATH, 'utf-8')));
  } catch {
    return new Set();
  }
}

// Helper to save claimed addresses
function saveClaimed(claimedSet) {
  fs.writeFileSync(CLAIMED_PATH, JSON.stringify([...claimedSet], null, 2));
}

// Replace with your deployed token address
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_LACOcoinAddress || setting.PUBLIC_ACCESS.CONTRACT_ADDRESS;
const PROVIDER_URL = process.env.NEXT_PUBLIC_LINK_PROJECT_ID || setting.PUBLIC_ACCESS.RPC_Endpoint;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || setting.PUBLIC_ACCESS.PRIVATE_KEY;

// Usage:
const airdropAmount = setting.set_airdrop.amount;

export async function POST(req) {
  const { address } = await req.json();

  if (!address) return Response.json({ success: false, message: 'No address provided.' });

  // Load claimed addresses from file
  const claimed = loadClaimed();
  if (claimed.has(address.toLowerCase())) {
    return Response.json({ success: false, message: 'Already claimed.' });
  }

  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    // Send 10 tokens (adjust decimals if needed)
    const tx = await token.transfer(address, ethers.parseUnits(airdropAmount.toString(), 18));
    await tx.wait();

    claimed.add(address.toLowerCase());
    saveClaimed(claimed);

    return Response.json({ success: true, txHash: tx.hash });
  } catch (error) {
    // Handle "already known" as success
    if (error?.error?.message?.includes("already known")) {
      claimed.add(address.toLowerCase());
      saveClaimed(claimed);
      return Response.json({ success: true, message: "Airdrop already sent or pending confirmation." });
    }
    console.error(error);
    return Response.json({ success: false, message: "If you see this error please use github repo instead of vercel" });
  }
}
