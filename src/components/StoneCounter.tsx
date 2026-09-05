import type { CSSProperties } from 'react'
import type { Stone } from '../data/challenges'

const STONES: { id: Stone; emoji: string; label: string }[] = [
  { id: 'space',   emoji: '🌀', label: 'Space Stone' },
  { id: 'mind',   emoji: '🧠', label: 'Mind Stone' },
  { id: 'reality', emoji: '🔴', label: 'Reality Stone' },
  { id: 'power',  emoji: '💜', label: 'Power Stone' },
  { id: 'time',   emoji: '⏱️', label: 'Time Stone' },
  { id: 'soul',   emoji: '🧡', label: 'Soul Stone' },
]

interface Props {
  collected: Stone[]
  compact?: boolean
}

export default function StoneCounter({ collected, compact = false }: Props) {
  return (
    <div className={`nav__stones ${compact ? 'nav__stones--compact' : ''}`} role="img" aria-label={`${collected.length} of 6 Infinity Stones collected`}>
      {STONES.map(({ id, emoji, label }) => {
        const isCollected = collected.includes(id)
        return (
          <span
            key={id}
            className={`stone-dot ${isCollected ? 'stone-dot--collected' : ''}`}
            style={{ '--stone-color': `var(--stone-${id})` } as CSSProperties}
            title={`${label}${isCollected ? ' — Collected' : ''}`}
            aria-label={label}
          >
            {isCollected ? '◆' : '◇'}
          </span>
        )
      })}
    </div>
  )
}
