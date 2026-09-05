import { useState } from 'react'

interface Props {
  challengeId: string
}

export default function ForensicsViewer({ challengeId }: Props) {
  const [showHex, setShowHex] = useState(false)

  // Mock data based on challenge
  const challengeData: Record<string, { pixels: [number, number, number][] }> = {
    'dn-01': {
      pixels: [
        [0, 0, 0], [255, 0, 0], // visible red pixel
        [0, 255, 0], // hidden green pixel - clue
        [0, 0, 255],
      ],
    },
  }

  const data = challengeData[challengeId]

  return (
    <div className="forensics-viewer">
      <h3>Image Analysis</h3>
      <button className="forensics__btn" onClick={() => setShowHex(!showHex)}>
        {showHex ? 'Hide' : 'Show Pixel Data (Hex)'}
      </button>
      {showHex && data && (
        <pre className="forensics__hex">
{JSON.stringify(data.pixels, null, 2)}
        </pre>
      )}
    </div>
  )
}