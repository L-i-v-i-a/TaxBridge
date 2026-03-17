'use client';
import React from 'react';
import { RecentActivity } from '../../types/dashboard';

interface Props { data: RecentActivity[]; }

const RecentActivityTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        <a href="/filings/history" className="text-sm text-[#0D23AD] font-medium hover:underline">View All</a>
      </div>
      
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Filing ID</th>
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="py-4 text-sm font-medium text-gray-800">{item.filingId}</td>
              <td className="py-4 text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
              <td className="py-4 text-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                  item.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                  item.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700' :
                  'bg-gray-50 text-gray-700'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </td>
              <td className="py-4 text-sm text-gray-800 text-right font-medium">
                {item.amount !== null ? `$${item.amount.toLocaleString()}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;