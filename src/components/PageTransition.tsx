import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function PageTransition({ children, className = '' }: Props) {
  return <div className={`page-enter ${className}`}>{children}</div>
}
