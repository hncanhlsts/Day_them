import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-xl font-label-md text-label-md flex items-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
      onClick={onClose}
    >
      <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
        check_circle
      </span>
      <span>{message}</span>
    </div>
  );
};
