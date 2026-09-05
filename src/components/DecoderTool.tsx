import { useState } from 'react'

type Mode = 'hex2bin' | 'bin2b64' | 'b642txt' | 'caesar' | 'rot13'

export default function DecoderTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('hex2bin')
  const [error, setError] = useState('')

  const process = () => {
    setError('')
    try {
      let result = ''
      switch (mode) {
        case 'hex2bin': {
          const clean = input.replace(/\s|0x/g, '')
          if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error('Invalid hex')
          const padded = clean.length % 2 ? '0' + clean : clean
          result = padded
            .match(/.{2}/g)!
            .map((b) => parseInt(b, 16).toString(2).padStart(8, '0'))
            .join(' ')
          break
        }
        case 'bin2b64': {
          const clean = input.replace(/\s/g, '')
          if (!/^[01]+$/.test(clean)) throw new Error('Invalid binary')
          const padded = clean.padEnd(Math.ceil(clean.length / 8) * 8, '0')
          const bytes = padded
            .match(/.{8}/g)!
            .map((b) => String.fromCharCode(parseInt(b, 2)))
            .join('')
          result = btoa(bytes)
          break
        }
        case 'b642txt': {
          result = atob(input)
          break
        }
        case 'caesar': {
          const shift = 13
          result = input.replace(/[a-zA-Z]/g, (c) => {
            const code = c.charCodeAt(0)
            const base = code <= 90 ? 65 : 97
            return String.fromCharCode(((code - base + shift) % 26) + base)
          })
          break
        }
        case 'rot13': {
          result = input.replace(/[a-zA-Z]/g, (c) => {
            const code = c.charCodeAt(0)
            const base = code <= 90 ? 90 : 122
            return String.fromCharCode((code + 13 > base ? code - 13 : code + 13))
          })
          break
        }
      }
      setOutput(result)
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  return (
    <div className="decoder-tool">
      <h3>Decoder Tool</h3>
      <div className="decoder-tool__body">
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="decoder__mode">
          <option value="hex2bin">Hex → Binary</option>
          <option value="bin2b64">Binary → Base64</option>
          <option value="b642txt">Base64 → Text</option>
          <option value="caesar">Caesar (shift 13)</option>
          <option value="rot13">ROT13</option>
        </select>
        <div className="decoder__io">
          <label>INPUT</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your encoded text here..."
            className="decoder__input"
          />
        </div>
        <button onClick={process} className="decoder__btn">→ Decode</button>
        {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{error}</div>}
        {output && (
          <div className="decoder__io">
            <label>OUTPUT</label>
            <textarea value={output} readOnly className="decoder__output" />
          </div>
        )}
      </div>
    </div>
  )
}
