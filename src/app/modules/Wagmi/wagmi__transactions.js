import { ethers, parseUnits } from 'ethers';
import config from '@/app/config/conf/setting';
import tokenAbi from '@/app/services/web3_providers/transactions/ERC20_ABI'; // adjust path if needed
import { SweetAlert2, CheckConnections } from '@/app/modules/Modules__Imports';

const tokenAddress = process.env.NEXT_PUBLIC_LACOcoinAddress || config.PUBLIC_ACCESS.CONTRACT_ADDRESS;
const platformAddress = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS || config.PUBLIC_ACCESS.PLATFORM_ADDRESS;

export default async function WagmiTransferToken(address) {
  if (!window.ethereum || !address) return false;

  const res = await CheckConnections();

  if (res.status !== "ok") {
    SweetAlert2(
      'Error API',
      'Connection failed',
      'error',
      true,
      false
    );
    return false;
  }

  SweetAlert2(
    'Processing...',
    "Please wait while we upload your PDF.",
    'info',
    false,
    true
  );

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // <-- await here!
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const decimals = 18; // LCC token decimals, adjust if different
    const amount = parseUnits("1", decimals);

    const balance = await tokenContract.balanceOf(await signer.getAddress());
    if (balance < amount) {
      SweetAlert2(
        'Insufficient Funds',
        `You do not have enough LCC tokens to complete this transaction.`,
        'warning',
        true,
        false
      ).then((result) => {
        if (result.isConfirmed) {
          return false;
        }
      });
      
    }

    const tx = await tokenContract.transfer(platformAddress, amount);
    const receipt = await tx.wait(); // wait for transaction confirmation

    if (receipt) {
      
      return true;

    } else {
      SweetAlert2(
        'Transaction Failed',
        `Transaction failed with ${receipt}.`,
        'error',
        true,
        false
      ).then((result) => {
        if (result.isConfirmed) {
          return false;
        }
      });

    }

  } catch (err) {
    console.error(err);
    SweetAlert2(
      'Transaction Failed',
      `Something went wrong.`,
      'error',
      true,
      false
    ).then((result) => {
      if (result.isConfirmed) {
        return false;
      }
    });

  }
};
