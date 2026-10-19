import { useEffect, useRef, useState } from 'react'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

type TacticalLinkProps = {
  href?: string
  label: string
  download?: boolean
  ariaLabel?: string
  onClick?: () => void
}

export default function TacticalLink({ href, label, download, ariaLabel, onClick }: TacticalLinkProps) {
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

  const content = <>
    <span className="tactical-corner tactical-corner-tl" aria-hidden="true"/>
    <span className="tactical-corner tactical-corner-tr" aria-hidden="true"/>
    <span className="tactical-corner tactical-corner-bl" aria-hidden="true"/>
    <span className="tactical-corner tactical-corner-br" aria-hidden="true"/>
    <span className="tactical-label" aria-hidden="true">{visibleLabel}</span>
  </>
  const interactions = { onMouseEnter: startScramble, onMouseLeave: stopScramble, onFocus: startScramble, onBlur: stopScramble }
  return href
    ? <a className="tactical-button" href={href} download={download} aria-label={ariaLabel ?? label} {...interactions}>{content}</a>
    : <button className="tactical-button" type="button" aria-label={ariaLabel ?? label} onClick={onClick} {...interactions}>{content}</button>
}
