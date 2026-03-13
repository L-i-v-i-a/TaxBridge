import Link from "next/link";
import { Home, FileText, MessageSquare, BarChart2, Settings, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Management", icon: BarChart2, href: "/dashboard" },
  { label: "Tax Filing", icon: FileText, href: "/dashboard" },
  { label: "Communication", icon: MessageSquare, href: "/dashboard" },
  { label: "Report", icon: BarChart2, href: "/dashboard" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-72 flex-col border-r border-white/10 bg-white/70 backdrop-blur-sm">
      <div className="px-6 py-8">
        <h1 className="text-xl font-bold text-[#0D23AD]">Taxbridge</h1>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0D23AD]"
                >
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#0D23AD]" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 pb-8">
        <div className="border-t border-white/10 pt-4">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0D23AD]"
          >
            <Settings className="h-5 w-5 text-slate-400 group-hover:text-[#0D23AD]" />
            Settings
          </Link>
          <Link
            href="#"
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-600" />
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}
