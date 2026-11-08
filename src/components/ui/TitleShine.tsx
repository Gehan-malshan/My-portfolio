import type { ReactNode } from 'react'
import ShinyText from './ShinyText'

export default function TitleShine({ children, className }: { children: ReactNode; className?: string }) {
  return <ShinyText
    className={className}
    color="#b9b9b9"
    shineColor="#ffffff"
    speed={2.8}
    delay={1.4}
    shineWidth={32}
    softness={0.62}
    bands={2}
  >{children}</ShinyText>
}
