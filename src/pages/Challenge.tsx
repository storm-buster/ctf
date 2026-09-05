import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import { challenges } from '../data/challenges'
import FlagInput from '../components/FlagInput'
import HintsPanel from '../components/HintsPanel'
import DecoderTool from '../components/DecoderTool'
import CluePanel from '../components/CluePanel'
import MetadataPanel from '../components/MetadataPanel'
import HexViewer from '../components/HexViewer'
import NarrativePanel from '../components/NarrativePanel'
import GlitchOverlay from '../components/GlitchOverlay'
import PageTransition from '../components/PageTransition'

// Mock pixel data per challenge
const PIXEL_DATA: Record<string, { pos: string; rgb: [number, number, number]; note?: string }[]> = {
  'dn-01': [
    { pos: '12,34',  rgb: [255, 0, 0],   note: 'anomalous' },
    { pos: '23,45',  rgb: [0, 255, 0],   note: 'anomalous' },
    { pos: '67,89',  rgb: [0, 0, 255],   note: 'anomalous' },
    { pos: '88,99',  rgb: [255, 255, 0], note: 'anomalous' },
  ],
  'os-03': [
    { pos: '0,0',    rgb: [0x44, 0x4F, 0x4F] },
    { pos: '0,1',    rgb: [0x4D, 0x7B, 0x70] },
    { pos: '1,0',    rgb: [0x34, 0x70, 0x65] },
    { pos: '1,1',    rgb: [0x72, 0x5F, 0x74] },
  ],
}

const UNIVERSE_COLOR: Record<string, string> = {
  webverse: 'var(--wv-primary)',
  osintverse: 'var(--os-primary)',
  darknet: 'var(--dn-primary)',
}

export default function Challenge() {
  const { challengeId } = useParams<{ challengeId: string }>()
  const navigate = useNavigate()
  const {
    getChallenge,
    solveChallenge,
    recordWrong,
    isChallengeUnlocked,
    state,
  } = useGame()

  const challenge = getChallenge(challengeId ?? '')
  const [wrong, setWrong] = useState(false)
  const [showGlitch, setShowGlitch] = useState(false)
  const [showAuthHeader, setShowAuthHeader] = useState(false)

  useEffect(() => {
    if (!challenge) {
      navigate('/hub')
      return
    }
    if (!isChallengeUnlocked(challenge.id)) {
      navigate(`/universe/${challenge.universe}`)
    }
  }, [challenge, navigate, isChallengeUnlocked])

  if (!challenge) return null

  const color = UNIVERSE_COLOR[challenge.universe]

  const handleCorrect = () => {
    solveChallenge(challenge.id)
    setTimeout(() => {
      // If this is the last challenge in a universe, return to hub to show new universe
      if (!challenge.nextChallengeId) {
        navigate('/hub')
      } else {
        navigate(`/universe/${challenge.universe}`)
      }
    }, 800)
  }

  const handleWrong = () => {
    setWrong(true)
    recordWrong(challenge.id, challenge.portalType)
    setShowGlitch(true)
    setTimeout(() => {
      navigate(`/portal/${challenge.id}?type=${challenge.portalType}`)
    }, 700)
  }

  const pixels = PIXEL_DATA[challenge.id]

  return (
    <PageTransition>
      <main
        className={`challenge ${wrong ? 'challenge--shake' : ''}`}
        style={{ ['--ch-color' as any]: color } as any}
      >
        <GlitchOverlay visible={showGlitch} />

        <button
          className="challenge__back"
          onClick={() => navigate(`/universe/${challenge.universe}`)}
        >
          ← Back to {challenge.universe.toUpperCase()}
        </button>

        <div className="challenge__panel">
          <div className="challenge__meta">
            <span className="challenge__id">{challenge.id.toUpperCase()}</span>
            <span className="challenge__stone" style={{ color }}>
              ◆ {challenge.stone.toUpperCase()} STONE
            </span>
            <span className="challenge__id" style={{ marginLeft: 'auto' }}>
              {challenge.points} PTS
            </span>
          </div>

          <h1 className="challenge__title">{challenge.title}</h1>
          <p className="challenge__narrative">{challenge.narrative}</p>

          <NarrativePanel label="BRIEFING">{challenge.description}</NarrativePanel>

          {/* Clue content panel */}
          {challenge.clueContent && (
            <CluePanel
              label={challenge.clueContent.label}
              body={challenge.clueContent.body}
              format={challenge.clueContent.format}
              color={color}
            />
          )}

          {/* Special: Auth Matrix header reveal */}
          {challenge.id === 'wv-03' && (
            <>
              <button className="challenge__auth-btn" onClick={() => setShowAuthHeader(true)}>
                🔍 Check Response Headers
              </button>
              {showAuthHeader && (
                <MetadataPanel
                  headers={{
                    'Content-Type': 'application/json',
                    'X-Auth-Token': 'bG9va19zZWNyZXQ=',
                    'Server': 'Multiverse-Gateway/2.0',
                    'WWW-Authenticate': 'Bearer realm="multiverse"',
                  }}
                />
              )}
            </>
          )}

          {/* Forensics: pixel viewer */}
          {pixels && <HexViewer pixels={pixels} title="PIXEL ANALYSIS" />}

          {/* Decoder type: built-in tool */}
          {challenge.type === 'decoder' && <DecoderTool />}

          {wrong && (
            <p className="challenge__wrong-msg">⚠ ACCESS DENIED — INITIATING PORTAL...</p>
          )}

          <HintsPanel challengeId={challenge.id} hints={challenge.hints} />

          <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--text-dim)', marginTop: '1.5rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Submit Flag
          </h3>
          <FlagInput
            flag={challenge.flag}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            color={color}
          />
        </div>
      </main>
    </PageTransition>
  )
}
