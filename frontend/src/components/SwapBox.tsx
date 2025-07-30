
'use client';

import { useState } from 'react';
import Image from 'next/image';

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', logo: '/eth.svg' },
  { symbol: 'BTC', name: 'Bitcoin', logo: '/btc.svg' },
  { symbol: 'ADA', name: 'Cardano', logo: '/cardano.svg' },
  { symbol: 'XRP', name: 'Ripple', logo: '/xrp.svg' }
];

const SwapBox = () => {
    const [activeTab, setActiveTab] = useState('swap');
    const [fromToken, setFromToken] = useState(tokens[0]);
    const [toToken, setToToken] = useState(tokens[1]);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [showFromTokens, setShowFromTokens] = useState(false);
    const [showToTokens, setShowToTokens] = useState(false);
    const [slippageTolerance, setSlippageTolerance] = useState('0.5');
    const [showSlippage, setShowSlippage] = useState(false);
    const [limitPrice, setLimitPrice] = useState('');

    const handleSwapTokens = () => {
        const temp = fromToken;
        setFromToken(toToken);
        setToToken(temp);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    return(
        <div className="bg-black rounded-lg w-[500px] p-4 border border-gray-700">
            {/* Header with Swap/Limit tabs */}
            <div className="flex items-center mb-4">
                <div className="flex">
                    <button 
                        onClick={() => setActiveTab('swap')}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 hover:bg-transparent text-primary cursor-pointer hover:text-white ${activeTab === 'swap' ? 'text-white' : 'text-gray-500'}`}
                    >
                        Swap
                    </button>
                    <button 
                        onClick={() => setActiveTab('limit')}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 hover:bg-transparent text-primary cursor-pointer hover:text-white ${activeTab === 'limit' ? 'text-white' : 'text-gray-500'}`}
                    >
                        Limit
                    </button>
                </div>
            </div>

            {/* You pay section */}
            <div className="mb-3">
                <label className="text-gray-400 text-sm mb-2 block">You pay</label>
                <div className="bg-gray-950 rounded-lg p-3 border border-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="relative">
                            <button 
                                onClick={() => setShowFromTokens(!showFromTokens)}
                                className="flex items-center space-x-2 text-left"
                            >
                                <Image src={fromToken.logo} alt={fromToken.name} width={24} height={24} className="rounded-full" />
                                <span className="font-medium">{fromToken.symbol}</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {showFromTokens && (
                                <div className="absolute top-full left-0 mt-2 bg-gray-700 rounded-lg border border-gray-600 z-10 min-w-[140px]">
                                    {tokens.filter(token => token.symbol !== toToken.symbol).map((token) => (
                                        <button
                                            key={token.symbol}
                                            onClick={() => {
                                                setFromToken(token);
                                                setShowFromTokens(false);
                                            }}
                                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            <Image src={token.logo} alt={token.name} width={16} height={16} className="rounded-full" />
                                            <span>{token.symbol}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <input
                            type="number"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            placeholder="0"
                            className="bg-transparent text-right text-xl font-medium outline-none w-32"
                        />
                    </div>
                    <div className="text-gray-400 text-sm mt-1">{fromToken.name}</div>
                </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center my-3">
                <button 
                    onClick={handleSwapTokens}
                    className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </button>
            </div>

            {/* You receive section */}
            <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">You receive</label>
                <div className="bg-gray-950 rounded-lg p-3 border border-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="relative">
                            <button 
                                onClick={() => setShowToTokens(!showToTokens)}
                                className="flex items-center space-x-2 text-left"
                            >
                                <Image src={toToken.logo} alt={toToken.name} width={24} height={24} className="rounded-full" />
                                <span className="font-medium">{toToken.symbol}</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {showToTokens && (
                                <div className="absolute top-full left-0 mt-2 bg-gray-700 rounded-lg border border-gray-600 z-10 min-w-[140px]">
                                    {tokens.filter(token => token.symbol !== fromToken.symbol).map((token) => (
                                        <button
                                            key={token.symbol}
                                            onClick={() => {
                                                setToToken(token);
                                                setShowToTokens(false);
                                            }}
                                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            <Image src={token.logo} alt={token.name} width={16} height={16} className="rounded-full" />
                                            <span>{token.symbol}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <input
                            type="number"
                            value={toAmount}
                            onChange={(e) => setToAmount(e.target.value)}
                            placeholder="0"
                            className="bg-transparent text-right text-xl font-medium outline-none w-32"
                        />
                    </div>
                    <div className="text-gray-400 text-sm mt-1">{toToken.name}</div>
                </div>
            </div>

            {/* Slippage Tolerance (Swap) or Price Input (Limit) */}
            <div className="mb-4">
                {activeTab === 'swap' ? (
                    <div className="relative">
                        <button 
                            onClick={() => setShowSlippage(!showSlippage)}
                            className="flex items-center justify-between w-full text-gray-400 text-sm"
                        >
                            <span>Slippage Tolerance</span>
                            <div className="flex items-center space-x-1">
                                <span>{slippageTolerance}%</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </button>
                        
                        {showSlippage && (
                            <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                                <div className="flex space-x-2">
                                    {['0.1', '0.5', '1.0'].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => setSlippageTolerance(value)}
                                            className={`px-3 py-1 rounded text-sm ${
                                                slippageTolerance === value 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            {value}%
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        value={slippageTolerance}
                                        onChange={(e) => setSlippageTolerance(e.target.value)}
                                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-16"
                                        placeholder="Custom"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <label className="text-gray-400 text-sm mb-2 block">
                            Pay {fromToken.symbol} at price
                        </label>
                        <div className="bg-gray-950 rounded-lg p-3 border border-gray-600">
                            <div className="flex items-center justify-between">
                                <input
                                    type="number"
                                    value={limitPrice}
                                    onChange={(e) => setLimitPrice(e.target.value)}
                                    placeholder="0"
                                    className="bg-transparent text-left text-xl font-medium outline-none flex-1"
                                />
                                <span className="text-gray-400 text-lg">USD</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action button */}
            <button className="w-full bg-white text-black py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors">
                {activeTab === 'swap' ? 'Swap' : 'Create Limit Order'}
            </button>
        </div>
    )
}

export default SwapBox;