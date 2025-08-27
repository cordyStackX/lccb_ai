import Image from 'next/image';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
    
    return(
        <header className="Header">
            <div className="Header__content">
                <div className="Header__logo">
                    <Image 
                    src="/images/logo.png" 
                    alt="Logo" 
                    width={50} 
                    height={50} 
                    />
                </div>
                <div className='Header__title'>
                    <h2>LCCB AI</h2>
                </div>
                <div className='Header__actions'>
                    <ConnectButton showBalance={false}/>
                </div>
            </div>
        </header>
    )
}