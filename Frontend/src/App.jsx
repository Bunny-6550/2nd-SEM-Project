import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import ChatBox from "./components/ChatBox"
import { useState } from "react"

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
  
  return (
    <div className="min-h-screen app-bg flex">

      <Sidebar messages={messages} setMessages={setMessages} setSelectedSubject={setSelectedSubject} selectedSubject={selectedSubject} onNewChat={() => setClearUploadSignal(c => c + 1)} />

      <div className="flex-1 p-10">

        <Dashboard />

        <ChatBox selectedSubject={selectedSubject} messages={messages} setMessages={setMessages} clearUploadSignal={clearUploadSignal} />

      </div>

    </div>
  )
}

export default App