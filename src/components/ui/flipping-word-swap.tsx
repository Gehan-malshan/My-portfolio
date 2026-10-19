import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import './flipping-word-swap.css'

const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null

function characters(text: string) {
  return segmenter
    ? Array.from(segmenter.segment(text), ({ segment }) => segment)
    : Array.from(text)
}

export interface FlippingWordSwapProps {
  word1: string
  word2?: string
  duration?: number
  stagger?: number
  className?: string
  toClassName?: string
  style?: CSSProperties
  toStyle?: CSSProperties
}

export function FlippingWordSwap({
  word1,
  word2 = word1,
  duration = 400,
  stagger = 44,
  className = '',
  toClassName = '',
  style,
  toStyle,
}: FlippingWordSwapProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const swappedRef = useRef(false)
  const [isSwapped, setIsSwapped] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resolvedDuration = reducedMotion ? 0 : Math.max(180, duration) / 1000
    const resolvedStagger = reducedMotion ? 0 : Math.max(0, stagger) / 1000

    const context = gsap.context(() => {
      const first = gsap.utils.toArray<HTMLElement>('[data-flip-word="first"]')
      const second = gsap.utils.toArray<HTMLElement>('[data-flip-word="second"]')
      gsap.set(first, { rotationX: 0, opacity: 1, transformOrigin: 'center top' })
      gsap.set(second, { rotationX: -82, opacity: 0, transformOrigin: 'center bottom' })
      const timeline = gsap.timeline({ paused: true })
        .to(first, { rotationX: 82, opacity: 0, duration: resolvedDuration, stagger: resolvedStagger, ease: 'power2.in' })
        .to(second, { rotationX: 0, opacity: 1, duration: resolvedDuration, stagger: resolvedStagger, ease: 'power2.out' }, `<${resolvedDuration * 0.62}`)
      if (swappedRef.current) timeline.progress(1)
      timelineRef.current = timeline
    }, buttonRef)

    return () => {
      timelineRef.current = null
      context.revert()
    }
  }, [duration, stagger, word1, word2])

  const updateSwap = useCallback((next: boolean) => {
    if (swappedRef.current === next) return
    swappedRef.current = next
    setIsSwapped(next)
    if (next) timelineRef.current?.play()
    else timelineRef.current?.reverse()
  }, [])

  const renderCharacters = (text: string, layer: 'first' | 'second') =>
    text.split(/(\s+)/).map((part, wordIndex) => /^\s+$/.test(part)
      ? <span className="flip-heading-space" key={`${layer}-space-${wordIndex}`}>{part}</span>
      : <span className="flip-heading-word" key={`${layer}-word-${wordIndex}`}>
          {characters(part).map((character, index) =>
            <span className="flip-heading-character" data-flip-word={layer} key={`${layer}-${wordIndex}-${index}-${character}`}>{character}</span>)}
        </span>)

  return <button
    ref={buttonRef}
    type="button"
    className={`flip-heading ${className}`.trim()}
    style={style}
    aria-label={isSwapped ? word2 : word1}
    aria-pressed={isSwapped}
    onMouseEnter={() => updateSwap(true)}
    onMouseLeave={() => updateSwap(false)}
    onPointerUp={event => { if (event.pointerType !== 'mouse') updateSwap(!swappedRef.current) }}
    onFocus={event => { if (event.currentTarget.matches(':focus-visible')) updateSwap(true) }}
    onBlur={() => updateSwap(false)}
  >
    <span className="flip-heading-stack">
      <span className="flip-heading-layer" aria-hidden="true">{renderCharacters(word1, 'first')}</span>
      <span className={`flip-heading-layer ${toClassName}`.trim()} aria-hidden="true" style={toStyle}>{renderCharacters(word2, 'second')}</span>
    </span>
  </button>
}

export default FlippingWordSwap
