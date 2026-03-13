const activity = [
  {
    date: "20/09/2025",
    address: "102, Maryland Ln, USA",
    taxId: "4DA547452",
    ssn: "3456344653",
    status: "In Review",
  },
  {
    date: "18/09/2025",
    address: "230, Elm Street, USA",
    taxId: "8BF012349",
    ssn: "8745123045",
    status: "Submitted",
  },
  {
    date: "16/09/2025",
    address: "99, Sunset Blvd, USA",
    taxId: "0AF567890",
    ssn: "5982310476",
    status: "Completed",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <p className="text-sm text-slate-500">Latest filings and status updates</p>
        </div>
        <div className="text-xs text-slate-400">Last 7 days</div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="py-3 pr-6">Date</th>
              <th className="py-3 pr-6">Address</th>
              <th className="py-3 pr-6">Tax ID</th>
              <th className="py-3 pr-6">SSN</th>
              <th className="py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {activity.map((row) => (
              <tr key={row.taxId} className="hover:bg-white/30">
                <td className="py-4 pr-6 text-slate-700">{row.date}</td>
                <td className="py-4 pr-6 text-slate-700">{row.address}</td>
                <td className="py-4 pr-6 text-slate-700">{row.taxId}</td>
                <td className="py-4 pr-6 text-slate-700">{row.ssn}</td>
                <td className="py-4 text-right">
                  <span className="inline-flex rounded-full bg-white/30 px-3 py-1 text-xs font-semibold text-slate-800">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
