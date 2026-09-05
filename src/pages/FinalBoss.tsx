import { useGame } from '../contexts/GameContext'
import { useNavigate } from 'react-router-dom'
import type { CSSProperties } from 'react'
import StoneCounter from '../components/StoneCounter'
import PageTransition from '../components/PageTransition'

const STONE_INFO = [
  { id: 'space' as const,   color: 'var(--stone-space)',   label: 'SPACE' },
  { id: 'mind' as const,    color: 'var(--stone-mind)',    label: 'MIND' },
  { id: 'reality' as const, color: 'var(--stone-reality)', label: 'REALITY' },
  { id: 'power' as const,   color: 'var(--stone-power)',   label: 'POWER' },
  { id: 'time' as const,    color: 'var(--stone-time)',    label: 'TIME' },
  { id: 'soul' as const,    color: 'var(--stone-soul)',    label: 'SOUL' },
]

export default function FinalBoss() {
  const { state } = useGame()
  const navigate = useNavigate()
  const { stones } = state

  const allCollected = stones.length === 6

  return (
    <PageTransition>
      <main className="finalboss">
        {/* Doctor Doom SVG */}
        <svg className="finalboss__doom" viewBox="0 0 160 160" aria-hidden="true" width="120" height="120">
          <defs>
            <radialGradient id="doom-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,204,102,0.15)" />
              <stop offset="100%" stopColor="rgba(0,204,102,0)" />
            </radialGradient>
          </defs>
          <circle cx="80" cy="80" r="78" fill="url(#doom-bg)" />
          <circle cx="80" cy="80" r="76" fill="none" stroke="var(--doom-primary)" strokeWidth="1" opacity="0.3" />
          {/* Doom mask face */}
          <path d="M40 60 L80 45 L120 60 L120 90 L80 110 L40 90 Z"
            fill="none" stroke="var(--doom-primary)" strokeWidth="2" opacity="0.6" />
          {/* Mask eye slits */}
          <rect x="52" y="66" width="18" height="5" rx="2" fill="var(--doom-primary)" opacity="0.8" />
          <rect x="90" y="66" width="18" height="5" rx="2" fill="var(--doom-primary)" opacity="0.8" />
          {/* Mask mouth */}
          <rect x="55" y="82" width="50" height="4" rx="2" fill="var(--doom-primary)" opacity="0.5" />
          <rect x="60" y="82" width="40" height="4" rx="2" fill="none" stroke="var(--doom-primary)" strokeWidth="0.5" opacity="0.4" />
          {/* DOOM text */}
          <text x="80" y="132" textAnchor="middle" fontFamily="serif" fontWeight="900"
            fontSize="22" fill="var(--doom-primary)" opacity="0.8" letterSpacing="6">DOOM</text>
          {/* Infinity cracks */}
          <path d="M80 45 L80 20" stroke="#ff2d55" strokeWidth="1.5" opacity="0.6" />
          <path d="M120 90 L140 100" stroke="#ff2d55" strokeWidth="1.5" opacity="0.5" />
          <path d="M40 90 L20 100" stroke="#ff2d55" strokeWidth="1.5" opacity="0.5" />
          {/* Crown spikes */}
          <path d="M40 60 L30 40 L45 55" fill="none" stroke="var(--doom-primary)" strokeWidth="1.5" opacity="0.5" />
          <path d="M120 60 L130 40 L115 55" fill="none" stroke="var(--doom-primary)" strokeWidth="1.5" opacity="0.5" />
          <path d="M80 45 L80 25" stroke="var(--doom-primary)" strokeWidth="1.5" opacity="0.5" />
        </svg>

        <h1 className="finalboss__title">DOCTOR DOOM</h1>
        <p className="finalboss__desc">
          {allCollected
            ? 'You have collected all six Infinity Stones. Face the ruler of Battleworld.'
            : 'Collect all six Infinity Stones to challenge Doctor Doom on Battleworld.'}
        </p>

        {/* Stones row */}
        <div className="finalboss__stones">
          {STONE_INFO.map(({ id, color, label }) => {
            const collected = stones.includes(id)
            return (
              <div key={id} className="finalboss__stone-slot">
                <div
                  className={`stone-dot stone-dot--large ${collected ? 'stone-dot--collected' : ''}`}
                  style={{ '--stone-color': color } as CSSProperties}
                >
                  {collected ? '◆' : '◇'}
                </div>
                <span className="finalboss__stone-name">{label}</span>
              </div>
            )
          })}
        </div>

        {/* Stone progress bar */}
        {!allCollected && (
          <div style={{
            width: '100%', maxWidth: '400px',
            margin: '0 auto 2rem',
            padding: '1rem',
            background: 'var(--surface-alt)', borderRadius: '10px',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                STONES COLLECTED
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--doom-primary)' }}>
                {stones.length}/6
              </span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(stones.length / 6) * 100}%`,
                background: 'linear-gradient(90deg, var(--stone-space), var(--stone-reality), var(--stone-power), var(--stone-time), var(--stone-soul), var(--stone-mind))',
                borderRadius: '2px',
                transition: 'width 0.6s ease',
                boxShadow: '0 0 8px rgba(0,204,102,0.4)',
              }} />
            </div>
          </div>
        )}

        {allCollected ? (
          <div className="finalboss__victory">
            {/* Victory burst */}
            <svg viewBox="0 0 80 80" width="60" height="60" aria-hidden="true" style={{ display: 'block', margin: '0 auto 1rem' }}>
              <circle cx="40" cy="40" r="36" fill="none" stroke="var(--success)" strokeWidth="2" opacity="0.5" />
              <circle cx="40" cy="40" r="28" fill="none" stroke="var(--success)" strokeWidth="1.5" opacity="0.3" />
              <path d="M40 16 L44 32 L60 32 L48 42 L52 58 L40 50 L28 58 L32 42 L20 32 L36 32 Z"
                fill="var(--success)" opacity="0.8" />
            </svg>

            <h2>★ THE MULTIVERSE IS RESTORED ★</h2>
            <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Doctor Doom has been defeated. Battleworld crumbles. Reality stabilizes.
            </p>
            <p className="finalboss__flag">DOOM&#123;f1n4l_b0ss_r1ddl3&#125;</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Congratulations, {state.participant?.name}. The multiverse thanks you.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="finalboss__btn" onClick={() => navigate('/hub')}>
                ← Return to Hub
              </button>
              <button
                onClick={() => { if (confirm('Reset all progress?')) { localStorage.clear(); navigate('/') } }}
                style={{
                  padding: '12px 32px', background: 'none',
                  border: '1px solid rgba(255,45,85,0.3)', borderRadius: '10px',
                  color: 'var(--error)', fontFamily: 'var(--heading)',
                  fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.08em',
                }}
              >
                Reset Progress
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="finalboss__incomplete">
              {stones.length}/6 Stones collected. Complete challenges to unlock more.
            </p>
            <StoneCounter collected={stones} />
            <div style={{ marginTop: '2rem' }}>
              <button className="finalboss__btn" onClick={() => navigate('/hub')}>
                ← Back to Hub
              </button>
            </div>
          </div>
        )}

        {/* Footer quote */}
        <p style={{
          marginTop: '3rem', fontFamily: 'var(--mono)', fontSize: '0.68rem',
          color: 'var(--text-dim)', letterSpacing: '0.06em', opacity: 0.4,
          maxWidth: '500px',
        }}>
          "You think yourself a god. But gods die." — Doctor Doom, Avengers: Doomsday
        </p>
      </main>
    </PageTransition>
  )
}
