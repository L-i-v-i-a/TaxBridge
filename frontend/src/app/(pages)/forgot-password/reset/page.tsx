"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen bg-[#E9EDFF] px-6 py-10">
      <div className="mx-auto w-full max-w-[520px] rounded-[28px] bg-white px-8 py-12 shadow-2xl">
        <h1 className="text-3xl font-semibold text-[#1C1C1C]">Create new password</h1>
        <p className="mt-2 text-sm text-[#7E7E7E]">
          Enter the OTP from your email and set a new password.
        </p>

        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const password = new FormData(form).get("password");
            setError("");
            router.push("/signin");
          }}
        >
          <div>
            <label className="text-sm text-[#5B5B5B]">OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="123456"
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C]"
            />
          </div>
          <div>
            <label className="text-sm text-[#5B5B5B]">New password</label>
            <input
              type="password"
              name="password"
              placeholder="Friday@2026"
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C]"
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            type="submit"
            className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white cursor-pointer"
          >
            Reset password
          </button>
        </form>
      </div>
    </main>
  );
}
