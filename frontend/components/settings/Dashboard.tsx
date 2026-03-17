import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FileText, CheckCircle, Clock, FileUp, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard({ stats }: { stats: any }) {
  const COLORS = ['#4285F4', '#9061F9', '#31C48D', '#F97316', '#6B7280'];
  const { cards, refundHistory, deductions } = stats || {};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Total Refunds */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Refunds</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(cards?.totalRefunds)}</h3>
              <div className={`flex items-center gap-1 text-xs mt-1 ${cards?.refundGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {cards?.refundGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{Math.abs(cards?.refundGrowth)}% vs last year</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* Card 2: Filed Returns */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Filed Returns</p>
              <h3 className="text-2xl font-bold mt-1">{cards?.filedReturns}</h3>
              <p className="text-xs mt-1 text-gray-400">Since {cards?.filingSince}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <FileText size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Avg Processing */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Processing</p>
              <h3 className="text-2xl font-bold mt-1">{cards?.avgProcessingDays} days</h3>
              <p className="text-xs mt-1 text-purple-500">{cards?.daysFaster} days faster</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Card 4: Documents */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Docs Uploaded</p>
              <h3 className="text-2xl font-bold mt-1">{cards?.docsUploaded}</h3>
              <p className="text-xs mt-1 text-gray-400">This year</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
              <FileUp size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4 text-gray-800">Refund/Payment History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={refundHistory || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4 text-gray-800">Deductions Breakdown (2024)</h3>
          <div className="h-64 flex items-center justify-center">
            {deductions && deductions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deductions}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deductions.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 text-sm">
                <p>No deduction data available for this year.</p>
              </div>
            )}
          </div>
           {/* Legend for Pie */}
           {deductions && deductions.length > 0 && (
             <div className="flex flex-wrap justify-center gap-4 mt-4">
               {deductions.map((entry: any, index: number) => (
                 <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   {entry.name}
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}