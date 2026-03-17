'use client';
import { useState, useEffect } from 'react';
import { Eye, Download, Loader2, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FilingHistory() {
  const [filings, setFilings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch('https://backend-production-c062.up.railway.app/filings', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setFilings(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching filings:", err);
      setLoading(false);
    });
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-100';
      case 'UNDER_REVIEW': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return '-';
    const prefix = amount >= 0 ? '+' : '';
    // Use absolute value for display if you want just numbers, or keep sign for refund/owe
    return `${prefix}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}`;
  };

  const handleDownload = async (filing: any) => {
    if (!filing.documents || filing.documents.length === 0) {
      alert('No documents available for this filing.');
      return;
    }

    const doc = filing.documents[0];
    const token = localStorage.getItem('access_token');
    
    try {
      const res = await fetch(`https://backend-production-c062.up.railway.app/settings/documents/${doc.id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('Could not download file');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 flex justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Filing History</h2>
        <p className="text-sm text-gray-500">View and manage your past tax returns</p>
      </div>

      {filings.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          <FileText size={40} className="mx-auto mb-2 opacity-50" />
          <p>No filings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{filing.taxYear}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{filing.filingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{filing.type || 'Federal'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(filing.status)}`}>
                      {filing.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${(filing.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(filing.amount)}
                  </td>
                  <td className="px-6 py-4 flex gap-3 text-gray-400">
                    <button 
                      onClick={() => router.push(`/filings/${filing.id}`)} 
                      className="hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDownload(filing)} 
                      className="hover:text-blue-600 transition-colors"
                      title="Download Document"
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}