import { useState } from "react"
import { sendMessage, uploadImage } from "../services/api"

export default function ChatBox({
  selectedSubject,
  messages,
  setMessages
}) {

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)


  async function handleSend() {

    if (!message.trim()) return

    const userMessage = {
      role: "user",
      content: message
    }

    setMessages(prev => [...prev, userMessage])

    const currentMessage = message

    setMessage("")

    try {
      setLoading(true)
      const response = await sendMessage(currentMessage)

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: response.reply
        }
      ])
     setLoading(false)
    } catch (error) {
      setLoading(false)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Backend connection failed."
        }
      ])

      console.error(error)
    }
  }
  async function handleImageUpload(event) {

  const file = event.target.files[0]

  if (!file) return

  try {

    const response = await uploadImage(file)

    setMessage(response.question)

  } catch (error) {

    console.error(error)

    alert("Image upload failed")

  }
}

  return (
    <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold">
    AI Cognitive Tutor
  </h2>

  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl">
    {selectedSubject}
  </span>

</div>

      <div className="h-96 overflow-y-auto border rounded-xl p-4 bg-slate-50">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user"
                ? "text-right"
                : "text-left"
            }`}
          >{loading && (

  <div className="mb-4">

    <div className="inline-block bg-white p-4 rounded-2xl shadow-sm">

      AI is thinking...

    </div>

  </div>

)}

            <div
              className={`inline-block p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.content}
            </div>

          </div>

        ))}

      </div>

      <div className="flex gap-3 mt-4">
        <input
  type="file"
  accept="image/*"
  id="imageUpload"
  hidden
  onChange={handleImageUpload}
/>
<label
  htmlFor="imageUpload"
  className="
  cursor-pointer
  bg-slate-200
  px-4
  rounded-xl
  flex
  items-center
  "
>
  📷
</label>


        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Ask a question..."
          className="flex-1 border rounded-xl p-3"
        />

        <button
          onClick={handleSend}
          className="
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
px-8
rounded-xl
transition
"
        >
          Send
        </button>

      </div>

    </div>
  )
}