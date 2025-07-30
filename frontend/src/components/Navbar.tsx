import Link from 'next/link';
import Image from 'next/image';
import { playClick } from './soundClick';
const Navbar = () => {
    return(
      <header className="border-b-4 border-yellow-400 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href='/'><Image src='/logo.png' alt='1inch logo' width={60} height={50}/></Link>
            <div className="text-2xl font-black tracking-wider">NUVEX</div>
          </div>
          <button onClick={playClick} className="bg-yellow-400 text-black px-6 py-3 font-black border-4 border-black hover:bg-yellow-300 transition-colors uppercase tracking-wider active:scale-95">
            Connect Wallet
          </button>
        </div>
      </header>
    )
}

export default Navbar;