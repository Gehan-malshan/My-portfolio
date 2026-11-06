import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion, type Transition } from 'motion/react'
import './TrueFocus.css'

type FocusStyle = 'brackets' | 'box' | 'underline' | 'highlight'
type FocusRect = { x: number; y: number; width: number; height: number }
type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface TrueFocusProps {
  sentence?: string
  separator?: string
  manualMode?: boolean
  focusStyle?: FocusStyle
  order?: 'sequential' | 'random'
  easing?: 'smooth' | 'spring'
  blurAmount?: number
  focusScale?: number
  borderColor?: string
  highlightColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  cornerSize?: number
  borderWidth?: number
  unfocusedOpacity?: number
}

const corners: Corner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const frameGap = 10
const smoothEase = [0.65, 0, 0.35, 1] as const
const smoothCss = 'cubic-bezier(0.65, 0, 0.35, 1)'
const springCss = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function TrueFocus({
  sentence = 'True Focus', separator = ' ', manualMode = false,
  focusStyle = 'brackets', order = 'sequential', easing = 'smooth',
  blurAmount = 5, focusScale = 1, borderColor = '#ffffff',
  highlightColor, glowColor = 'transparent', animationDuration = 0.5,
  pauseBetweenAnimations = 1, cornerSize = 16, borderWidth = 3,
  unfocusedOpacity = 1,
}: TrueFocusProps) {
  const words = sentence.split(separator).filter(word => word.trim() !== '')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [focusRect, setFocusRect] = useState<FocusRect | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const reduceMotion = useReducedMotion()
  const duration = reduceMotion ? 0 : animationDuration
  const activeIndex = words.length ? currentIndex % words.length : -1
  const spring = easing === 'spring' && !reduceMotion
  const transition: Transition = spring
    ? { type: 'spring', visualDuration: duration, bounce: 0.38 }
    : { duration, ease: smoothEase }

  useEffect(() => {
    if (manualMode || reduceMotion || words.length < 2) return
    const interval = window.setInterval(() => {
      const roll = Math.random()
      setCurrentIndex(previous => {
        const current = previous % words.length
        if (order !== 'random') return (current + 1) % words.length
        const next = Math.floor(roll * (words.length - 1))
        return next >= current ? next + 1 : next
      })
    }, (animationDuration + pauseBetweenAnimations) * 1000)
    return () => window.clearInterval(interval)
  }, [manualMode, reduceMotion, animationDuration, pauseBetweenAnimations, words.length, order])

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current
    const word = wordRefs.current[activeIndex]
    if (!container || !word) return
    const measure = () => {
      const next = { x: word.offsetLeft, y: word.offsetTop, width: word.offsetWidth, height: word.offsetHeight }
      setFocusRect(previous => previous && previous.x === next.x && previous.y === next.y && previous.width === next.width && previous.height === next.height ? previous : next)
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    wordRefs.current.forEach(node => { if (node) observer.observe(node) })
    return () => observer.disconnect()
  }, [activeIndex, sentence, separator])

  const frame = focusRect && {
    x: focusRect.x - focusRect.width * (focusScale - 1) / 2,
    y: focusRect.y - focusRect.height * (focusScale - 1) / 2,
    width: focusRect.width * focusScale,
    height: focusRect.height * focusScale,
  }
  const positions = frame && {
    'top-left': { x: frame.x - frameGap, y: frame.y - frameGap },
    'top-right': { x: frame.x + frame.width + frameGap - cornerSize, y: frame.y - frameGap },
    'bottom-left': { x: frame.x - frameGap, y: frame.y + frame.height + frameGap - cornerSize },
    'bottom-right': { x: frame.x + frame.width + frameGap - cornerSize, y: frame.y + frame.height + frameGap - cornerSize },
  }
  const shapes = frame && {
    box: { x: frame.x - frameGap, y: frame.y - frameGap, width: frame.width + frameGap * 2, height: frame.height + frameGap * 2 },
    underline: { x: frame.x, y: frame.y + frame.height + frameGap * 0.4, width: frame.width, height: borderWidth },
    highlight: { x: frame.x - frame.height * 0.14, y: frame.y + frame.height * 0.04, width: frame.width + frame.height * 0.28, height: frame.height * 0.92 },
  }
  const frameStyle = {
    '--border-color': borderColor,
    '--highlight-color': `color-mix(in srgb, ${highlightColor ?? borderColor} 30%, transparent)`,
    '--glow-color': glowColor,
    '--corner-size': `${cornerSize}px`,
    '--border-width': `${borderWidth}px`,
  } as CSSProperties

  return <span className="focus-container" ref={containerRef} style={frameStyle}>
    {focusStyle === 'highlight' && shapes && <motion.span className="focus-highlight" aria-hidden="true" initial={{ ...shapes.highlight, opacity: 0 }} animate={{ ...shapes.highlight, opacity: 1 }} transition={transition}/>}
    {words.map((word, index) => {
      const isActive = index === activeIndex
      return <span
        key={`${word}-${index}`}
        ref={node => { wordRefs.current[index] = node }}
        className={`focus-word${manualMode ? ' manual' : ''}${isActive && !manualMode ? ' active' : ''}`}
        style={{
          filter: `blur(${isActive || reduceMotion ? 0 : blurAmount}px)`,
          opacity: isActive || reduceMotion ? 1 : unfocusedOpacity,
          transform: focusScale !== 1 ? `scale(${isActive ? focusScale : 1})` : undefined,
          transition: `filter ${duration}s ease, opacity ${duration}s ease, transform ${duration}s ${spring ? springCss : smoothCss}`,
        }}
        onMouseEnter={() => { if (manualMode) setCurrentIndex(index) }}
      >{word}</span>
    })}
    {!reduceMotion && shapes && positions && focusStyle !== 'highlight' && <span className="focus-frame" aria-hidden="true">
      {focusStyle === 'box' && <motion.span className="focus-box" initial={{ ...shapes.box, opacity: 0 }} animate={{ ...shapes.box, opacity: 1 }} transition={transition}/>}
      {focusStyle === 'underline' && <motion.span className="focus-underline" initial={{ ...shapes.underline, opacity: 0 }} animate={{ ...shapes.underline, opacity: 1 }} transition={transition}/>}
      {focusStyle === 'brackets' && corners.map(corner => <motion.span key={corner} className={`corner ${corner}`} initial={{ ...positions[corner], opacity: 0 }} animate={{ ...positions[corner], opacity: 1 }} transition={transition}/>)}
    </span>}
  </span>
}
