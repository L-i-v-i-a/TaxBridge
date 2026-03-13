"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API URL if different
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      // 1. Save tokens to local storage
      if (data.access_token && data.refresh_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      // 2. Navigate based on isAdmin flag
      if (data.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to the backend endpoint which handles the Google OAuth flow
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex h-full flex-col justify-center px-10 py-12 min-[1440px]:px-[64px]">
      <p className="text-2xl font-semibold text-[#0D23AD]">Taxbridge</p>
      <h2 className="mt-10 text-[32px] font-semibold text-[#1C1C1C] min-[1440px]:mt-[28px] min-[1440px]:text-[40px]">
        Sign in
      </h2>
      <p className="mt-2 text-sm text-[#7E7E7E]">Please login to continue to your account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 min-[1440px]:mt-[20px]">
        {/* Display Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-[#5B5B5B]">Email</label>
          <input
            type="email"
            name="email"
            placeholder="friday.okafor@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 h-12 w-full rounded-[10px] border border-[#2F4AD0] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-[#5B5B5B]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Friday@2026"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-[#5B5B5B]">
          <input type="checkbox" className="h-4 w-4 rounded border-[#A1A1AA] cursor-pointer" />
          Keep me logged in
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white min-[1440px]:h-[56px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-4 text-right text-sm">
        <Link className="text-[#2F4AD0] hover:underline cursor-pointer" href="/forgot-password">
          Forgot password?
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-3 text-sm text-[#7E7E7E]">
        <span className="h-px flex-1 bg-[#E5E5E5]" />
        <span>or</span>
        <span className="h-px flex-1 bg-[#E5E5E5]" />
      </div>

      <button 
        onClick={handleGoogleLogin}
        type="button"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E5E5] text-sm font-semibold text-[#1C1C1C] min-[1440px]:h-[54px] cursor-pointer hover:bg-gray-50"
      >
        Sign in with Google
        <span className="text-base">G</span>
      </button>

      <p className="mt-6 text-center text-sm text-[#7E7E7E]">
        Need an account?{' '}
        <Link className="font-semibold text-[#2F4AD0] cursor-pointer" href="/signup">
          Create one
        </Link>
      </p>
    </div>
  );
}