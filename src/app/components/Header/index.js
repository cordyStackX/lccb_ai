import Image from 'next/image';

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
                    <h2>La Consolacion College Bacolod AI</h2>
                </div>
                <div className='Header__actions'>
                    <button className='Header__button'>Connect Wallet Based</button>
                </div>
            </div>
        </header>
    )
}