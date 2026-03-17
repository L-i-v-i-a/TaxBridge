import React, { useState, useEffect, useRef } from 'react';
import { getDocuments, getFilings, uploadDocument, downloadDocument, deleteDocument } from '../../utilis/api';
import { Loader2, Upload, Download, Trash2, FileText, AlertCircle } from 'lucide-react';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [filings, setFilings] = useState([]);
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
      const blob = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      a.click();
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

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Documents</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedFiling}
            onChange={(e) => setSelectedFiling(e.target.value)}
            className="flex-1 md:w-48 border-gray-200 rounded-lg text-sm px-3 py-2 border bg-white"
          >
            <option value="">Select Filing</option>
            {filings.map((f: any) => <option key={f.id} value={f.id}>{f.filingId}</option>)}
          </select>
          <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" />
          <button 
            onClick={() => fileRef.current?.click()} 
            disabled={uploading || !selectedFiling}
            className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            Upload
          </button>
        </div>
      </div>

      {!selectedFiling && (
        <div className="p-4 bg-yellow-50 text-yellow-700 text-sm flex items-center gap-2 border-b">
          <AlertCircle size={16} />
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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Filing</th>
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {docs.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{d.name}</td>
                  <td className="px-6 py-4 text-gray-500">{d.filingName || d.filingId}</td>
                  <td className="px-6 py-4 text-gray-500">{d.type}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleDownload(d)} className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-600">
                      <Download size={16} />
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-red-600">
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