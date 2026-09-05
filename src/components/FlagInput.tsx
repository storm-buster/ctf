import { useState, type FormEvent } from 'react'

interface Props {
  flag: string
  onCorrect: () => void
  onWrong: () => void
  color?: string
  glow?: string
}

export default function FlagInput({ flag, onCorrect, onWrong, color, glow }: Props) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setStatus('checking')
    setTimeout(() => {
      if (input.trim().toUpperCase() === flag.toUpperCase()) {
        setStatus('success')
        setTimeout(onCorrect, 600)
      } else {
        setStatus('error')
        onWrong()
      }
    }, 300)
  }

  return (
    <form
      className={`flag-input flag-input--${status}`}
      onSubmit={handleSubmit}
      style={{
        ['--ch-color' as any]: color || 'var(--wv-primary)',
        ['--ch-glow' as any]: glow || 'var(--wv-glow)',
      }}
    >
      <input
        type="text"
        placeholder="DOOM{...}"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={status === 'checking' || status === 'success'}
        className="flag-input__field"
        autoComplete="off"
        spellCheck={false}
      />
      <button
        type="submit"
        disabled={status === 'checking' || status === 'success'}
        className="flag-input__btn"
      >
        {status === 'checking' ? 'VERIFYING...' : status === 'success' ? '✓ ACCEPTED' : 'SUBMIT FLAG'}
      </button>
      {status === 'error' && <p className="flag-input__error">✗ Invalid flag</p>}
      {status === 'success' && <p className="flag-input__success">✓ Flag accepted — returning...</p>}
    </form>
  )
}
