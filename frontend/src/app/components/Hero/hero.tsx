import React from 'react';
import Nav from '../nav/nav';
export default function Hero() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center mt-2 text-[#5FF7E2]">
                TAX FILLING THAT ACTUALLY FITS YOUR LIFE
            </h1>
            <p className="text-lg text-left mt-5 text-white">
                Real humans on <br />demand + AI accuracy.  Fully compliant refund without the stress.
            </p>
        </div>
        
    );
}
