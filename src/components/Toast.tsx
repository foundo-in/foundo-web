'use client'

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

/* ── Types ───────────────────────────────────────────────────── */
type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  exiting?: boolean
}

interface ToastContextValue {
  success: (msg: string) => void
  error:   (msg: string) => void
  info:    (msg: string) => void
}

/* ── Context ─────────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

/* ── Provider ────────────────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    // Trigger exit animation first
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    const t = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      timers.current.delete(id)
    }, 320)
    timers.current.set(id + '_exit', t)
  }, [])

  const add = useCallback((message: string, variant: ToastVariant) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-4), { id, message, variant }])
    const t = setTimeout(() => dismiss(id), 4000)
    timers.current.set(id, t)
  }, [dismiss])

  useEffect(() => {
    const map = timers.current
    return () => map.forEach(t => clearTimeout(t))
  }, [])

  const value: ToastContextValue = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* ── Toast container ── */}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
          maxWidth: 'calc(100vw - 48px)',
        }}
      >
        {toasts.map(t => (
          <ToastChip
            key={t.id}
            toast={t}
            onDismiss={() => dismiss(t.id)}
          />
        ))}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(8px) scale(0.96); }
        }
        .toast-chip {
          animation: toastIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .toast-chip.exiting {
          animation: toastOut 0.3s cubic-bezier(0.4, 0, 1, 1) both;
        }
      `}</style>
    </ToastContext.Provider>
  )
}

/* ── Individual chip ─────────────────────────────────────────── */
const ICONS: Record<ToastVariant, string> = {
  success: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>`,
  error:   `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`,
  info:    `<circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/>`,
}

const COLORS: Record<ToastVariant, { bg: string; border: string; icon: string }> = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A' },
  error:   { bg: '#FEF2F2', border: '#FECACA', icon: '#DC2626' },
  info:    { bg: '#F0F9FF', border: '#BAE6FD', icon: '#0369A1' },
}

function ToastChip({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const c = COLORS[toast.variant]
  return (
    <div
      className={`toast-chip${toast.exiting ? ' exiting' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
        pointerEvents: 'all',
        minWidth: 240,
        maxWidth: 360,
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <svg
        width="16" height="16" fill="none"
        stroke={c.icon} strokeWidth="2" viewBox="0 0 24 24"
        style={{ flexShrink: 0 }}
        dangerouslySetInnerHTML={{ __html: ICONS[toast.variant] }}
      />
      {/* Message */}
      <span style={{ fontSize: 13, fontWeight: 500, color: '#111', flex: 1, lineHeight: 1.45 }}>
        {toast.message}
      </span>
      {/* Dismiss */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 2, borderRadius: 4,
          color: '#9CA3AF', fontSize: 16, lineHeight: 1,
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ×
      </button>
    </div>
  )
}
