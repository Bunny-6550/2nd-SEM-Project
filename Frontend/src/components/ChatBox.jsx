import { useState, useEffect, useRef } from "react"
import { sendMessage } from "../services/api"
import UploadDropzone from "./UploadDropzone"

export default function ChatBox({ studentName, selectedSubject, messages, setMessages, clearUploadSignal, onEffortResult }) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingAttachments, setPendingAttachments] = useState([])
  const [dzResetKey, setDzResetKey] = useState(0)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const chatRef = useRef(null)
  const bottomRef = useRef(null)

  async function handleSend() {
    if (!message.trim() && (!pendingAttachments || pendingAttachments.length === 0)) return

    const userMessage = { role: "user", content: message, attachments: pendingAttachments }
    setMessages(prev => [...prev, userMessage])

    const currentMessage = message
    setMessage("")
    // clear pending attachments and reset dropzone so user can upload new images
    setPendingAttachments([])
    setDzResetKey(k => k + 1)

      try {
        setLoading(true)
        const response = await sendMessage(currentMessage, studentName)
        setMessages(prev => [...prev, { role: "assistant", content: response.reply }])
        setLoading(false)
      } catch (error) {
      setLoading(false)
      setMessages(prev => [...prev, { role: "assistant", content: "Backend connection failed." }])
      console.error(error)
    }
  }

  async function handleEvaluateEffort() {
    // find last user message and preceding assistant message (question)
    const reversed = [...messages].slice().reverse()
    const lastUser = reversed.find(m => m.role === 'user')
    const lastAssistantBefore = (() => {
      const idx = messages.lastIndexOf(lastUser)
      if (idx <= 0) return null
      for (let i = idx - 1; i >= 0; i--) {
        if (messages[i].role === 'assistant') return messages[i]
      }
      return null
    })()

    const question = lastAssistantBefore ? lastAssistantBefore.content : ''
    const answer = lastUser ? lastUser.content : ''
    if (!answer) return

    try {
      const res = await fetch('http://127.0.0.1:8000/effort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_name: studentName || 'Student', subject: selectedSubject, question, answer })
      })
      const json = await res.json()
      if (onEffortResult) onEffortResult(json)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    // clear typed message when parent signals a new chat reset
    setMessage("")
  }, [clearUploadSignal])

  useEffect(() => {
    // scroll to bottom when messages change or while loading
    try {
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    } catch (e) {}
  }, [messages, loading])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setLightboxSrc(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="mt-8 card no-hover p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Cognitive Tutor</h2>
      </div>

      <div ref={chatRef} className="h-96 overflow-y-auto chat-window p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block p-3 ${msg.role === "user" ? "user-msg" : "assistant-msg"}`}>
              <div>{msg.content}</div>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {msg.attachments.map((a, i) => (
                    <img key={i} src={a.preview} alt={a.filename} style={{width: 120, height: 80, objectFit: 'cover', borderRadius: 8, cursor: 'pointer'}} onClick={() => setLightboxSrc(a.preview)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-4">
            <div className="inline-block assistant-msg">AI is thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4">
        <UploadDropzone resetKey={dzResetKey} onChangeAttachments={(attach) => setPendingAttachments(attach)} onExtracted={(q) => setMessage(q)} />
      </div>

      <div className="flex gap-3 mt-4 items-center">
        <div className="input-bar flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Ask a question..."
            className="bg-transparent outline-none w-full"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <button onClick={handleSend} className="btn-primary">Send</button>
        <button onClick={() => { try { if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }) } catch (e) {} }} className="btn-ghost">Latest</button>
      </div>
      {lightboxSrc && (
        <div onClick={() => setLightboxSrc(null)} style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60}}>
          <img src={lightboxSrc} alt="preview" style={{maxWidth: '95%', maxHeight: '95%', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}} />
        </div>
      )}
    </div>
  )
}