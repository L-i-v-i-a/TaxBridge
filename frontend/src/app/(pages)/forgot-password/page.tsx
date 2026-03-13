"use client";

import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#E9EDFF] px-6 py-10">
      <div className="mx-auto w-full max-w-[520px] rounded-[28px] bg-white px-8 py-12 shadow-2xl">
        <h1 className="text-3xl font-semibold text-[#1C1C1C]">Reset password</h1>
        <p className="mt-2 text-sm text-[#7E7E7E]">
          Enter the email linked to your account and we will send a one-time passcode (OTP).
        </p>

        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/forgot-password/reset");
          }}
        >
          <div>
            <label className="text-sm text-[#5B5B5B]">Email</label>
            <input
              type="email"
              placeholder="friday.okafor@gmail.com"
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C]"
            />
          </div>
          <button
            type="submit"
            className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white cursor-pointer"
          >
            Send OTP
          </button>
        </form>
      </div>
    </main>
  );
}
