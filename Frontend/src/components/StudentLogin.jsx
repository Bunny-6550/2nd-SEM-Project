import { useState } from 'react'

export default function StudentLogin({ onSubmit }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e?.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome to SmartAI</h2>
        <p className="text-sm text-slate-400 mb-4">Please enter your name to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-3 input-bar" />
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">Continue</button>
          </div>
        </form>
      </div>
    </div>
  )
}
