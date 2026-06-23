import { useEffect, useState } from 'react'

export default function Sidebar({ messages, setMessages, setSelectedSubject, selectedSubject, onNewChat, studentName, setStudentName }) {
  const [recentTopics, setRecentTopics] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, topicId: null })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recentTopics')
      if (raw) setRecentTopics(JSON.parse(raw))
    } catch (e) {
      console.error(e)
    }
  }, [])

  function persist(topics) {
    setRecentTopics(topics)
    localStorage.setItem('recentTopics', JSON.stringify(topics))
  }

  function generateTitleFromQuestion(q) {
    if (!q) return `Conversation ${recentTopics.length + 1}`
    const s = q.toLowerCase()
    // simple keyword-based topics
    if (/multiply|x|times|multipl/i.test(s)) return 'Multiplication'
    if (/divide|\/|÷|divis/i.test(s)) return 'Division'
    if (/add|plus|sum|addition/i.test(s)) return 'Addition'
    if (/subtract|minus|difference|subtract/i.test(s)) return 'Subtraction'
    if (/integral|derivative|calculus|differentiat/i.test(s)) return 'Calculus'
    if (/equation|solve|quadratic|linear/i.test(s)) return 'Equation Solving'
    if (/simplify|factor|algebra|expand/i.test(s)) return 'Algebra'
    // fallback: take first 4 words, strip punctuation
    const words = q.replace(/[?!.]/g, '').split(/\s+/).filter(Boolean)
    const title = words.slice(0, 4).join(' ')
    return title.length ? (title.length > 30 ? title.slice(0, 30) + '...' : title) : `Conversation ${recentTopics.length + 1}`
  }

  function saveCurrentConversationAndNew() {
    // Save current conversation if it has user messages
    const userMsgs = (messages || []).filter(m => m.role === 'user')
    if (userMsgs.length > 0) {
      const id = Date.now().toString()
      const title = generateTitleFromQuestion(userMsgs[0].content)
      const topic = {
        id,
        title,
        subject: selectedSubject || 'General',
        messages: JSON.parse(JSON.stringify(messages)),
      }
      const updated = [topic, ...recentTopics].slice(0, 20)
      persist(updated)
    }

    setMessages([{ role: 'assistant', content: "Hello! I'm your AI Cognitive Tutor." }])
    if (onNewChat) onNewChat()
  }

  function openTopic(topic) {
    setMessages(JSON.parse(JSON.stringify(topic.messages)))
    if (setSelectedSubject) setSelectedSubject(topic.subject)
  }

  function startRename(topic) {
    setEditingId(topic.id)
    setEditTitle(topic.title)
    // focus will be handled by effect
  }

  function commitRename(id) {
    const updated = recentTopics.map(t => t.id === id ? { ...t, title: editTitle || t.title } : t)
    persist(updated)
    setEditingId(null)
    setEditTitle('')
  }

  function handleContextMenu(topic, e) {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, topicId: topic.id })
  }

  useEffect(() => {
    function onClick() { if (contextMenu.visible) setContextMenu({ visible: false, x: 0, y: 0, topicId: null }) }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [contextMenu.visible])

  // autofocus when starting rename
  useEffect(() => {
    if (editingId) {
      const el = document.getElementById(`rename-${editingId}`)
      if (el) { el.focus(); el.select(); }
    }
  }, [editingId])

  function deleteTopic(id) {
    if (!window.confirm('Delete this recent topic?')) return
    const updated = recentTopics.filter(t => t.id !== id)
    persist(updated)
  }

  return (
    <div className="w-72 sidebar-root text-white p-6 min-h-screen">

      <h1 className="text-3xl font-bold">
        SmartAI
      </h1>
      <p className="text-slate-400 mt-2" style={{color: 'var(--text-secondary)'}}>
        AI Tutoring Assistant
      </p>

      {studentName && (
        <div style={{marginTop:8, marginBottom:8}}>
          <div style={{fontSize:12, color:'var(--text-secondary)'}}>Signed in as</div>
          <div style={{fontWeight:700}}>{studentName}</div>
          <button className="btn-ghost mt-2" onClick={() => { if (setStudentName) { setStudentName(''); try { localStorage.removeItem('studentName') } catch(e){} } }}>Logout</button>
        </div>
      )}

      <button className="w-full mt-8 btn-ghost p-3 rounded-xl transition" onClick={saveCurrentConversationAndNew}>
        + New Chat
      </button>

      

      <div className="mt-10">
        <h3 className="font-semibold mb-4">Recent Topics</h3>

        <div className="space-y-2">
          {recentTopics.length === 0 && (
            <div style={{color: 'var(--text-secondary)'}}>No recent topics yet — start a conversation to save one.</div>
          )}

          {recentTopics.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <button
                className={`flex-1 text-left nav-pill ${selectedSubject === t.subject ? 'active' : ''}`}
                onClick={() => openTopic(t)}
                onContextMenu={(e) => handleContextMenu(t, e)}
              >
                {editingId === t.id ? (
                  <input id={`rename-${t.id}`} className="bg-transparent outline-none w-full" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={() => commitRename(t.id)} onKeyDown={(e) => e.key === 'Enter' && commitRename(t.id)} />
                ) : (
                  <span>{t.title}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {contextMenu.visible && (
        (() => {
          const topic = recentTopics.find(t => t.id === contextMenu.topicId)
          if (!topic) return null
          return (
            <div style={{position: 'fixed', left: contextMenu.x, top: contextMenu.y, background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 8, zIndex: 1000}}>
              <button className="btn-ghost w-full text-left" onClick={(e) => { e.stopPropagation(); startRename(topic); setContextMenu({ visible: false, x:0,y:0,topicId:null }) }}>Rename</button>
              <button className="btn-ghost w-full text-left" onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); setContextMenu({ visible: false, x:0,y:0,topicId:null }) }}>Delete</button>
            </div>
          )
        })()
      )}

    </div>
  )
}