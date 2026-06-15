'use client'

import { useState } from 'react'

export default function ConnectButton({ startupId, alreadyConnected }: { startupId: string; alreadyConnected: boolean }) {
  const [connected, setConnected] = useState(alreadyConnected)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleConnect() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setConnected(true)
      setShowForm(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 13, fontWeight: 600, color: 'var(--green)',
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: 6,
        padding: '0 14px', height: 36,
      }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Request Sent
      </span>
    )
  }

  if (showForm) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Introduce yourself briefly (optional)"
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: 13,
            fontFamily: 'inherit',
            color: 'var(--ink)',
            background: '#fff',
            border: '1px solid var(--n200)',
            borderRadius: 6,
            resize: 'none',
            outline: 'none',
            lineHeight: 1.55,
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,74,0,0.10)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--n200)'; e.target.style.boxShadow = 'none' }}
        />
        {error && (
          <p style={{ fontSize: 12, color: 'var(--red)', margin: 0, padding: '6px 10px', background: '#FEF2F2', borderRadius: 4 }}>
            {error}
          </p>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleConnect} disabled={loading} className="btn btn-primary" style={{ flex: 1, fontFamily: 'inherit' }}>
            {loading ? 'Sending…' : 'Send Request'}
          </button>
          <button onClick={() => setShowForm(false)} className="btn btn-secondary" style={{ fontFamily: 'inherit' }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ fontFamily: 'inherit' }}>
      Connect
    </button>
  )
}