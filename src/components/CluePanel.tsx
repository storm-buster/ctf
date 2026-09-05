import { useState } from 'react'

interface Props {
  label: string
  body: string
  format?: 'code' | 'image' | 'terminal' | 'metadata'
  color?: string
}

export default function CluePanel({ label, body, format = 'code', color }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="clue-panel" style={color ? { ['--ch-color' as any]: color } : undefined}>
      <button
        className="clue-panel__header"
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left' }}
      >
        <span className="clue-panel__label">{open ? '▼' : '▶'} {label}</span>
        <span className="clue-panel__toggle">{open ? 'HIDE' : 'SHOW'}</span>
      </button>
      {open && (
        <div className="clue-panel__body">
          {format === 'image' ? (
            <div className="clue-panel__image" style={{
              background: 'var(--surface)',
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-dim)',
              fontFamily: 'var(--mono)',
              fontSize: '0.85rem',
            }}>{body}</div>
          ) : format === 'terminal' ? (
            <div className="terminal">
              <div className="terminal__bar">
                <span className="terminal__dot terminal__dot--red" />
                <span className="terminal__dot terminal__dot--yellow" />
                <span className="terminal__dot terminal__dot--green" />
              </div>
              <div className="terminal__body">
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{body}</pre>
              </div>
            </div>
          ) : (
            <pre className="clue-panel__code">{body}</pre>
          )}
        </div>
      )}
    </div>
  )
}
