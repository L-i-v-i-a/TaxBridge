import React from 'react';
import Nav from '../nav/nav';
export default function Hero() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-6 pt-0 pb-10">
            <h1 className="text-4xl font-bold text-center text-[#5FF7E2] leading-tight mb-2">
                TAX FILLING THAT ACTUALLY FITS YOUR LIFE
            </h1>
            <div className="w-190 max-w-7xl">
                <p className="text-3xl text-left text-white font-bold">
                   <span> Real humans on demand + AI accuracy.
                    <br />
                    Fully compliant refund without the stress.
                    </span>
                </p>
            </div>
        </div>
    );
}
