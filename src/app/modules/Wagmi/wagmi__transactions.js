import { ethers, parseUnits } from 'ethers';
import config from '@/app/config/conf/setting';
import tokenAbi from '@/app/services/web3_providers/transactions/ERC20_ABI'; // adjust path if needed

const tokenAddress = process.env.NEXT_PUBLIC_LACOcoinAddress || config.PUBLIC_ACCESS.CONTRACT_ADDRESS;
const platformAddress = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS || config.PUBLIC_ACCESS.PLATFORM_ADDRESS;

export default async function WagmiTransferToken(address) {
  if (!window.ethereum || !address) return false;

  import('sweetalert2').then(Swal => {
        Swal.default.fire({
            icon: 'info',
            title: 'Processing...',
            text: "Please wait while we upload your PDF.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
            Swal.default.showLoading();
            }
        });
    });

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // <-- await here!
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const decimals = 18; // LCC token decimals, adjust if different
    const amount = parseUnits("1", decimals);

    const balance = await tokenContract.balanceOf(await signer.getAddress());
    if (balance < amount) {
        import('sweetalert2').then(Swal => {
            Swal.default.fire({
                icon: 'warning',
                title: 'Insufficient Funds',
                text: "You do not have enough LCC tokens to complete this transaction.",
            });
        });
      
      return false;
    }

    const tx = await tokenContract.transfer(platformAddress, amount);
    const receipt = await tx.wait(); // wait for transaction confirmation

    if (receipt) {
      import('sweetalert2').then(Swal => {
          Swal.default.fire({
              icon: 'info',
              title: 'Transaction Confirmed',
              text: `Transaction confirmed with ${receipt}.`,
          });
      });
      return true;
    } else {
      import('sweetalert2').then(Swal => {
          Swal.default.fire({
              icon: 'warning',
              title: 'Transaction Canceled',
              text: "Transaction was canceled.",
          });
      });

    }

  } catch (err) {
    console.error(err);
    
    import('sweetalert2').then(Swal => {
        Swal.default.fire({
            icon: 'error',
            title: 'Transaction Failed',
            text: "There was an error processing your transaction.",
        });
    });

  }
};
