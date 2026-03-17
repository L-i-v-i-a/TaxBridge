import React, { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile } from '../../utilis/api';
import { Loader2, Save, Camera, User } from 'lucide-react';

// 1. Define interface for Form State
interface ProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  occupation: string;
  ein: string;
  numberOfDependents: string; // Input is string
  streetAddress: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  filingStatus: string;
}

// 2. Define interface for API Payload (number conversion)
interface UpdateProfilePayload extends Omit<ProfileFormData, 'numberOfDependents'> {
  numberOfDependents?: number;
}

export default function PersonalInfo() {
  const [form, setForm] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    occupation: '',
    ein: '',
    numberOfDependents: '',
    streetAddress: '',
    zipCode: '',
    city: '',
    state: '',
    country: '',
    filingStatus: '',
  });
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then(data => {
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          username: data.username || '',
          phone: data.phone || '',
          occupation: data.occupation || '',
          ein: data.ein || '',
          numberOfDependents: data.numberOfDependents?.toString() || '',
          streetAddress: data.streetAddress || '',
          zipCode: data.zipCode || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          filingStatus: data.filingStatus || '',
        });
        setEmail(data.email);
        setProfilePic(data.profilePicture ? `https://backend-production-c062.up.railway.app/${data.profilePicture}` : null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 3. Use specific types instead of 'any'
      const payload: UpdateProfilePayload = {
        ...form,
        numberOfDependents: form.numberOfDependents ? parseInt(form.numberOfDependents, 10) : undefined,
      };

      // Remove undefined keys if necessary (optional, but good for clean payloads)
      if (!payload.numberOfDependents) {
        delete payload.numberOfDependents;
      }

      await updateProfile(payload, selectedFile);
      alert('Profile updated!');
      setSelectedFile(null); 
    } catch (err: unknown) {
      // 4. Handle unknown error safely
      if (err instanceof Error) {
        alert(err.message || 'Failed to update profile');
      } else {
        alert('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Personal Information</h2>
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="text-gray-400" size={32} />
              )}
            </div>
            <button 
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border shadow-sm hover:bg-gray-50"
            >
              <Camera size={14} className="text-gray-600" />
            </button>
            <input 
              type="file" 
              ref={fileRef} 
              onChange={handleFileChange} 
              accept="image/*"
              className="hidden" 
            />
          </div>
          {selectedFile && <span className="text-xs text-green-600 mt-1">New image selected</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read-only)</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <hr />

        {/* Address Info */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Residential Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                name="streetAddress"
                value={form.streetAddress}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
              <input name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
              <input name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
        </div>

        <hr />

        {/* Tax Info */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Tax & Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input name="occupation" value={form.occupation} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employer Identification Number (EIN)</label>
              <input name="ein" value={form.ein} onChange={handleChange} placeholder="XX-XXXXXXX" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Dependents</label>
              <input name="numberOfDependents" value={form.numberOfDependents} onChange={handleChange} type="number" min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
              <select 
                name="filingStatus" 
                value={form.filingStatus} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black bg-white"
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head_of_household">Head of Household</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}