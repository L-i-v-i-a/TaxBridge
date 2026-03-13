import AuthLeftPanel from "../../../../../components/auth/AuthLeftPanel";
import SignUpBioForm from "../../../../../components/auth/SignUpBioForm";

export default function SignUpBioPage() {
  return (
    <main className="min-h-screen bg-[#E9EDFF] px-6 py-10">
      <div className="mx-auto grid w-full max-w-[1240px] overflow-hidden rounded-[28px] bg-white shadow-2xl lg:grid-cols-[1fr_1fr] min-[1440px]:grid-cols-[680px_560px]">
        <AuthLeftPanel />
        <SignUpBioForm />
      </div>
    </main>
  );
}
