'use client'

import { useState } from 'react'

export default function ConnectButton({
  startupId,
  alreadyConnected,
}: {
  startupId: string
  alreadyConnected: boolean
}) {
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
      if (!res.ok) throw new Error(data.error || 'Failed')

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
        fontSize: 12, fontWeight: 700, color: '#15803D',
        border: '1.5px solid #15803D', padding: '10px 20px',
        letterSpacing: 1, textTransform: 'uppercase',
      }}>
        Request Sent
      </span>
    )
  }

  if (showForm) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 300 }}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Introduce yourself briefly (optional)"
          rows={3}
          style={{
            border: '1px solid #E5E7EB',
            padding: '10px 12px',
            fontSize: 13,
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            color: '#111',
            transition: 'border-color 0.15s',
            borderRadius: 0,
          }}
          onFocus={e => (e.target.style.borderColor = '#E84A00')}
          onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
        />
        {error && <p style={{ color: '#B91C1C', fontSize: 12, margin: 0 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="btn-primary"
            style={{ flex: 1, fontSize: 13 }}
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="btn-outline"
            style={{ fontSize: 13 }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="btn-primary"
    >
      Connect
    </button>
  )
}