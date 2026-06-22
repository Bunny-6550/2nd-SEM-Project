import Sidebar from "./components/Sidebar"
import Hero from "./components/Hero"
import SubjectCards from "./components/SubjectCards"
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
  
  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar
  setMessages={setMessages}
/>

      <div className="flex-1 p-10">

        <Hero />

        <SubjectCards
  selectedSubject={selectedSubject}
  setSelectedSubject={setSelectedSubject}
/>

        <ChatBox
  selectedSubject={selectedSubject}
  messages={messages}
  setMessages={setMessages}
/>

      </div>

    </div>
  )
}

export default App