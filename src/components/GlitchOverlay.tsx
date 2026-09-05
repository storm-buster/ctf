interface Props {
  visible: boolean
}

export default function GlitchOverlay({ visible }: Props) {
  if (!visible) return null
  return <div className="glitch-overlay" aria-hidden="true" />
}
