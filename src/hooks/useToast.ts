import { useState, useCallback } from 'react';

/**
 * Toast notification state and controls.
 */
interface ToastState {
    /** Whether the toast is currently visible */
    visible: boolean;
    /** The message displayed in the toast */
    message: string;
    /** The toast variant: 'success', 'error', or 'info' */
    type: 'success' | 'error' | 'info';
}

/** Default toast state */
const DEFAULT_TOAST: ToastState = {
    visible: false,
    message: '',
    type: 'info',
};

/**
 * Custom hook for managing toast notifications.
 *
 * @param {number} [duration=4000] - Auto-dismiss duration in milliseconds
 * @returns Toast state and control functions
 *
 * @example
 * ```tsx
 * const { toast, showToast, hideToast } = useToast();
 *
 * showToast('Donation saved!', 'success');
 * ```
 */
export function useToast(duration = 4000) {
    const [toast, setToast] = useState<ToastState>(DEFAULT_TOAST);

    const showToast = useCallback(
        (message: string, type: ToastState['type'] = 'info') => {
            setToast({ visible: true, message, type });
            setTimeout(() => {
                setToast(DEFAULT_TOAST);
            }, duration);
        },
        [duration]
    );

    const hideToast = useCallback(() => {
        setToast(DEFAULT_TOAST);
    }, []);

    return { toast, showToast, hideToast };
}
