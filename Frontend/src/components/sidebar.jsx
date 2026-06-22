export default function Sidebar({
  setMessages
}) {
  return (
    <div className="w-72 bg-slate-900 text-white p-6 min-h-screen">

      <h1 className="text-3xl font-bold">
        LearnAI
      </h1>

      <p className="text-slate-400 mt-2">
        AI Learning Assistant
      </p>

      <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 p-3 rounded-xl transition">
        + New Chat
      </button>

      <div className="mt-10">
        <h3 className="font-semibold mb-4">
          Recent Topics
        </h3>

        <div className="space-y-2">

          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-800">
            📐 Algebra
          </button>

          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-800">
            ⚛ Physics
          </button>

          <button className="w-full text-left p-3 rounded-lg hover:bg-slate-800">
            🧪 Chemistry
          </button>

        </div>
      </div>

    </div>
  )
}