import { DollarSign, CreditCard, TrendingUp, Shield } from "lucide-react";

const stats = [
  {
    label: "Total Income",
    value: "3,270,590",
    icon: DollarSign,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Total Expenses",
    value: "2,085,890",
    icon: CreditCard,
    color: "bg-orange-50 text-orange-600",
  },
  {
    label: "Net Financial Position",
    value: "Profit",
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Security Score",
    value: "98%",
    icon: Shield,
    color: "bg-purple-50 text-purple-600",
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
