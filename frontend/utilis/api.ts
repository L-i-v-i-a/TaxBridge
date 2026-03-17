// lib/api.ts
const BASE_URL = 'https://backend-production-c062.up.railway.app';

// Define specific types for API payloads
interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  occupation?: string;
  ein?: string;
  numberOfDependents?: number;
  streetAddress?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  filingStatus?: string;
  [key: string]: string | number | undefined; // Index signature for flexibility
}

interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

/**
 * Helper for standard JSON requests.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  // Fix: Use the Headers class for type-safe header manipulation
  const headers = new Headers(options.headers);

  // Automatically handle Content-Type based on body type
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = 'Network response was not ok';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore if response is not JSON
    }
    throw new Error(errorMessage);
  }
  
  // Handle 204 No Content
  if (response.status === 204) return null;
  
  return response.json();
}

// ---------------------------------------------------------
// AUTH
// ---------------------------------------------------------

export const getProfile = () => apiFetch('/auth/profile');

export const updateProfile = async (data: UpdateProfileDto, file?: File | null) => {
  const token = localStorage.getItem('access_token');
  
  if (file) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    formData.append('profilePicture', file);

    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }, // Let browser set Content-Type for FormData
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    return response.json();
  }

  return apiFetch('/auth/profile', { 
    method: 'PATCH', 
    body: JSON.stringify(data) 
  });
};

export const changePassword = (data: ChangePasswordDto) => 
  apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });

// ---------------------------------------------------------
// SETTINGS & FILINGS
// ---------------------------------------------------------

export const getStats = () => apiFetch('/settings/stats');
export const getFilings = () => apiFetch('/filings');

// ---------------------------------------------------------
// SETTINGS/FILING DOCUMENTS (Linked to specific filings)
// ---------------------------------------------------------

export const getFilingDocuments = () => apiFetch('/settings/documents');

export const uploadFilingDocument = async (file: File, filingId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filingId', filingId);
  formData.append('name', file.name);

  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/settings/documents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Upload failed');
  }
  return response.json();
};

export const downloadFilingDocument = async (id: string) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/settings/documents/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Download failed');
  return response.blob();
};

export const deleteFilingDocument = (id: string) => 
  apiFetch(`/settings/documents/${id}`, { method: 'DELETE' });


// ---------------------------------------------------------
// DOCUMENT MANAGER (New OCR Feature)
// ---------------------------------------------------------

export const getDocuments = async (type?: string) => {
  const url = type 
    ? `/documents?type=${encodeURIComponent(type)}`
    : '/documents';
  return apiFetch(url);
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/documents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Upload failed');
  }
  return response.json();
};

export const deleteDocument = async (id: string) => {
  return apiFetch(`/documents/${id}`, { method: 'DELETE' });
};