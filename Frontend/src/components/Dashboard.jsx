import Analytics from "./Analytics"
import EffortPanel from "./EffortPanel"

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

      <div className="md:col-span-8 col-span-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-4 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg">Questions Solved</h3>
            <div className="text-3xl font-bold mt-2">1,024</div>
          </div>
          <div className="card p-4 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg">Study Sessions</h3>
            <div className="text-3xl font-bold mt-2">318</div>
          </div>
        </div>

        <div className="mt-4">
          <Analytics />
        </div>
      </div>

      <div className="md:col-span-4 col-span-1">
        <EffortPanel />
      </div>

    </div>
  )
}
