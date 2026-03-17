// lib/api.ts
const BASE_URL = 'http://localhost:3000';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as HeadersInit;

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Network response was not ok');
  }
  
  // Handle 204 No Content
  if (response.status === 204) return null;
  
  return response.json();
}

export const getProfile = () => apiFetch('/auth/profile');
export const updateProfile = (data: any) => apiFetch('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) });
export const changePassword = (data: any) => apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });

export const getStats = () => apiFetch('/settings/stats');
export const getFilings = () => apiFetch('/filings');
export const getDocuments = () => apiFetch('/settings/documents');

export const uploadDocument = async (file: File, filingId: string) => {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filingId', filingId);
  formData.append('name', file.name);

  const response = await fetch(`${BASE_URL}/settings/documents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};

export const downloadDocument = async (id: string) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/settings/documents/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Download failed');
  return response.blob();
};

export const deleteDocument = (id: string) => apiFetch(`/settings/documents/${id}`, { method: 'DELETE' });