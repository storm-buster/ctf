interface Props {
  headers: Record<string, string>
  title?: string
}

export default function MetadataPanel({ headers, title = 'RESPONSE HEADERS' }: Props) {
  return (
    <div className="metadata-panel">
      <h4>{title}</h4>
      {Object.entries(headers).map(([k, v]) => (
        <div key={k} className="metadata-row">
          <span className="metadata-key">{k}:</span>
          <span className="metadata-val">{v}</span>
        </div>
      ))}
    </div>
  )
}
