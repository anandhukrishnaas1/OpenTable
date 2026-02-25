import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

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
            <div className={`${c.bg} border rounded-2xl shadow-xl overflow-hidden`}>
                <div className={`${c.bar} h-1 animate-shrink-bar`} style={{ animationDuration: `${duration}ms` }} />
                <div className="flex items-start gap-3 p-4">
                    {c.icon}
                    <p className={`${c.text} text-sm font-medium flex-1 leading-relaxed`}>{message}</p>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition shrink-0">
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;

// Hook for easy usage
export const useToast = () => {
    const [toast, setToast] = React.useState<{ message: string; type: ToastType; visible: boolean }>({
        message: '',
        type: 'info',
        visible: false,
    });

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    return { toast, showToast, hideToast };
};
