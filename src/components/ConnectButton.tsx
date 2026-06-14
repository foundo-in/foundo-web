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
      <span className="bg-green-100 text-green-700 text-sm font-bold px-4 py-2.5 rounded-lg">
        ✓ Request Sent
      </span>
    )
  }

  if (showForm) {
    return (
      <div className="flex flex-col gap-2 w-64">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Introduce yourself briefly... (optional)"
          rows={3}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E84A00] resize-none"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="flex-1 bg-[#E84A00] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#cf4000] transition-colors disabled:opacity-40"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#4B5563] hover:border-[#9CA3AF]"
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
      className="bg-[#E84A00] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#cf4000] transition-colors"
    >
      Connect →
    </button>
  )
}