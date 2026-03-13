'use client';
import React, { useEffect } from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, message, type, onClose }) => {
  // Auto-close success messages after 3 seconds
  useEffect(() => {
    if (isOpen && type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  if (!isOpen) return null;

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
      <div className={`relative w-full max-w-sm p-6 mx-4 rounded-2xl shadow-2xl border ${bgColor} ${borderColor} transform transition-all duration-300 scale-100`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-5xl mb-4">{icon}</div>
          <h3 className={`text-xl font-bold mb-2 ${textColor}`}>
            {type === 'success' ? 'Success!' : 'Oops!'}
          </h3>
          <p className={`text-sm ${textColor} opacity-80`}>{message}</p>
        </div>

        <button
          onClick={onClose}
          className={`mt-6 w-full py-2 rounded-lg font-semibold transition-colors ${
            type === 'success' 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;