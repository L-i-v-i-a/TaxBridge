'use client';
import { useState, useEffect } from 'react';
import { Eye, Download } from 'lucide-react';

export default function FilingHistory() {
  const [filings, setFilings] = useState([]);

  useEffect(() => {
    // Fetch filing data from your API
    fetch('http://localhost:3000/filings', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setFilings(data))
    .catch(err => console.error("Error fetching filings:", err));
  }, []);

  // Helper for status badge colors
  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-100';
      case 'UNDER REVIEW': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'AMENDED': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Filing History</h2>
        <p className="text-sm text-gray-500">View and manage your past tax returns</p>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {['Tax Year', 'Filing ID', 'Type', 'Status', 'Amount', 'Actions'].map((head) => (
              <th key={head} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filings.map((filing: any) => (
            <tr key={filing.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">2024</td>
              <td className="px-6 py-4 text-sm text-gray-600 font-mono">{filing.filingId}</td>
              <td className="px-6 py-4 text-sm text-gray-600">Federal & State</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(filing.status)}`}>
                  {filing.status}
                </span>
              </td>
              <td className={`px-6 py-4 text-sm font-bold ${filing.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {filing.amount >= 0 ? `+$${filing.amount}` : `-$${Math.abs(filing.amount)}`}
              </td>
              <td className="px-6 py-4 flex gap-3 text-gray-400">
                <button className="hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                <button className="hover:text-blue-600 transition-colors"><Download size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}