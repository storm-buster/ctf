import { useParams, useNavigate } from 'react-router-dom'
import type { CSSProperties, ReactElement } from 'react'
import { useGame } from '../contexts/GameContext'
import { challenges } from '../data/challenges'
import type { Universe } from '../data/challenges'
import StoneCounter from '../components/StoneCounter'
import PageTransition from '../components/PageTransition'

// Hero SVG illustrations per universe
function WebverseHero() {
  return (
    <svg viewBox="0 0 200 80" className="universe__hero-illustration" aria-hidden="true">
      <defs>
        <linearGradient id="wv-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--wv-primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--wv-primary)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--wv-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Circuit board lines */}
      <line x1="0" y1="20" x2="200" y2="20" stroke="url(#wv-line)" strokeWidth="1" />
      <line x1="0" y1="40" x2="200" y2="40" stroke="url(#wv-line)" strokeWidth="1" />
      <line x1="0" y1="60" x2="200" y2="60" stroke="url(#wv-line)" strokeWidth="1" />
      {/* Nodes */}
      <circle cx="30" cy="20" r="3" fill="var(--wv-primary)" opacity="0.8" />
      <circle cx="80" cy="20" r="3" fill="var(--wv-primary)" opacity="0.6" />
      <circle cx="150" cy="20" r="3" fill="var(--wv-primary)" opacity="0.6" />
      <circle cx="60" cy="40" r="3" fill="var(--wv-primary)" opacity="0.7" />
      <circle cx="120" cy="40" r="3" fill="var(--wv-primary)" opacity="0.7" />
      <circle cx="40" cy="60" r="3" fill="var(--wv-primary)" opacity="0.5" />
      <circle cx="100" cy="60" r="3" fill="var(--wv-primary)" opacity="0.6" />
      <circle cx="170" cy="60" r="3" fill="var(--wv-primary)" opacity="0.5" />
      {/* Vertical connectors */}
      <line x1="30" y1="20" x2="30" y2="40" stroke="var(--wv-primary)" strokeWidth="0.5" opacity="0.3" />
      <line x1="80" y1="20" x2="80" y2="60" stroke="var(--wv-primary)" strokeWidth="0.5" opacity="0.3" />
      <line x1="150" y1="20" x2="150" y2="40" stroke="var(--wv-primary)" strokeWidth="0.5" opacity="0.3" />
      <line x1="60" y1="40" x2="60" y2="60" stroke="var(--wv-primary)" strokeWidth="0.5" opacity="0.3" />
      <line x1="120" y1="40" x2="120" y2="60" stroke="var(--wv-primary)" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

function OsintverseHero() {
  return (
    <svg viewBox="0 0 200 80" className="universe__hero-illustration" aria-hidden="true">
      <defs>
        <radialGradient id="os-radar" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--os-primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--os-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Radar circles */}
      <circle cx="100" cy="40" r="32" fill="url(#os-radar)" />
      <circle cx="100" cy="40" r="32" fill="none" stroke="var(--os-primary)" strokeWidth="0.5" opacity="0.5" />
      <circle cx="100" cy="40" r="22" fill="none" stroke="var(--os-primary)" strokeWidth="0.5" opacity="0.4" />
      <circle cx="100" cy="40" r="12" fill="none" stroke="var(--os-primary)" strokeWidth="0.5" opacity="0.3" />
      {/* Crosshairs */}
      <line x1="68" y1="40" x2="132" y2="40" stroke="var(--os-primary)" strokeWidth="0.5" opacity="0.4" />
      <line x1="100" y1="8" x2="100" y2="72" stroke="var(--os-primary)" strokeWidth="0.5" opacity="0.4" />
      {/* Blips */}
      <circle cx="115" cy="28" r="2" fill="var(--os-primary)" opacity="0.9" />
      <circle cx="85" cy="50" r="1.5" fill="var(--os-primary)" opacity="0.7" />
      <circle cx="105" cy="55" r="1.5" fill="var(--os-primary)" opacity="0.6" />
      {/* Sweep line */}
      <line x1="100" y1="40" x2="120" y2="20" stroke="var(--os-primary)" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

function DarknetHero() {
  return (
    <svg viewBox="0 0 200 80" className="universe__hero-illustration" aria-hidden="true">
      {/* Glitch pattern */}
      <rect x="10" y="20" width="20" height="4" fill="var(--dn-primary)" opacity="0.6" />
      <rect x="40" y="20" width="40" height="4" fill="var(--dn-primary)" opacity="0.4" />
      <rect x="90" y="20" width="30" height="4" fill="var(--dn-primary)" opacity="0.5" />
      <rect x="130" y="20" width="20" height="4" fill="var(--dn-primary)" opacity="0.7" />
      <rect x="160" y="20" width="30" height="4" fill="var(--dn-primary)" opacity="0.3" />
      <rect x="20" y="32" width="30" height="4" fill="var(--dn-primary)" opacity="0.4" />
      <rect x="60" y="32" width="20" height="4" fill="var(--dn-primary)" opacity="0.6" />
      <rect x="90" y="32" width="50" height="4" fill="var(--dn-primary)" opacity="0.5" />
      <rect x="150" y="32" width="20" height="4" fill="var(--dn-primary)" opacity="0.7" />
      <rect x="10" y="44" width="40" height="4" fill="var(--dn-primary)" opacity="0.5" />
      <rect x="60" y="44" width="30" height="4" fill="var(--dn-primary)" opacity="0.3" />
      <rect x="100" y="44" width="20" height="4" fill="var(--dn-primary)" opacity="0.6" />
      <rect x="130" y="44" width="40" height="4" fill="var(--dn-primary)" opacity="0.5" />
      <rect x="180" y="44" width="10" height="4" fill="var(--dn-primary)" opacity="0.4" />
      {/* Glitch blocks */}
      <rect x="0" y="60" width="60" height="6" fill="var(--dn-primary)" opacity="0.15" />
      <rect x="70" y="60" width="80" height="6" fill="var(--dn-primary)" opacity="0.1" />
      <rect x="160" y="60" width="40" height="6" fill="var(--dn-primary)" opacity="0.15" />
      {/* Scan line */}
      <line x1="0" y1="56" x2="200" y2="56" stroke="var(--dn-primary)" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

const UNIVERSE_META: Record<Universe, {
  name: string
  icon: string
  color: string
  glow: string
  bg: string
  desc: string
  tagline: string
  challengeIds: string[]
  Hero: () => ReactElement
}> = {
  webverse: {
    name: 'WEBVERSE',
    icon: '🌐',
    color: 'var(--wv-primary)',
    glow: 'var(--wv-glow)',
    bg: 'var(--wv-bg)',
    desc: 'Navigate broken portals. Decode the matrix. Break through.',
    tagline: 'The web is fractured. The code is broken. The reality is corrupted.',
    challengeIds: ['wv-01', 'wv-02', 'wv-03'],
    Hero: WebverseHero,
  },
  osintverse: {
    name: 'OSINTVERSE',
    icon: '🔍',
    color: 'var(--os-primary)',
    glow: 'var(--os-glow)',
    bg: 'var(--os-bg)',
    desc: 'Trace the breadcrumbs. Every signal leaves a trace.',
    tagline: 'Intelligence was never meant to be found. But you found it.',
    challengeIds: ['os-01', 'os-02', 'os-03'],
    Hero: OsintverseHero,
  },
  darknet: {
    name: 'DARKNET',
    icon: '🕸️',
    color: 'var(--dn-primary)',
    glow: 'var(--dn-glow)',
    bg: 'var(--dn-bg)',
    desc: 'The darkest corner of the multiverse. Dig deep.',
    tagline: 'The multiverse bleeds. Forensics, crypto, and exploitation ahead.',
    challengeIds: ['dn-01', 'dn-02', 'dn-03', 'dn-04', 'dn-05', 'dn-06'],
    Hero: DarknetHero,
  },
}

export default function Universe() {
  const { universeId } = useParams<{ universeId: string }>()
  const navigate = useNavigate()
  const { state, getProgress, isChallengeUnlocked, isChallengeSolved } = useGame()

  const universe = universeId as Universe
  const meta = UNIVERSE_META[universe]
  if (!meta) {
    navigate('/hub')
    return null
  }

  const univChallenges = meta.challengeIds
    .map((id) => challenges.find((c) => c.id === id))
    .filter(Boolean)

  const solvedCount = univChallenges.filter(
    (ch) => ch && isChallengeSolved(ch.id)
  ).length
  const progress = Math.round((solvedCount / meta.challengeIds.length) * 100)

  const getStatus = (chId: string) => {
    if (isChallengeSolved(chId)) return 'solved'
    if (isChallengeUnlocked(chId)) return 'current'
    return 'locked'
  }

  return (
    <PageTransition>
      <main
        className="universe"
        style={{
          ['--univ-color' as any]: meta.color,
          ['--univ-glow' as any]: meta.glow,
          ['--univ-border' as any]: meta.color,
        } as any}
      >
        <button
          className="challenge__back"
          onClick={() => navigate('/hub')}
          style={{ display: 'inline-flex', marginBottom: '1.5rem' }}
        >
          ← Back to Hub
        </button>

        {/* Hero Banner */}
        <div className="universe__hero">
          {/* Cracked multiverse overlay */}
          <div className="universe__hero-crack" aria-hidden="true">
            <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
              <path d="M0 50 L 200 80 L 280 150 L 400 130 L 520 200 L 650 180 L 800 220"
                stroke="var(--univ-color)" strokeWidth="1" fill="none" opacity="0.4" />
              <path d="M100 0 L 200 80 L 180 200 L 300 280" stroke="var(--univ-color)" strokeWidth="0.8" fill="none" opacity="0.3" />
              <path d="M400 0 L 500 100 L 480 200 L 600 300" stroke="var(--univ-color)" strokeWidth="0.8" fill="none" opacity="0.3" />
            </svg>
          </div>

          {/* Hero illustration */}
          <div className="universe__hero-illustration-wrap">
            <meta.Hero />
          </div>

          <div
            className="universe__hero-icon"
            style={{ color: meta.color, textShadow: `0 0 30px ${meta.glow}` }}
          >
            {meta.icon}
          </div>
          <h1 style={{ color: meta.color, textShadow: `0 0 30px ${meta.glow}` }}>
            {meta.name}
          </h1>
          <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '0 auto' }}>
            {meta.tagline}
          </p>
          <div className="universe__hero-bar">
            <div
              className="universe__hero-bar-fill"
              style={{ width: `${progress}%` } as CSSProperties}
            />
          </div>
          <p className="universe__hero-progress-text">
            {solvedCount}/{meta.challengeIds.length} challenges complete • {progress}%
          </p>
        </div>

        {/* Challenge Timeline */}
        <div className="timeline">
          {univChallenges.map((ch, idx) => {
            if (!ch) return null
            const status = getStatus(ch.id)
            const challengeProgress = getProgress(ch.id)
            return (
              <div key={ch.id} className={`timeline-item timeline-item--${status}`} style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="timeline-item__connector" />
                <button
                  className={`challenge-card ${status === 'locked' ? 'challenge-card--locked' : ''}`}
                  style={{ ['--ch-color' as any]: meta.color } as any}
                  onClick={() => {
                    if (status !== 'locked') {
                      navigate(`/challenge/${ch.id}`)
                    }
                  }}
                >
                  {status === 'locked' && (
                    <div className="challenge-card__lock">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  )}
                  {status === 'solved' && (
                    <div className="challenge-card__lock" style={{ color: 'var(--success)' }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  )}
                  <div className="challenge-card__header">
                    <span className="challenge-card__id">{ch.id.toUpperCase()}</span>
                    <span className="challenge-card__pts">{ch.points} pts</span>
                  </div>
                  <h3 className="challenge-card__title">{ch.title}</h3>
                  <p className="challenge-card__desc">{ch.description}</p>
                  <div className="challenge-card__footer">
                    <span className="challenge-card__cat">{ch.category.toUpperCase()}</span>
                    {status === 'solved' && (
                      <span className="challenge-card__status challenge-card__status--solved">✓ SOLVED</span>
                    )}
                    {status === 'current' && (
                      <span className="challenge-card__status challenge-card__status--unsolved">→ ACTIVE</span>
                    )}
                    {status === 'locked' && (
                      <span className="challenge-card__status challenge-card__status--locked">🔒 LOCKED</span>
                    )}
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Stone progress */}
        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.12em', marginBottom: '1rem' }}>
            INFINITY STONE PROGRESS
          </p>
          <StoneCounter collected={state.stones} />
        </div>
      </main>
    </PageTransition>
  )
}
