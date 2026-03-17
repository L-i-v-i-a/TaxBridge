'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Upload, Trash2, Eye, Loader2, Filter, 
  FileImage, FileSpreadsheet, X, File 
} from 'lucide-react';
import Topbar from '../../../../components/dashboard/Topbar';
import Sidebar from '../../../../components/dashboard/Sidebar';
import { getDocuments, uploadDocument, deleteDocument } from '../../../../utilis/api';

// ────────────────────────────────────────────────
// Define Document type (you can move this to types/document.ts)
interface Document {
  id: string;
  name: string;
  type: string | null;              // MIME type e.g. "image/jpeg", "application/pdf"
  url: string;
  createdAt: string;                // ISO date string
  documentType?: string;            // "W2" | "1099" | "Receipt" | "ID" | "Other"
  summary?: string;
  extractedData?: Record<string, unknown>;
}

// ────────────────────────────────────────────────
const getFileIcon = (type: string | null) => {
  if (type?.includes('image')) return <FileImage className="text-blue-500" size={24} />;
  if (type?.includes('pdf') || type?.includes('spreadsheet')) return <FileSpreadsheet className="text-red-500" size={24} />;
  return <FileText className="text-gray-500" size={24} />;
};

// ────────────────────────────────────────────────
export default function DocumentsPage() {
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'W2' | '1099' | 'Receipt' | 'ID' | 'Other'>('All');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters = ['All', 'W2', '1099', 'Receipt', 'ID', 'Other'] as const;

  useEffect(() => {
    fetchDocs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const type = activeFilter === 'All' ? undefined : activeFilter;
      const data = await getDocuments(type) as Document[];
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadDocument(file);
      await fetchDocs();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload document';
      alert(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (previewDoc?.id === id) {
        setPreviewDoc(null);
      }
    } catch (err: unknown) {
      alert('Failed to delete document');
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Manager</h1>
                <p className="text-gray-500 text-sm">Upload, analyze, and manage your tax documents.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.xlsx,.xls,.csv"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                  {uploading ? 'Analyzing...' : 'Upload Document'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
                    activeFilter === f 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Documents Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={40} />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-400 font-medium">No documents found</p>
                <p className="text-gray-400 text-sm mt-1">Upload a document to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getFileIcon(doc.type)}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase">
                        {doc.documentType || 'Unknown'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 truncate mb-1">{doc.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>

                    {doc.summary && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                        {doc.summary}
                      </p>
                    )}

                    <div className="flex items-center gap-2 border-t pt-3 mt-auto">
                      <button 
                        onClick={() => setPreviewDoc(doc)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">{previewDoc.name}</h2>
                <span className="text-xs text-blue-600 font-medium">
                  {previewDoc.documentType || 'Unknown'}
                </span>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Image Preview */}
              {previewDoc.type?.includes('image') && (
                <div className="w-full bg-gray-50 rounded-xl overflow-hidden">
                  <img 
                    src={`https://backend-production-c062.up.railway.app/${previewDoc.url}`}
                    alt={previewDoc.name}
                    className="w-full h-auto object-contain max-h-80"
                  />
                </div>
              )}

              {/* AI Summary */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Analysis Summary</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                  {previewDoc.summary || 'No summary available.'}
                </p>
              </div>

              {/* Extracted Data */}
              {previewDoc.extractedData && Object.keys(previewDoc.extractedData).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Extracted Details</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {Object.entries(previewDoc.extractedData).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="font-medium text-gray-800">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}