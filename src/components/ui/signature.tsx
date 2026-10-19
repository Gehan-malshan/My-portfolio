import { useId } from 'react'
import { motion } from 'motion/react'
import { gehanSignature } from '../../data/gehan-signature'

interface SignatureProps {
  color?: string
  duration?: number
  delay?: number
  stagger?: number
  className?: string
}

export function Signature({
  color = 'currentColor',
  duration = 0.75,
  delay = 0.1,
  stagger = 0.17,
  className = '',
}: SignatureProps) {
  const maskId = `signature-reveal-${useId().replace(/:/g, '')}`
  const { paths, width, height } = gehanSignature
  const variants = { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }
  const transition = (index: number) => ({
    pathLength: { delay: delay + index * stagger, duration, ease: 'easeInOut' as const },
    opacity: { delay: delay + index * stagger, duration: 0.01 },
  })

  return <motion.svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    className={`signature-svg ${className}`.trim()}
    fill="none"
    aria-hidden="true"
    initial="hidden"
    animate="visible"
  >
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse">
        {paths.map((path, index) => <motion.path
          key={index}
          d={path}
          stroke="white"
          strokeWidth={26}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={variants}
          transition={transition(index)}
        />)}
      </mask>
    </defs>
    {paths.map((path, index) => <motion.path
      key={index}
      d={path}
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
      transition={transition(index)}
    />)}
    <g mask={`url(#${maskId})`}>{paths.map((path, index) => <path key={index} d={path} fill={color}/>)}</g>
  </motion.svg>
}

export default Signature
