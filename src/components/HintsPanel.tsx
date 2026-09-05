import { useState } from 'react'
import { useGame } from '../contexts/GameContext'

interface Props {
  challengeId: string
  hints: string[]
}

export default function HintsPanel({ challengeId, hints }: Props) {
  const { useHint } = useGame()
  const [hintIdx, setHintIdx] = useState(0)
  const [show, setShow] = useState(false)

  const nextHint = () => {
    if (hintIdx < hints.length - 1) {
      setHintIdx((i) => i + 1)
      useHint(challengeId)
    }
  }

  if (hints.length === 0) return null

  return (
    <div className="hints">
      <button className="hints__toggle" onClick={() => setShow(!show)}>
        {show ? '↑ Hide hints' : `⚠ Reveal hint (${hintIdx + 1}/${hints.length})`}
      </button>
      {show && (
        <div className="hints__content">
          <p className="hints__text">{hints[hintIdx]}</p>
          {hintIdx < hints.length - 1 && (
            <button className="hints__next" onClick={nextHint}>
              Next hint
            </button>
          )}
        </div>
      )}
    </div>
  )
}
