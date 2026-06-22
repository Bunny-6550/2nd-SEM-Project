import { useState, useEffect, useRef } from "react"
import { sendMessage } from "../services/api"
import UploadDropzone from "./UploadDropzone"

export default function ChatBox({ selectedSubject, messages, setMessages, clearUploadSignal }) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)

  async function handleSend() {
    if (!message.trim()) return

    const userMessage = { role: "user", content: message }
    setMessages(prev => [...prev, userMessage])

    const currentMessage = message
    setMessage("")

    try {
      setLoading(true)
      const response = await sendMessage(currentMessage)
      setMessages(prev => [...prev, { role: "assistant", content: response.reply }])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setMessages(prev => [...prev, { role: "assistant", content: "Backend connection failed." }])
      console.error(error)
    }
  }

  useEffect(() => {
    // clear typed message when parent signals a new chat reset
    setMessage("")
  }, [clearUploadSignal])

  useEffect(() => {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div className="mt-8 card p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Cognitive Tutor</h2>
      </div>

      <div ref={chatRef} className="h-96 overflow-y-auto chat-window p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            {loading && (
              <div className="mb-4">
                <div className="inline-block assistant-msg">AI is thinking...</div>
              </div>
            )}
            <div className={`inline-block p-3 ${msg.role === "user" ? "user-msg" : "assistant-msg"}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <UploadDropzone resetKey={clearUploadSignal} onUploaded={(resp) => {
          if (!resp) return
          // if resp contains question (empty string means clear)
          if ('question' in resp) setMessage(resp.question || '')
        }} />
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
      </div>
    </div>
  )
}