import { useMemo } from "react";

const DATA = [
  { month: "Jan", income: 40, expense: 25 },
  { month: "Feb", income: 28, expense: 20 },
  { month: "Mar", income: 34, expense: 24 },
  { month: "Apr", income: 30, expense: 22 },
  { month: "May", income: 35, expense: 26 },
  { month: "Jun", income: 45, expense: 30 },
  { month: "Jul", income: 50, expense: 32 },
  { month: "Aug", income: 42, expense: 28 },
  { month: "Sep", income: 38, expense: 26 },
  { month: "Oct", income: 48, expense: 30 },
  { month: "Nov", income: 55, expense: 34 },
  { month: "Dec", income: 60, expense: 38 },
];

export default function ActivityChart() {
  const maxValue = useMemo(() => Math.max(...DATA.map((d) => Math.max(d.income, d.expense))), []);

  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Report Activity</h3>
          <p className="text-sm text-slate-500">Income vs Expense</p>
        </div>
        <div className="text-xs text-slate-400">This year</div>
      </div>

      <div className="mt-6 grid gap-2">
        {DATA.map((item) => {
          const incomeWidth = Math.max(6, (item.income / maxValue) * 100);
          const expenseWidth = Math.max(6, (item.expense / maxValue) * 100);

          return (
            <div key={item.month} className="flex items-center gap-3">
              <span className="w-10 text-sm font-semibold text-slate-600">{item.month}</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 rounded-full bg-blue-500" style={{ width: `${incomeWidth}%` }} />
                  <span className="text-xs text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 rounded-full bg-orange-400" style={{ width: `${expenseWidth}%` }} />
                  <span className="text-xs text-slate-400">Expense</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
