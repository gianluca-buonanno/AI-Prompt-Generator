'use client';

import React, { useEffect } from 'react';
import { CheckCircle, Zap, X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToastNotificationProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export default function ToastNotification({ toasts, removeToast }: ToastNotificationProps) {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    );

    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'info':
        return <Zap className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto toast-slide-in bg-black border-2 border-green-500 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[300px] glow-green-strong"
        >
          <div className="text-green-400">{getIcon(toast.type)}</div>
          <span className="text-green-300 font-medium flex-1 text-sm">
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-green-500 hover:text-green-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}