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

  // Updated state to use firstName and lastName
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
    // Updated validation
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Sending firstName and lastName as per backend logic
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex h-full flex-col justify-center px-10 py-12 min-[1440px]:px-[64px]">
      <p className="text-2xl font-semibold text-[#0D23AD]">Taxbridge</p>
      
      {step === 1 ? (
        <>
          <h2 className="mt-6 text-[32px] font-semibold text-[#1C1C1C] min-[1440px]:text-[40px]">Sign up</h2>
          <p className="mt-2 text-sm text-[#7E7E7E]">Sign up to enjoy the feature of Taxbridge</p>
        </>
      ) : (
        <>
          <h2 className="mt-6 text-[32px] font-semibold text-[#1C1C1C] min-[1440px]:text-[40px]">Personal info</h2>
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
                className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
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
                className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
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
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
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
              className="mt-2 h-12 w-full rounded-[10px] border border-[#2F4AD0] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
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
                className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] cursor-pointer"
              >
                &#128065;
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white min-[1440px]:h-[56px] cursor-pointer"
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
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E5E5] text-sm font-semibold text-[#1C1C1C] min-[1440px]:h-[54px] cursor-pointer"
          >
            Continue with Google
            <span className="text-base">G</span>
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
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
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
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
            />
          </div>
          <div>
            <label className="text-sm text-[#5B5B5B]">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#E5E5E5] text-sm font-semibold text-[#1C1C1C] min-[1440px]:h-[56px] cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white min-[1440px]:h-[56px] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}