import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import ChatBox from "./components/ChatBox"
import StudentLogin from "./components/StudentLogin"
import { useState, useEffect } from "react"
import { getHistory } from "./services/api"

function App() {

  const [messages, setMessages] = useState([
  {
    role: "assistant",
    content: "Hello! I'm your AI Cognitive Tutor."
  }
])
  const [selectedSubject, setSelectedSubject] =
    useState("Math")
  const [clearUploadSignal, setClearUploadSignal] = useState(0)
  const [effortResult, setEffortResult] = useState(null)
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem('studentName') || ''
    } catch (e) { return '' }
  })
  
  function saveStudent(name) {
    setStudentName(name)
    try { localStorage.setItem('studentName', name) } catch (e) {}
  }

  useEffect(() => {
    // when a studentName is set, load their chat history from backend
    if (!studentName) return
    let mounted = true
    getHistory(studentName).then((res) => {
      if (!mounted) return
      try {
        if (res && res.history) setMessages(res.history)
      } catch (e) {}
    }).catch(() => {})
    return () => { mounted = false }
  }, [studentName])

  if (!studentName) {
    return <StudentLogin onSubmit={saveStudent} />
  }

  return (
    <div className="min-h-screen app-bg flex">

      <Sidebar messages={messages} setMessages={setMessages} setSelectedSubject={setSelectedSubject} selectedSubject={selectedSubject} onNewChat={() => setClearUploadSignal(c => c + 1)} studentName={studentName} setStudentName={(n) => { setStudentName(n); localStorage.setItem('studentName', n) }} />

      <div className="flex-1 p-10">

            <Dashboard effortResult={effortResult} />

            <ChatBox studentName={studentName} selectedSubject={selectedSubject} messages={messages} setMessages={setMessages} clearUploadSignal={clearUploadSignal} onEffortResult={(r) => setEffortResult(r)} />

      </div>

    </div>
  )
}

export default App