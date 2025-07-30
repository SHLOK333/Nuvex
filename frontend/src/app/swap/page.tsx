'use client';

import Navbar from "@/components/Navbar";
import SwapBox from "@/components/SwapBox";
import Image from 'next/image';

const Swap = () => {
    return(
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            <div className='flex flex-col justify-center items-center py-8'>
                <Image src='/1inch_asset.png' alt='1inch Logo' height={80} width={95} className="mb-6" />
                <SwapBox />
            </div>
        </div>
    )
}

export default Swap;