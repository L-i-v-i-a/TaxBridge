import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { changePassword } from '../../utilis/api';

export default function PasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(form);
      alert('Password changed!');
      onClose();
    } catch (err) {
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}