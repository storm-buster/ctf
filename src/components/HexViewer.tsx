interface Props {
  pixels: { pos: string; rgb: [number, number, number]; note?: string }[]
  title?: string
}

export default function HexViewer({ pixels, title = 'PIXEL DATA' }: Props) {
  return (
    <div className="hex-viewer">
      <div className="hex-viewer__header">
        <span className="hex-viewer__title">{title}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{pixels.length} entries</span>
      </div>
      <div>
        {pixels.map((p, i) => (
          <div key={i} className="hex-viewer__pixel">
            <div
              className="hex-viewer__swatch"
              style={{ background: `rgb(${p.rgb.join(',')})` }}
            />
            <span className="hex-viewer__rgb">
              [{p.pos}] rgb({p.rgb.join(', ')})
            </span>
            <span className="hex-viewer__hex">
              #{p.rgb.map((c) => c.toString(16).padStart(2, '0').toUpperCase()).join('')}
            </span>
            {p.note && <span style={{ color: 'var(--warning)', fontSize: '0.78rem' }}>← {p.note}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
