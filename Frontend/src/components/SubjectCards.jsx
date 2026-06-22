const subjects = [
  "📐 Math",
  "⚛ Physics",
  "🧪 Chemistry",
  "🧬 Biology",
  "💻 Programming"
]

export default function SubjectCards({
  selectedSubject,
  setSelectedSubject
}) {
  return (
    <div className="grid grid-cols-5 gap-4 mt-8">

      {subjects.map((subject) => (
        <button
  key={subject}
  onClick={() => setSelectedSubject(subject)}
  className={`
    rounded-2xl
    shadow-md
    p-5
    transition-all
    duration-200

    ${
      selectedSubject === subject
        ? "bg-blue-600 text-white scale-105"
        : "bg-white hover:shadow-xl hover:scale-105"
    }
  `}
>
  {subject}
</button>
      ))}

    </div>
  )
}