export default function EffortPanel({ effortResult }) {
  const score = effortResult ? effortResult.score : null
  const level = effortResult ? effortResult.level : null
  const guidance = effortResult ? effortResult.guidance : null

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-lg">Effort Evaluation</h3>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-4 card text-center">
          <div style={{color: 'var(--text-secondary)'}}>Low</div>
          <div style={{color: score !== null && level === 'LOW' ? 'var(--text-primary)' : 'var(--accent-grey)', fontSize: 24, fontWeight: 700}}>{score !== null && level === 'LOW' ? score : '—'}</div>
        </div>
        <div className="p-4 card text-center">
          <div style={{color: 'var(--text-secondary)'}}>Medium</div>
          <div style={{color: score !== null && level === 'MEDIUM' ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: 24, fontWeight: 700}}>{score !== null && level === 'MEDIUM' ? score : '—'}</div>
        </div>
        <div className="p-4 card text-center">
          <div style={{color: 'var(--text-secondary)'}}>High</div>
          <div style={{color: score !== null && level === 'HIGH' ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: 24, fontWeight: 700}}>{score !== null && level === 'HIGH' ? score : '—'}</div>
        </div>
      </div>
      {guidance && (
        <div className="mt-4 p-4 card">
          <h4 className="font-semibold">Guidance</h4>
          <div style={{marginTop:8, color: 'var(--text-secondary)'}}>{guidance}</div>
        </div>
      )}
    </div>
  )
}
