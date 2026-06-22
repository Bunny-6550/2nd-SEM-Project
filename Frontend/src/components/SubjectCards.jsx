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
    subject-card
    p-5
    transition-all
    duration-200

    ${
      selectedSubject === subject
        ? "selected text-white"
        : "text-white/80 hover:shadow-xl"
    }
  `}
>
  {subject}
</button>
      ))}

    </div>
  )
}