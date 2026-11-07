import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './VolunteerGalleryStack.css'

type GalleryImage = { src: string; alt: string }

type GalleryItem = {
  organization: string
  role: string
  gallery?: readonly GalleryImage[]
}

const logos: Record<string, string> = {
  ICTS: '/about-logos/icts.png',
  VoiceTech: '/about-logos/voicetech.png',
  'IEEE ComSoc USJ': '/about-logos/ieee-comsoc-usj.png',
}

export default function VolunteerGalleryStack({ item }: { item: GalleryItem }) {
  const [front, setFront] = useState(0)
  const reducedMotion = useReducedMotion()
  const photos = item.gallery?.length ? item.gallery : Array.from({ length: 5 }, (_, index) => ({
    src: logos[item.organization],
    alt: `${item.organization} gallery placeholder ${index + 1}`,
  }))
  const placeholder = !item.gallery?.length

  const move = (direction: number) => setFront(current => (current + direction + photos.length) % photos.length)

  return <div className="volunteer-gallery" aria-label={`${item.organization} photo gallery`}>
    {photos.map((photo, index) => {
      const depth = (index - front + photos.length) % photos.length
      if (depth > 3) return null
      return <motion.button
        type="button"
        className={`volunteer-gallery-card${placeholder ? ' is-placeholder' : ''}`}
        data-variant={index % 5}
        key={`${photo.src}-${index}`}
        aria-label={`Show next image. ${front + 1} of ${photos.length} for ${item.organization}`}
        onClick={() => move(1)}
        onKeyDown={event => {
          if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
          if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
        }}
        initial={false}
        animate={{
          x: [0, 32, -28, 20][depth],
          y: [0, -12, 15, 24][depth],
          scale: [1, .98, .96, .94][depth],
          rotate: [-1, 4, -4, 2][depth],
          opacity: 1,
        }}
        transition={{ duration: reducedMotion ? 0 : .55, ease: [.22, 1, .36, 1] }}
        style={{ zIndex: 4 - depth }}
      >
        <img src={photo.src} alt={placeholder ? '' : photo.alt} loading="lazy"/>
        {placeholder && <span className="volunteer-gallery-placeholder-label">{item.organization}<small>Photos coming soon</small></span>}
      </motion.button>
    })}
    <span className="volunteer-gallery-hint">Click to browse</span>
  </div>
}
