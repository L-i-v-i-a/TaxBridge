import { Search, Bell, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-[#0B0F1F]">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">Quick stats and recent activity at a glance.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            placeholder="Search for something"
            className="w-40 bg-transparent text-sm text-slate-600 focus:outline-none"
          />
        </div>
        <button className="flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 shadow-sm hover:bg-slate-50">
          <Bell className="h-5 w-5 text-slate-500" />
        </button>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm hover:bg-slate-50">
          <UserCircle className="h-5 w-5 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Sarah</span>
        </button>
      </div>
    </header>
  );
}
