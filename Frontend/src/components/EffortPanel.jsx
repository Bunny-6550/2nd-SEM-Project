export default function EffortPanel() {
  return (
    <div className="card p-4">
      <h3 className="font-semibold text-lg">Effort Evaluation</h3>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-4 card text-center">
          <div style={{color: 'var(--text-secondary)'}}>Low</div>
          <div style={{color: 'var(--accent-grey)', fontSize: 24, fontWeight: 700}}>—</div>
        </div>
        <div className="p-4 card text-center">
          <div style={{color: 'var(--text-secondary)'}}>Medium</div>
          <div style={{color: 'var(--text-secondary)', fontSize: 24, fontWeight: 700}}>—</div>
        </div>
        <div className="p-4 card text-center">
          <div style={{color: 'var(--text-secondary)'}}>High</div>
          <div style={{color: 'var(--text-primary)', fontSize: 24, fontWeight: 700}}>—</div>
        </div>
      </div>
    </div>
  )
}
