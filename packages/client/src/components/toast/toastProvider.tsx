import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
    id: string
    title: string
    type: ToastType
}

type ToastContextType = {
    pushToast: (title: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const durationMs = 3000

const getBgClassByType = (type: ToastType) => {
    switch (type) {
        case 'success':
            return 'border-done/60 bg-done/15 text-green-200'
        case 'error':
            return 'border-error/70 bg-error/20 text-red-200'
        default:
            return 'border-accents-4 bg-accents-5/40 text-text'
    }
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const pushToast = useCallback(
        (title: string, type: ToastType = 'info') => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
            setToasts((current) => [...current, { id, title, type }])
            setTimeout(() => removeToast(id), durationMs)
        },
        [removeToast]
    )

    const value = useMemo(() => ({ pushToast }), [pushToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed right-5 top-5 z-[9999] flex w-[22rem] max-w-[90vw] flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            'pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur transition-all',
                            getBgClassByType(toast.type)
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <span>{toast.title}</span>
                            <button
                                type="button"
                                className="text-xs text-text/70"
                                onClick={() => removeToast(toast.id)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used inside ToastProvider')
    }
    return context
}
