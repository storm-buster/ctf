import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import StoneCounter from './StoneCounter'

export default function Nav() {
  const { state, resetGame } = useGame()
  const navigate = useNavigate()

  if (!state.participant) return null

  return (
    <nav className="nav">
      <div className="nav__logo" onClick={() => navigate('/hub')} style={{ cursor: 'pointer' }}>
        DOOM<span>·</span>DAY
      </div>
      <div className="nav__meta">
        <span className="nav__participant">{state.participant.name}</span>
        <StoneCounter collected={state.stones} compact />
        <button
          className="nav__back"
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) {
              resetGame()
              navigate('/')
            }
          }}
        >
          Reset
        </button>
      </div>
    </nav>
  )
}
