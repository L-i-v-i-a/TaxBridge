"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-c062.up.railway.app";
      
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
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (err: unknown) {
      // Safe handling of the unknown error type
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to the backend endpoint which handles the Google OAuth flow
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-c062.up.railway.app";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex h-full flex-col justify-center px-10 py-12 min-[1440px]:px-[64px]">
      <p className="text-2xl font-semibold text-[#0D23AD] tracking-tight">Taxbridge</p>
      <h2 className="mt-10 text-[32px] font-semibold text-[#1C1C1C] tracking-tight min-[1440px]:mt-[28px] min-[1440px]:text-[40px]">
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
            className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
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
              className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] transition hover:text-[#2F4AD0]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-[#5B5B5B]">
          <input type="checkbox" className="h-4 w-4 rounded border-[#A1A1AA] cursor-pointer accent-[#2F4AD0]" />
          Keep me logged in
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white shadow-lg shadow-[#0D23AD]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0D23AD]/35 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0D23AD]/30 min-[1440px]:h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white text-sm font-semibold text-[#1C1C1C] shadow-sm transition hover:-translate-y-0.5 hover:border-[#D2D6FF] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F4AD0]/15 min-[1440px]:h-[54px]"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
          <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.23 9.2 3.64l6.86-6.86C35.86 2.5 30.42 0 24 0 14.62 0 6.5 5.38 2.56 13.22l7.98 6.2C12.5 13.2 17.8 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.2 24.55c0-1.64-.15-3.21-.42-4.73H24v9.02h12.5c-.54 2.92-2.2 5.4-4.7 7.06l7.2 5.6C43.84 37.56 46.2 31.6 46.2 24.55z"/>
            <path fill="#FBBC05" d="M10.54 28.22a14.5 14.5 0 0 1 0-8.44l-7.98-6.2A23.93 23.93 0 0 0 0 24c0 3.88.94 7.55 2.56 10.78l7.98-6.2z"/>
            <path fill="#34A853" d="M24 48c6.42 0 11.86-2.12 15.82-5.76l-7.2-5.6c-2 1.35-4.56 2.15-8.62 2.15-6.2 0-11.5-3.7-13.46-8.92l-7.98 6.2C6.5 42.62 14.62 48 24 48z"/>
          </svg>
        </span>
        Sign in with Google
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