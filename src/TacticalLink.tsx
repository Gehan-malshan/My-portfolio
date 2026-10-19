import { useEffect, useRef, useState } from 'react'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

type TacticalLinkProps = {
  href: string
  label: string
  download?: boolean
  ariaLabel?: string
}

export default function TacticalLink({ href, label, download, ariaLabel }: TacticalLinkProps) {
  const [visibleLabel, setVisibleLabel] = useState(label)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearInterval(timer.current), [])

  const stopScramble = () => {
    window.clearInterval(timer.current)
    setVisibleLabel(label)
  }

  const startScramble = () => {
    window.clearInterval(timer.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let revealed = 0
    timer.current = window.setInterval(() => {
      revealed += 1
      setVisibleLabel(label.split('').map((letter, index) => {
        if (letter === ' ' || index < revealed) return letter
        return characters[Math.floor(Math.random() * characters.length)]
      }).join(''))
      if (revealed >= label.length) window.clearInterval(timer.current)
    }, 35)
  }

  return <a className="tactical-button" href={href} download={download} aria-label={ariaLabel ?? label} onMouseEnter={startScramble} onMouseLeave={stopScramble} onFocus={startScramble} onBlur={stopScramble}>
    <span className="tactical-corner tactical-corner-tl" aria-hidden="true"/>
    <span className="tactical-corner tactical-corner-tr" aria-hidden="true"/>
    <span className="tactical-corner tactical-corner-bl" aria-hidden="true"/>
    <span className="tactical-corner tactical-corner-br" aria-hidden="true"/>
    <span className="tactical-label" aria-hidden="true">{visibleLabel}</span>
  </a>
}
