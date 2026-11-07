import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import VolunteerGalleryStack from './VolunteerGalleryStack'
import './VolunteeringMilestones.css'

type Milestone = {
  category: string
  role: string
  organization: string
  period: string
  description: string
  gallery?: readonly { src: string; alt: string }[]
}

function MilestoneArtwork({ variant }: { variant: number }) {
  const grid = Array.from({ length: 9 }, (_, index) => index * 100)

  return <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="800" height="600" fill="#0e0e0e"/>
    <g stroke="#fff" strokeWidth="1" opacity=".075">
      {grid.map(value => <path key={`v${value}`} d={`M${value} 0V600`}/>)}
      {grid.map(value => <path key={`h${value}`} d={`M0 ${value}H800`}/>)}
    </g>
    {variant === 0 && <g fill="none" stroke="#eaeaea">
      <circle cx="400" cy="300" r="178" strokeWidth="1.5" opacity=".55"/>
      <circle cx="400" cy="300" r="120" strokeWidth="1" opacity=".28"/>
      <path d="M240 372 349 240 468 292 592 178M208 232 349 240 400 300 528 420 634 360" strokeWidth="2" opacity=".8"/>
      {[[240,372],[349,240],[468,292],[592,178],[208,232],[400,300],[528,420],[634,360]].map(([x,y],index)=><circle key={index} cx={x} cy={y} r={index===5?11:6} fill="#eee" stroke="none"/>)}
    </g>}
    {variant === 1 && <g fill="none" stroke="#ededed" strokeLinecap="round">
      <circle cx="400" cy="300" r="185" opacity=".28"/>
      <circle cx="400" cy="300" r="125" opacity=".4"/>
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((index)=><path key={index} d={`M${165+index*34} ${300-(index%4+1)*20}v${(index%4+1)*40}`} strokeWidth={index===7?11:5} opacity={index===7?1:.7}/>)}
    </g>}
    {variant === 2 && <g fill="none" stroke="#ededed" strokeWidth="2">
      <circle cx="400" cy="300" r="15" fill="#ededed"/>
      <circle cx="400" cy="300" r="82" opacity=".65"/>
      <circle cx="400" cy="300" r="158" opacity=".38"/>
      <circle cx="400" cy="300" r="228" opacity=".18"/>
      <path d="M400 300 212 174M400 300 601 215M400 300 540 456M400 300 247 427" opacity=".75"/>
      {[[212,174],[601,215],[540,456],[247,427]].map(([x,y],index)=><circle key={index} cx={x} cy={y} r="9" fill="#eee"/>)}
    </g>}
    {variant === 3 && <g fill="none" stroke="#ededed" strokeWidth="2">
      <path d="M400 96 582 199v202L400 504 218 401V199Z" opacity=".55"/>
      <path d="M400 158 530 229v142l-130 71-130-71V229Z" opacity=".35"/>
      <path d="m345 235-65 65 65 65m110-130 65 65-65 65m-25-150-60 170" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </g>}
  </svg>
}

export default function VolunteeringMilestones({ items }: { items: readonly Milestone[] }) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [progressHeight, setProgressHeight] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const media = mediaRef.current
      const rail = railRef.current
      if (!media || !rail) return

      const mediaBounds = media.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const readingLine = window.innerWidth <= 700
        ? Math.min(viewportHeight * .78, mediaBounds.bottom + (viewportHeight - mediaBounds.bottom) * .38)
        : mediaBounds.top + mediaBounds.height / 2

      let nearest = 0
      let nearestDistance = Infinity
      stepRefs.current.forEach((step, index) => {
        if (!step) return
        const bounds = step.getBoundingClientRect()
        const distance = Math.abs(bounds.top + bounds.height / 2 - readingLine)
        if (distance < nearestDistance) {
          nearest = index
          nearestDistance = distance
        }
      })

      setActive(previous => previous === nearest ? previous : nearest)
      const marker = markerRefs.current[nearest]
      if (marker) {
        const markerBounds = marker.getBoundingClientRect()
        const railBounds = rail.getBoundingClientRect()
        const height = Math.round(markerBounds.top + markerBounds.height / 2 - railBounds.top)
        setProgressHeight(previous => previous === height ? previous : height)
      }
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    if (mediaRef.current) observer.observe(mediaRef.current)
    if (railRef.current) observer.observe(railRef.current)
    update()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [items.length])

  return <div className="volunteer-scroll-story">
    <div className="volunteer-scroll-media-column">
      <div className="volunteer-scroll-media-sticky" ref={mediaRef}>
        <div className={`volunteer-scroll-media-frame${items[active]?.gallery?.length ? ' has-photos' : ''}`}>
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={active}
              className="volunteer-scroll-art"
              initial={reducedMotion ? false : { opacity: 0, filter: 'blur(18px)', scale: 1.04 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)', scale: .98 }}
              transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}
            >
              {!items[active]?.gallery?.length && <MilestoneArtwork variant={active % 4}/>}
              <VolunteerGalleryStack item={items[active]}/>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="volunteer-scroll-media-caption">{items[active]?.organization} <span>·</span> {items[active]?.category}</p>
      </div>
    </div>
    <div className="volunteer-scroll-steps" ref={railRef}>
      <div className="volunteer-scroll-rail" aria-hidden="true"><motion.span animate={{ height: progressHeight }} transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}/></div>
      <ol aria-label="Volunteering milestones">
        {items.map((item, index) => <li
          ref={element => { stepRefs.current[index] = element }}
          className={index === active ? 'is-active' : ''}
          aria-current={index === active ? 'step' : undefined}
          key={`${item.organization}-${item.role}`}
        >
          <span ref={element => { markerRefs.current[index] = element }} className="volunteer-scroll-dot" aria-hidden="true"><span/></span>
          <div className="volunteer-scroll-copy">
            <span className="volunteer-scroll-label">{item.period} <span>·</span> {item.category}</span>
            <h3>{item.role}</h3>
            <p className="volunteer-scroll-organization">{item.organization}</p>
            <p className="volunteer-scroll-description">{item.description}</p>
          </div>
        </li>)}
      </ol>
    </div>
  </div>
}
