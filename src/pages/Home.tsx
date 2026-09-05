import { useState, type FormEvent, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import type { Stone } from '../data/challenges'

export default function Home() {
  const { startGame, state } = useGame()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Resume path
  if (state.participant) {
    return (
      <main className="home">
        <div className="home__bg" aria-hidden="true">
          <div className="home__portals">
            <div className="home__portal-ring" />
            <div className="home__portal-ring" />
            <div className="home__portal-ring" />
          </div>
          <div className="home__orb home__orb--1" />
          <div className="home__orb home__orb--2" />
          <div className="home__orb home__orb--3" />
        </div>
        <div className="home__card">
          {/* Cracked multiverse icon */}
          <svg className="home__doom-icon" viewBox="0 0 80 80" aria-hidden="true" width="72" height="72">
            <defs>
              <radialGradient id="dm" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="50%" stopColor="#009944" />
                <stop offset="100%" stopColor="#003322" />
              </radialGradient>
            </defs>
            {/* Outer ring */}
            <circle cx="40" cy="40" r="36" fill="none" stroke="url(#dm)" strokeWidth="2" opacity="0.4" />
            {/* Crack lines */}
            <path d="M30 20 L40 40 L34 55" stroke="#ff2d55" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M40 40 L50 28 L55 40" stroke="#ff2d55" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M40 40 L46 60" stroke="#ff2d55" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
            {/* D letter */}
            <text x="40" y="47" textAnchor="middle" fontFamily="serif" fontWeight="900" fontSize="18" fill="#00ff88">D</text>
          </svg>
          <h1 className="home__title">DOOMSDAY</h1>
          <p className="home__subtitle">Welcome back, {state.participant.name}</p>
          <p className="home__desc">
            You have collected <strong style={{ color: 'var(--doom-primary)' }}>{state.stones.length}/6 Infinity Stones</strong>.<br />
            {state.stones.length === 6
              ? 'The Final Boss awaits. Time to end this.'
              : 'The multiverse still needs saving.'}
          </p>
          <div className="home__stones-preview">
            {(['space','mind','reality','power','time','soul'] as Stone[]).map((s) => {
              const colors: Record<Stone,string> = {
                space:'var(--stone-space)', mind:'var(--stone-mind)',
                reality:'var(--stone-reality)', power:'var(--stone-power)',
                time:'var(--stone-time)', soul:'var(--stone-soul)'
              }
              const collected = state.stones.includes(s)
              return (
                <div
                  key={s}
                  className={`stone-dot stone-dot--collected ${collected ? '' : 'stone-dot--nav'}`}
                  style={{ '--stone-color': colors[s] } as CSSProperties}
                >
                  {collected ? '◆' : '◇'}
                </div>
              )
            })}
          </div>
          <button className="home__btn" onClick={() => navigate('/hub')}>
            RESUME THE MULTIVERSE →
          </button>
          <button className="home__btn home__btn--ghost" onClick={() => navigate('/hub')} style={{ marginTop: '0.5rem' }}>
            Return to Hub
          </button>
        </div>
      </main>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email address.')
      return
    }
    startGame(name.trim(), email.trim())
    navigate('/hub')
  }

  // Deterministic star positions
  const stars = Array.from({ length: 80 }, (_, i) => ({
    top: `${(i * 13.7) % 100}%`,
    left: `${(i * 7.3) % 100}%`,
    delay: `${(i * 0.13) % 5}s`,
    duration: `${2 + ((i * 0.7) % 4)}s`,
    size: `${2 + ((i * 0.3) % 3)}px`,
    opacity: 0.3 + ((i * 0.07) % 0.5),
  }))

  // Floating particles
  const particles = Array.from({ length: 24 }, (_, i) => ({
    top: `${(i * 11.1) % 100}%`,
    left: `${(i * 9.7) % 100}%`,
    delay: `${(i * 0.28) % 8}s`,
    duration: `${4 + ((i * 0.5) % 6)}s`,
  }))

  return (
    <main className="home">
      <div className="home__bg" aria-hidden="true">
        {/* Vortex portal rings */}
        <div className="home__portals">
          <div className="home__portal-ring" />
          <div className="home__portal-ring" />
          <div className="home__portal-ring" />
        </div>

        {/* Floating particles */}
        <div className="home__particles">
          {particles.map((p, i) => (
            <span
              key={i}
              className="home__particle"
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: 0.2 + ((i % 3) * 0.1),
              }}
            />
          ))}
        </div>

        {/* Stars */}
        <div className="home__stars" aria-hidden="true">
          {stars.map((s, i) => (
            <span
              key={i}
              className="home__star"
              style={{
                top: s.top,
                left: s.left,
                animationDelay: s.delay,
                animationDuration: s.duration,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
              }}
            />
          ))}
        </div>

        {/* Doom glow orbs */}
        <div className="home__orb home__orb--1" />
        <div className="home__orb home__orb--2" />
        <div className="home__orb home__orb--3" />

        {/* Cracked multiverse Earth SVG (subtle) */}
        <svg className="home__earth-bg" viewBox="0 0 600 600" aria-hidden="true">
          <defs>
            <radialGradient id="earth-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,204,102,0.08)" />
              <stop offset="60%" stopColor="rgba(0,204,102,0.03)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="280" fill="url(#earth-grad)" />
          {/* Crack paths from center */}
          <path d="M300 300 L300 120 M300 300 L440 180 M300 300 L480 340 M300 300 L420 480 M300 300 L300 490 M300 300 L160 480 M300 300 L120 300 M300 300 L160 160"
            stroke="rgba(255,45,85,0.04)" strokeWidth="1" fill="none" />
          <path d="M300 300 L340 220 M300 300 L420 300 M300 300 L300 420 M300 300 L260 300"
            stroke="rgba(0,229,255,0.04)" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      <div className="home__card">
        {/* Doctor Doom infinity stone icon */}
        <svg className="home__doom-icon" viewBox="0 0 80 80" aria-hidden="true" width="72" height="72">
          <defs>
            <radialGradient id="doom-stone-grad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#55ffaa" />
              <stop offset="40%" stopColor="#00cc66" />
              <stop offset="100%" stopColor="#004422" />
            </radialGradient>
          </defs>
          {/* Stone body */}
          <circle cx="40" cy="40" r="30" fill="url(#doom-stone-grad)" opacity="0.95" />
          {/* Inner glow */}
          <circle cx="40" cy="40" r="30" fill="none" stroke="#00ff88" strokeWidth="1.5" opacity="0.5" />
          {/* Highlight */}
          <ellipse cx="32" cy="32" rx="8" ry="6" fill="rgba(255,255,255,0.2)" transform="rotate(-30 32 32)" />
          {/* Cracks */}
          <path d="M28 22 L40 40 L34 55" stroke="#ff2d55" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M40 40 L52 28 L56 40" stroke="#ff2d55" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M40 40 L46 62" stroke="#ff2d55" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* DOOM letter */}
          <text x="40" y="47" textAnchor="middle" fontFamily="serif" fontWeight="900" fontSize="16" fill="#001a0d">D</text>
        </svg>

        <h1 className="home__title">DOOMSDAY</h1>
        <p className="home__subtitle">Avengers: Doomsday CTF</p>

        {/* Release badge */}
        <div className="home__release">
          <span className="home__release-dot" />
          BATTLEWORLD IS OPEN
        </div>

        <p className="home__desc">
          Three universes. Ten challenges. Six Infinity Stones.<br />
          Collect all stones to face <strong style={{ color: 'var(--error)' }}>Doctor Doom</strong> in the Final Boss.
        </p>

        <form onSubmit={handleSubmit} className="home__form" noValidate>
          <input
            type="text"
            placeholder="Agent Codename"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="home__input"
            autoComplete="name"
            required
          />
          <input
            type="email"
            placeholder="S.H.I.E.L.D. Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="home__input"
            autoComplete="email"
            required
          />
          {error && <p className="home__error">{error}</p>}
          <button type="submit" className="home__btn">
            ENTER THE MULTIVERSE →
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
          "I studied your heroes. I know their weaknesses." — Doctor Doom
        </p>
      </div>
    </main>
  )
}
