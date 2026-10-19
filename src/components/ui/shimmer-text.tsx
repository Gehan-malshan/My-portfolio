import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './shimmer-text.css'

export interface ShimmerTextProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  spread?: number
}

export function ShimmerText({
  children,
  className,
  duration = 2.4,
  delay = 0,
  spread = 200,
}: ShimmerTextProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.span
      className={['shimmer-text', className].filter(Boolean).join(' ')}
      style={{ backgroundSize: `${Math.max(160, spread)}% 100%` }}
      initial={reducedMotion ? false : { backgroundPositionX: '100%' }}
      animate={reducedMotion ? undefined : { backgroundPositionX: ['100%', '0%'] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 0,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  )
}

export default ShimmerText
