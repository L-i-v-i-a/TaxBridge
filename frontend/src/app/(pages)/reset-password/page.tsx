"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

// Wrap the inner content in Suspense to use useSearchParams
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      alert("Password reset successful! Please login.");
      router.push("/signin");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#E9EDFF] px-6 py-10">
      <div className="mx-auto w-full max-w-[520px] rounded-[28px] bg-white px-8 py-12 shadow-2xl">
        <h1 className="text-3xl font-semibold text-[#1C1C1C]">Create new password</h1>
        <p className="mt-2 text-sm text-[#7E7E7E]">
          Enter the OTP from your email and set a new password.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email field is required by API but can be hidden if passed via URL */}
          <div>
            <label className="text-sm text-[#5B5B5B]">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-[#5B5B5B]">OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="text-sm text-[#5B5B5B]">New password</label>
            <input
              type="password"
              name="password"
              placeholder="NewStrongPass456!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </main>
  );
}

// Default export with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#E9EDFF]">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}