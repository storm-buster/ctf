import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import { challenges } from '../data/challenges'
import type { PortalType } from '../data/challenges'
import PageTransition from '../components/PageTransition'

// ── Portal theme class mapping ──────────────────────────────
const PORTAL_THEME: Record<string, string> = {
  'hidden-pixel':    'webverse',
  'recursive-loop':  'webverse',
  'time-based':      'webverse',
  'rabbit-hole':    'osintverse',
  'osint-redirect': 'osintverse',
  'document-rabbit':'osintverse',
  'signal':         'darknet',
  'cipher-loop':    'darknet',
  'packet':         'darknet',
  'reverse-loop':   'darknet',
  'pwn-terminal':   'darknet',
}

const PORTAL_TITLE: Record<PortalType, string> = {
  'hidden-pixel':    'Hidden Pixel Portal',
  'recursive-loop':  'Recursive Portal',
  'time-based':      'Time Portal',
  'rabbit-hole':    'Rabbit Hole',
  'osint-redirect': 'OSINT Portal',
  'document-rabbit': 'Document Portal',
  'signal':         'Signal Portal',
  'cipher-loop':    'Cipher Portal',
  'packet':         'Packet Portal',
  'reverse-loop':   'Reverse Portal',
  'pwn-terminal':   'Pwn Terminal',
}

const PORTAL_ICON: Record<PortalType, string> = {
  'hidden-pixel':    '⚡',
  'recursive-loop':  '🌀',
  'time-based':      '⏰',
  'rabbit-hole':    '🕳️',
  'osint-redirect': '🔍',
  'document-rabbit': '📄',
  'signal':         '📡',
  'cipher-loop':    '🔐',
  'packet':         '🌐',
  'reverse-loop':   '⚙️',
  'pwn-terminal':   '💻',
}

const PORTAL_BG: Record<string, string> = {
  webverse:  'portal--webverse',
  osintverse: 'portal--osintverse',
  darknet:  'portal--darknet',
  default:  'portal--default',
}

export default function Portal() {
  const { portalId } = useParams<{ portalId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getChallenge } = useGame()

  const [puzzleInput, setPuzzleInput] = useState('')
  const [puzzleError, setPuzzleError] = useState('')
  const [puzzleSolved, setPuzzleSolved] = useState(false)

  // portalId is the challengeId (e.g. "wv-01")
  const challenge = getChallenge(portalId ?? '')
  const portalType = (searchParams.get('type') ?? 'hidden-pixel') as PortalType
  const theme = PORTAL_THEME[portalType] ?? 'default'

  useEffect(() => {
    if (!challenge) navigate('/hub')
  }, [challenge, navigate])

  if (!challenge) return null

  const handlePuzzleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (puzzleInput.trim().toLowerCase() === challenge.portalPuzzle.puzzleAnswer.toLowerCase()) {
      setPuzzleSolved(true)
      setPuzzleError('')
    } else {
      setPuzzleError('Incorrect. Look at the clue more carefully.')
    }
  }

  const returnChallenge = () => navigate(`/challenge/${challenge.id}`)

  return (
    <PageTransition>
      <main className={`portal ${PORTAL_BG[theme]}`}>
        <div className="portal__bg-effect" aria-hidden="true" />
        <div className="portal__glitch" aria-hidden="true" />

        <div className="portal__panel">
          {/* Header */}
          <div className="portal__header">
            <span className="portal__icon">{PORTAL_ICON[portalType]}</span>
            <h1 className="portal__title">{PORTAL_TITLE[portalType] ?? 'Portal'}</h1>
            <p className="portal__subtitle">
              You entered a wrong flag. Solve the puzzle to return.
            </p>
          </div>

          {/* Puzzle card */}
          <div className="portal__card">
            {/* Recursive loop: animated rings */}
            {portalType === 'recursive-loop' && (
              <div className="portal-tunnel">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="portal-ring"
                    style={{
                      width: `${i * 40}px`,
                      height: `${i * 40}px`,
                      opacity: 0.15 + i * 0.12,
                      animation: `portal-spin ${2 + i * 0.5}s linear infinite`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Signal: waveform */}
            {(portalType === 'signal') && (
              <div className="portal-waveform">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="portal-waveform__bar" />
                ))}
              </div>
            )}

            {/* Clue */}
            <div className="portal__clue">
              {challenge.portalPuzzle.description}
            </div>

            {/* Puzzle answer */}
            <form onSubmit={handlePuzzleSubmit} className="portal__puzzle-form">
              <input
                type="text"
                value={puzzleInput}
                onChange={(e) => setPuzzleInput(e.target.value)}
                placeholder="Enter the puzzle answer..."
                className="portal__puzzle-input"
                disabled={puzzleSolved}
                autoFocus
              />
              <button
                type="submit"
                className="portal__puzzle-btn"
                disabled={puzzleSolved}
              >
                {puzzleSolved ? '✓ SOLVED' : 'CHECK'}
              </button>
            </form>

            {puzzleError && <p className="portal__puzzle-error">✗ {puzzleError}</p>}
            {puzzleSolved && (
              <div className="portal__puzzle-success">
                ✓ Correct! You solved the portal puzzle.
              </div>
            )}

            {/* Hint / clue text */}
            <div className="portal__hint">
              💡 <em>{challenge.portalPuzzle.clue}</em>
            </div>
          </div>

          {/* Actions */}
          <div className="portal__actions">
            <button className="portal__btn portal__btn--back" onClick={() => navigate('/hub')}>
              ← Hub
            </button>
            {puzzleSolved ? (
              <button className="portal__btn portal__btn--return" onClick={returnChallenge}>
                ← Return to Challenge
              </button>
            ) : (
              <button className="portal__btn portal__btn--return" onClick={returnChallenge} style={{ opacity: 0.4 }}>
                ← Return (solve puzzle first)
              </button>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  )
}
