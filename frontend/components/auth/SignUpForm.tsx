"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-full flex-col justify-center px-10 py-12 min-[1440px]:px-[64px]">
      <p className="text-2xl font-semibold text-[#0D23AD]">Taxbridge</p>
      <h2 className="mt-6 text-[32px] font-semibold text-[#1C1C1C] min-[1440px]:text-[40px]">Sign up</h2>
      <p className="mt-2 text-sm text-[#7E7E7E]">Sign up to enjoy the feature of Taxbridge</p>

      <form className="mt-6 space-y-4 min-[1440px]:mt-[18px]">
        <div>
          <label className="text-sm text-[#5B5B5B]">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Friday Okafor"
            className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
          />
        </div>
        <div>
          <label className="text-sm text-[#5B5B5B]">Username</label>
          <input
            type="text"
            name="username"
            placeholder="friday.okafor"
            className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
          />
        </div>
        <div>
          <label className="text-sm text-[#5B5B5B]">Email</label>
          <input
            type="email"
            name="email"
            placeholder="friday.okafor@gmail.com"
            className="mt-2 h-12 w-full rounded-[10px] border border-[#2F4AD0] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
          />
        </div>
        <div>
          <label className="text-sm text-[#5B5B5B]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Friday@2026"
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              &#128065;
            </button>
          </div>
        </div>
        <Link
          className="mt-2 flex h-12 w-full items-center justify-center rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white min-[1440px]:h-[56px] cursor-pointer"
          href="/signup/bio"
        >
          Next
        </Link>
      </form>

      <div className="mt-6 flex items-center gap-3 text-sm text-[#7E7E7E]">
        <span className="h-px flex-1 bg-[#E5E5E5]" />
        <span>or</span>
        <span className="h-px flex-1 bg-[#E5E5E5]" />
      </div>

      <button className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E5E5] text-sm font-semibold text-[#1C1C1C] min-[1440px]:h-[54px] cursor-pointer">
        Continue with Google
        <span className="text-base">G</span>
      </button>

      <p className="mt-6 text-center text-sm text-[#7E7E7E]">
        Already have an account??{' '}
        <Link className="font-semibold text-[#2F4AD0] cursor-pointer" href="/signin">
          Sign in
        </Link>
      </p>
    </div>
  );
}
