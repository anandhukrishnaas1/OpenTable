/**
 * Toast notification component for OpenTable.
 *
 * Displays dismissible notification messages with type-specific
 * styling (success, error, warning, info) and auto-dismiss timer.
 *
 * @module components/Toast
 */

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/** Toast notification type variants */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** Props for the Toast component */
interface ToastProps {
  /** The message to display */
  message: string;
  /** Visual variant of the toast */
  type: ToastType;
  /** Whether the toast is currently visible */
  isVisible: boolean;
  /** Callback fired when the toast is dismissed */
  onClose: () => void;
  /** Auto-dismiss duration in milliseconds (default: 4000) */
  duration?: number;
}

/**
 * Toast notification component.
 *
 * Renders a styled notification banner with an icon, message, and close button.
 * Automatically dismisses after the specified duration.
 *
 * @example
 * ```tsx
 * <Toast
 *   message="Donation saved!"
 *   type="success"
 *   isVisible={true}
 *   onClose={() => setVisible(false)}
 * />
 * ```
 */
const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const config = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: <CheckCircle size={22} className="text-green-600 shrink-0" />,
      text: 'text-green-800',
      bar: 'bg-green-500',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: <XCircle size={22} className="text-red-600 shrink-0" />,
      text: 'text-red-800',
      bar: 'bg-red-500',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: <AlertTriangle size={22} className="text-yellow-600 shrink-0" />,
      text: 'text-yellow-800',
      bar: 'bg-yellow-500',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: <Info size={22} className="text-blue-600 shrink-0" />,
      text: 'text-blue-800',
      bar: 'bg-blue-500',
    },
  };

  const c = config[type];

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-slide-down w-[90vw] max-w-md">
      <div
        className={`${c.bg} border rounded-2xl shadow-xl overflow-hidden`}
        role="alert"
        aria-live="assertive"
      >
        <div
          className={`${c.bar} h-1 animate-shrink-bar`}
          style={{ animationDuration: `${duration}ms` }}
        />
        <div className="flex items-start gap-3 p-4">
          {c.icon}
          <p className={`${c.text} text-sm font-medium flex-1 leading-relaxed`}>{message}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition shrink-0"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
