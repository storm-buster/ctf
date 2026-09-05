import type { ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
}

export default function NarrativePanel({ label, children }: Props) {
  return (
    <div className="narrative-panel">
      <div className="narrative-panel__label">{label}</div>
      <p className="narrative-panel__text">{children}</p>
    </div>
  )
}
