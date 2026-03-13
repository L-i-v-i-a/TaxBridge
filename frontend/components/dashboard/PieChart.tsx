export default function PieChart() {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Net Financial Position</h3>
          <p className="text-sm text-slate-500">Profit vs Expenses</p>
        </div>
        <div className="text-xs text-slate-400">This month</div>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="relative mx-auto h-44 w-44">
          <svg viewBox="0 0 42 42" className="h-full w-full">
            <circle cx="21" cy="21" r="15.915" className="fill-none stroke-slate-200 stroke-[8]" />
            <circle
              cx="21"
              cy="21"
              r="15.915"
              className="fill-none stroke-green-500 stroke-[8]"
              strokeDasharray="80 20"
              strokeDashoffset="25"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">Profit</span>
            <span className="text-xs text-slate-500">72%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium text-slate-900">Profit</p>
              <p className="text-xs text-slate-500">$3,270,590</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-orange-400" />
            <div>
              <p className="text-sm font-medium text-slate-900">Expenses</p>
              <p className="text-xs text-slate-500">$2,085,890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
