'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getDocuments, getFilings, uploadDocument, downloadFilingDocument, deleteDocument } from '../../utilis/api';
import { Loader2, Upload, Download, Trash2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  filingId?: string;
  filingName?: string;
  type?: string;
  createdAt: string;
}

interface Filing {
  id: string;
  filingId: string;
  type: string;
}

export default function Documents() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [filings, setFilings] = useState<Filing[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedFiling, setSelectedFiling] = useState<string>('');

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [docsData, filingsData] = await Promise.all([getDocuments(), getFilings()]);
        setDocs(docsData as Document[]);
        setFilings(filingsData as Filing[]);
      } catch (err) {
        console.error(err);
        setError('Failed to load documents or filings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedFiling) {
      setError('Please select a filing first');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // FIX: The imported function expects 1 argument.
      // If you need to send the filingId, update the function in 'utilis/api.ts'
      // to accept a second parameter: uploadDocument(file, filingId)
      await uploadDocument(file);
      
      const freshDocs = await getDocuments();
      setDocs(freshDocs as Document[]);
      setSuccessMsg('Document uploaded successfully');
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await downloadFilingDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Download failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      setSuccessMsg('Document deleted successfully');
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMsg(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Messages */}
      {(error || successMsg) && (
        <div className="p-4 border-b">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={clearMessages} className="ml-auto text-sm underline">Dismiss</button>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
              <button onClick={clearMessages} className="ml-auto text-sm underline">Dismiss</button>
            </div>
          )}
        </div>
      )}

      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Documents</h2>
          <p className="text-sm text-gray-500">Manage your uploaded tax documents</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedFiling}
            onChange={(e) => {
              setSelectedFiling(e.target.value);
              clearMessages();
            }}
            className="flex-1 md:w-60 border border-gray-200 rounded-xl text-sm px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-black/70"
            disabled={uploading}
          >
            <option value="">Select Filing...</option>
            {filings.length === 0 ? (
              <option disabled>No filings available</option>
            ) : (
              filings.map(f => (
                <option key={f.id} value={f.id}>
                  {f.filingId} ({f.type})
                </option>
              ))
            )}
          </select>

          <input
            type="file"
            ref={fileRef}
            onChange={handleUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.png,.xlsx,.csv"
          />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading || !selectedFiling || filings.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {!selectedFiling && docs.length === 0 && filings.length > 0 && (
        <div className="p-4 bg-amber-50 text-amber-800 text-sm flex items-center gap-2 border-b">
          <AlertCircle size={16} />
          Select a filing to enable document upload.
        </div>
      )}

      {docs.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 opacity-40" strokeWidth={1.2} />
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm mt-1">Upload your first document using the button above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['Name', 'Filing', 'Type', 'Uploaded', 'Actions'].map(head => (
                  <th
                    key={head}
                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                    {d.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {d.filingName || d.filingId || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                    {d.type?.split('/')[1] || 'file'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button
                      onClick={() => handleDownload(d)}
                      className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Download"
                      aria-label={`Download ${d.name}`}
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      disabled={deletingId === d.id}
                      className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete"
                      aria-label={`Delete ${d.name}`}
                    >
                      {deletingId === d.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
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