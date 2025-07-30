import Link from "next/link";
import { playClick } from "@/components/soundClick";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto p-6">
        <section className="py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              CROSS-CHAIN
              <br />
              <span className="text-yellow-400">SWAPS</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed">
              BREAK THE BARRIERS. SWAP TOKENS ACROSS ANY BLOCKCHAIN. 
              ONE INTERFACE. UNLIMITED POSSIBILITIES.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white text-black p-8 border-4 border-yellow-400">
              <div className="text-4xl font-black mb-4 text-yellow-400">01</div>
              <h3 className="text-2xl font-black mb-4 uppercase">INSTANT SWAPS</h3>
              <p className="font-bold">
                Execute cross-chain swaps in seconds. No waiting, no hassle.
              </p>
            </div>
            
            <div className="bg-yellow-400 text-black p-8 border-4 border-white">
              <div className="text-4xl font-black mb-4">02</div>
              <h3 className="text-2xl font-black mb-4 uppercase">MULTI-CHAIN</h3>
              <p className="font-bold">
                Support for Ethereum, BTC, XRP, Cardano.
              </p>
            </div>
            
            <div className="bg-white text-black p-8 border-4 border-yellow-400">
              <div className="text-4xl font-black mb-4 text-yellow-400">03</div>
              <h3 className="text-2xl font-black mb-4 uppercase">BEST RATES</h3>
              <p className="font-bold">
                Get the most out of your swap using 1inch Fusion+ Swaps
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-yellow-400 text-black p-12 border-8 border-white">
            <h2 className="text-4xl font-black mb-6 uppercase">START SWAPPING NOW</h2>
            <button onClick={playClick} className="bg-black text-yellow-400 px-12 py-4 text-xl font-black border-4 border-white hover:bg-gray-700 transition-colors uppercase tracking-wider active:scale-95">
              <Link href='/swap'>Launch App</Link>
            </button>
          </div>
        </section>

        {/* Supported Chains */}
        <section className="py-16 border-t-4 border-yellow-400">
          <h2 className="text-4xl font-black text-center mb-12 uppercase">
            SUPPORTED <span className="text-yellow-400">CHAINS</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {['ETHEREUM', 'SEPOLIA', 'XRP', 'BTC', 'CARDANO'].map((chain) => (
              <div key={chain} className="bg-white text-black p-6 border-4 border-yellow-400 text-center hover:scale-110 duration-200">
                <div className="text-2xl font-black">{chain}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-yellow-400 p-6 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-bold">© 2025 NUVEX. POWERED BY 1INCH PROTOCOL.</p>
        </div>
      </footer>
    </div>
  );
}
