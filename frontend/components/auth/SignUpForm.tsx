"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State matches the API payload structure exactly
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    ssn: "",
    dateOfBirth: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated validation for First Name and Last Name
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      alert("Account created successfully! Please login.");
      router.push("/signin");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // This initiates the OAuth flow -> Backend -> Google -> Backend -> Frontend Callback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex h-full flex-col justify-center px-10 py-12 min-[1440px]:px-[64px]">
      <p className="text-2xl font-semibold text-[#0D23AD] tracking-tight">Taxbridge</p>
      
      {step === 1 ? (
        <>
          <h2 className="mt-6 text-[32px] font-semibold text-[#1C1C1C] tracking-tight min-[1440px]:text-[40px]">Sign up</h2>
          <p className="mt-2 text-sm text-[#7E7E7E]">Sign up to enjoy the feature of Taxbridge</p>
        </>
      ) : (
        <>
          <h2 className="mt-6 text-[32px] font-semibold text-[#1C1C1C] tracking-tight min-[1440px]:text-[40px]">Personal info</h2>
          <p className="mt-2 text-sm text-[#7E7E7E]">Tell us a bit more about you</p>
        </>
      )}

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Step 1 Form */}
      {step === 1 && (
        <form onSubmit={handleNext} className="mt-6 space-y-4 min-[1440px]:mt-[18px]">
          {/* First Name and Last Name Row */}
          <div className="flex gap-3">
            <div className="w-full">
              <label className="text-sm text-[#5B5B5B]">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Olivia"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
              />
            </div>
            <div className="w-full">
              <label className="text-sm text-[#5B5B5B]">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Ado"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#5B5B5B]">Username</label>
            <input
              type="text"
              name="username"
              placeholder="olivia_ae"
              value={formData.username}
              onChange={handleChange}
            className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
            />
          </div>
          <div>
            <label className="text-sm text-[#5B5B5B]">Email</label>
            <input
              type="email"
              name="email"
              placeholder="chinazaoguelina99@gmail.com"
              value={formData.email}
              onChange={handleChange}
            className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
            />
          </div>
          <div>
            <label className="text-sm text-[#5B5B5B]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="StrongPass123!"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] transition hover:text-[#2F4AD0]"
              >
                &#128065;
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white shadow-lg shadow-[#0D23AD]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0D23AD]/35 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0D23AD]/30 min-[1440px]:h-[56px]"
          >
            Next
          </button>

          <div className="mt-6 flex items-center gap-3 text-sm text-[#7E7E7E]">
            <span className="h-px flex-1 bg-[#E5E5E5]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#E5E5E5]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
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
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-[#7E7E7E]">
            Already have an account?{' '}
            <Link className="font-semibold text-[#2F4AD0] cursor-pointer" href="/signin">
              Sign in
            </Link>
          </p>
        </form>
      )}

      {/* Step 2 Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 min-[1440px]:mt-[18px]">
          <div>
            <label className="text-sm text-[#5B5B5B]">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="08066008669"
              value={formData.phone}
              onChange={handleChange}
            className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
            />
          </div>
          <div>
            <label className="text-sm text-[#5B5B5B]">SSN</label>
            <input
              type="text"
              name="ssn"
              placeholder="123-45-6709"
              value={formData.ssn}
              onChange={handleChange}
            className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
            />
          </div>
          <div>
            <label className="text-sm text-[#5B5B5B]">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            className="mt-2 h-12 w-full rounded-[10px] border border-[#D7D7E0] bg-white/80 px-4 text-sm text-[#1C1C1C] shadow-sm transition focus:outline-none focus:border-[#2F4AD0] focus:ring-4 focus:ring-[#2F4AD0]/20 min-[1440px]:h-[54px]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-white text-sm font-semibold text-[#1C1C1C] shadow-sm transition hover:-translate-y-0.5 hover:border-[#D2D6FF] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F4AD0]/15 min-[1440px]:h-[56px]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white shadow-lg shadow-[#0D23AD]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0D23AD]/35 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0D23AD]/30 min-[1440px]:h-[56px] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
