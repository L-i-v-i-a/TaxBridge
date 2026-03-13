import Link from "next/link";

export default function SignUpBioForm() {
  return (
    <div className="flex h-full flex-col justify-center px-10 py-12 min-[1440px]:px-[64px]">
      <p className="text-2xl font-semibold text-[#0D23AD]">Taxbridge</p>
      <h2 className="mt-6 text-[32px] font-semibold text-[#1C1C1C] min-[1440px]:text-[40px]">Personal info</h2>
      <p className="mt-2 text-sm text-[#7E7E7E]">Tell us a bit more about you</p>

      <form className="mt-6 space-y-4 min-[1440px]:mt-[18px]">
        <div>
          <label className="text-sm text-[#5B5B5B]">Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="+234 803 555 0199"
            className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
          />
        </div>
        <div>
          <label className="text-sm text-[#5B5B5B]">SSN</label>
          <input
            type="text"
            name="ssn"
            placeholder="29348394024"
            className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
          />
        </div>
        <div>
          <label className="text-sm text-[#5B5B5B]">Date of Birth</label>
          <input
            type="text"
            name="dateOfBirth"
            placeholder="11 December 1997"
            className="mt-2 h-12 w-full rounded-[10px] border border-[#E5E5E5] px-4 text-sm text-[#1C1C1C] min-[1440px]:h-[54px]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#E5E5E5] text-sm font-semibold text-[#1C1C1C] min-[1440px]:h-[56px] cursor-pointer"
            href="/signup"
          >
            Back
          </Link>
          <button
            type="submit"
            className="h-12 w-full rounded-[10px] bg-[#0D23AD] text-sm font-semibold text-white min-[1440px]:h-[56px] cursor-pointer"
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
