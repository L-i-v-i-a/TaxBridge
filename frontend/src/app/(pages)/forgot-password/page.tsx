"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-c062.up.railway.app";
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      
    } catch (err) {
      // Use type guard to safely access .message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#E9EDFF] px-6 py-10">
      <div className="mx-auto w-full max-w-[520px] rounded-[28px] bg-white px-8 py-12 shadow-2xl">
        <h1 className="text-3xl font-semibold text-[#1C1C1C]">Reset password</h1>
        <p className="mt-2 text-sm text-[#7E7E7E]">
          Enter the email linked to your account and we will send a one-time passcode (OTP).
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-[#5B5B5B]">Email</label>
            <input
              type="email"
              name="email"
              placeholder="friday.okafor@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#0D23AD]"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </main>
  );
}