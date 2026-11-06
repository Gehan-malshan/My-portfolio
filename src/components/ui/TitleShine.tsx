import type { ReactNode } from 'react'
import ShinyText from './ShinyText'

export default function TitleShine({ children, className }: { children: ReactNode; className?: string }) {
  return <ShinyText
    className={className}
    color="#c8c8c8"
    shineColor="#ffffff"
    speed={2.8}
    delay={1.4}
    shineWidth={28}
    softness={0.72}
    bands={2}
  >{children}</ShinyText>
}
