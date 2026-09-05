import { type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import StoneCounter from '../components/StoneCounter'
import PageTransition from '../components/PageTransition'

// Universe SVG icons
function WebverseIcon() {
  return (
    <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke="var(--wv-primary)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="var(--wv-primary)" strokeWidth="1" opacity="0.3" />
      {/* Circuit nodes */}
      <circle cx="24" cy="4" r="2.5" fill="var(--wv-primary)" opacity="0.8" />
      <circle cx="24" cy="44" r="2.5" fill="var(--wv-primary)" opacity="0.8" />
      <circle cx="4" cy="24" r="2.5" fill="var(--wv-primary)" opacity="0.8" />
      <circle cx="44" cy="24" r="2.5" fill="var(--wv-primary)" opacity="0.8" />
      <circle cx="10" cy="10" r="2" fill="var(--wv-primary)" opacity="0.5" />
      <circle cx="38" cy="10" r="2" fill="var(--wv-primary)" opacity="0.5" />
      <circle cx="10" cy="38" r="2" fill="var(--wv-primary)" opacity="0.5" />
      <circle cx="38" cy="38" r="2" fill="var(--wv-primary)" opacity="0.5" />
      {/* Circuit lines */}
      <line x1="24" y1="6.5" x2="24" y2="18" stroke="var(--wv-primary)" strokeWidth="1" opacity="0.4" />
      <line x1="24" y1="30" x2="24" y2="41.5" stroke="var(--wv-primary)" strokeWidth="1" opacity="0.4" />
      <line x1="6.5" y1="24" x2="18" y2="24" stroke="var(--wv-primary)" strokeWidth="1" opacity="0.4" />
      <line x1="30" y1="24" x2="41.5" y2="24" stroke="var(--wv-primary)" strokeWidth="1" opacity="0.4" />
      {/* Center */}
      <circle cx="24" cy="24" r="5" fill="var(--wv-primary)" opacity="0.6" />
      <circle cx="24" cy="24" r="3" fill="var(--wv-primary)" opacity="0.9" />
    </svg>
  )
}

function OsintverseIcon() {
  return (
    <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke="var(--os-primary)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="var(--os-primary)" strokeWidth="1" opacity="0.3" />
      {/* Radar sweep */}
      <line x1="24" y1="24" x2="24" y2="4" stroke="var(--os-primary)" strokeWidth="1.5" opacity="0.6" />
      <path d="M24 24 L24 4 A20 20 0 0 1 43.3 34 Z" fill="var(--os-primary)" opacity="0.15" />
      {/* Crosshairs */}
      <line x1="24" y1="14" x2="24" y2="18" stroke="var(--os-primary)" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="30" x2="24" y2="34" stroke="var(--os-primary)" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="24" x2="18" y2="24" stroke="var(--os-primary)" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="24" x2="34" y2="24" stroke="var(--os-primary)" strokeWidth="1" opacity="0.5" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="3" fill="var(--os-primary)" opacity="0.8" />
    </svg>
  )
}

function DarknetIcon() {
  return (
    <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke="var(--dn-primary)" strokeWidth="1.5" opacity="0.5" />
      {/* Glitch squares */}
      <rect x="10" y="10" width="6" height="6" fill="var(--dn-primary)" opacity="0.3" />
      <rect x="32" y="10" width="6" height="6" fill="var(--dn-primary)" opacity="0.2" />
      <rect x="10" y="32" width="6" height="6" fill="var(--dn-primary)" opacity="0.2" />
      <rect x="32" y="32" width="6" height="6" fill="var(--dn-primary)" opacity="0.3" />
      {/* Network lines */}
      <line x1="24" y1="13" x2="13" y2="13" stroke="var(--dn-primary)" strokeWidth="1" opacity="0.3" />
      <line x1="24" y1="13" x2="35" y2="13" stroke="var(--dn-primary)" strokeWidth="1" opacity="0.3" />
      <line x1="24" y1="35" x2="13" y2="35" stroke="var(--dn-primary)" strokeWidth="1" opacity="0.3" />
      <line x1="24" y1="35" x2="35" y2="35" stroke="var(--dn-primary)" strokeWidth="1" opacity="0.3" />
      <line x1="13" y1="13" x2="13" y2="35" stroke="var(--dn-primary)" strokeWidth="1" opacity="0.3" />
      <line x1="35" y1="13" x2="35" y2="35" stroke="var(--dn-primary)" strokeWidth="1" opacity="0.3" />
      {/* Center */}
      <rect x="20" y="20" width="8" height="8" fill="var(--dn-primary)" opacity="0.7" />
      <rect x="22" y="22" width="4" height="4" fill="var(--dn-primary)" opacity="0.95" />
    </svg>
  )
}

export default function Hub() {
  const { state, isUniverseUnlocked } = useGame()
  const navigate = useNavigate()

  if (!state.participant) {
    navigate('/')
    return null
  }

  const universes = [
    {
      id: 'webverse' as const,
      name: 'WEBVERSE',
      icon: <WebverseIcon />,
      tagline: 'Reality: Compromised',
      desc: 'Navigate fractured web domains. Decode hidden portals. Hack the matrix before the universe collapses.',
      color: 'var(--wv-primary)',
      glow: 'var(--wv-glow)',
      challenges: '3 challenges · Web & Logic',
    },
    {
      id: 'osintverse' as const,
      name: 'OSINTVERSE',
      icon: <OsintverseIcon />,
      tagline: 'Intelligence: Sought',
      desc: 'Track signals across the multiverse. Every breadcrumb leads somewhere. Every trace tells a story.',
      color: 'var(--os-primary)',
      glow: 'var(--os-glow)',
      challenges: '3 challenges · Investigation & OSINT',
    },
    {
      id: 'darknet' as const,
      name: 'DARKNET',
      icon: <DarknetIcon />,
      tagline: 'Reality: Breached',
      desc: 'Forensics, crypto, stego, and exploitation. The darkest corridors of the multiverse await.',
      color: 'var(--dn-primary)',
      glow: 'var(--dn-glow)',
      challenges: '6 challenges · Exploitation & Forensics',
    },
  ]

  return (
    <PageTransition>
      <main className="hub">
        <header className="hub__header">
          {/* Doctor Doom subtitle */}
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--error)', letterSpacing: '0.15em', marginBottom: '0.5rem', opacity: 0.8 }}>
            BATTLEWORLD SECTOR 616 — CLASSIFIED
          </p>
          <h1>Choose Your Universe</h1>
          <div className="hub__subtitle">
            Agent {state.participant.name} &nbsp;·&nbsp;
            <StoneCounter collected={state.stones} compact /> &nbsp;·&nbsp;
            {state.stones.length}/6 Infinity Stones
          </div>
        </header>

        <div className="hub__grid">
          {universes.map((u, idx) => {
            const unlocked = isUniverseUnlocked(u.id)
            return (
              <button
                key={u.id}
                className={`universe-card universe-card--${u.id}`}
                onClick={() => unlocked && navigate(`/universe/${u.id}`)}
                disabled={!unlocked}
                style={{
                  animationDelay: `${idx * 0.12}s`,
                } as CSSProperties}
              >
                {/* Background glow */}
                <div className="universe-card__bg" />

                {/* Infinity stone dot */}
                <div className="universe-card__stone">
                  {unlocked ? '◆' : '◇'}
                </div>

                {/* Icon */}
                <div className="universe-card__icon">{u.icon}</div>

                {/* Name */}
                <h2 className="universe-card__name">{u.name}</h2>

                {/* Tagline */}
                <p style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--uc-color)', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>
                  {u.tagline}
                </p>

                {/* Description */}
                <p className="universe-card__desc">{u.desc}</p>

                <div className="universe-card__footer">
                  <span className="universe-card__meta">{unlocked ? u.challenges : 'ACCESS RESTRICTED'}</span>
                  <span className="universe-card__arrow">
                    {unlocked ? '→' : '🔒'}
                  </span>
                </div>

                {/* Locked overlay */}
                {!unlocked && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(4,4,8,0.6)', borderRadius: '16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '0.5rem', zIndex: 2,
                  }}>
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--text-dim)" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                      COMPLETE PREVIOUS UNIVERSE
                    </p>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Battleworld footer */}
        <p style={{
          textAlign: 'center', marginTop: '3rem', fontSize: '0.72rem',
          color: 'var(--text-dim)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', opacity: 0.5,
        }}>
          — DOCTOR DOOM'S BATTLEWORLD — MULTIVERSE SECTOR 616 — CTF CLASSIFICATION —
        </p>
      </main>
    </PageTransition>
  )
}
