'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getDocuments, getFilings, uploadDocument, downloadFilingDocument, deleteDocument } from '../../utilis/api';
import { Loader2, Upload, Download, Trash2, FileText, AlertCircle } from 'lucide-react';

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([]);
  const [filings, setFilings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiling, setSelectedFiling] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDocuments(), getFilings()])
      .then(([docsData, filingsData]) => {
        setDocs(docsData);
        setFilings(filingsData);
      })
      .catch(err => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedFiling) return alert('Please select a filing first.');

    setUploading(true);
    try {
      await uploadDocument(file, selectedFiling);
      const newData = await getDocuments();
      setDocs(newData);
      alert('Uploaded successfully');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDownload = async (doc: any) => {
    try {
      const blob = await downloadFilingDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert('Download failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      setDocs(docs.filter((d: any) => d.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 flex justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Documents</h2>
          <p className="text-sm text-gray-500">Manage your uploaded tax documents</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedFiling}
            onChange={(e) => setSelectedFiling(e.target.value)}
            className="flex-1 md:w-52 border border-gray-200 rounded-xl text-sm px-4 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select Filing...</option>
            {filings.map((f: any) => (
              <option key={f.id} value={f.id}>{f.filingId} ({f.type})</option>
            ))}
          </select>
          
          <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" />
          <button 
            onClick={() => fileRef.current?.click()} 
            disabled={uploading || !selectedFiling}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            Upload
          </button>
        </div>
      </div>

      {!selectedFiling && docs.length === 0 && (
        <div className="p-4 bg-yellow-50 text-yellow-700 text-xs flex items-center gap-2 border-b">
          <AlertCircle size={14} />
          Select a filing to enable upload.
        </div>
      )}

      {docs.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          <FileText size={40} className="mx-auto mb-2 opacity-50" />
          <p>No documents uploaded.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Filing', 'Type', 'Date', 'Actions'].map((head) => (
                  <th key={head} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{d.filingName || d.filingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{d.type?.split('/')[1]?.toUpperCase() || 'FILE'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                     {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleDownload(d)} 
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-600 transition-colors inline-flex"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(d.id)} 
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-red-600 transition-colors inline-flex"
                      title="Delete"
                    >
                      <Trash2 size={16} />
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