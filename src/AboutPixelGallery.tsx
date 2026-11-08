import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { portfolio } from './data/portfolio'
import './AboutPixelGallery.css'

type GalleryPhoto = { src: string; alt: string }
type PreparedPhoto = HTMLCanvasElement

const TILE_WIDTH = 450
const TILE_HEIGHT = 570
const DRIFT_PX_PER_SECOND = 76

export default function AboutPixelGallery() {
  const photos = useMemo<GalleryPhoto[]>(() => [
    ...portfolio.volunteering.flatMap(item => item.gallery),
    ...portfolio.awards.flatMap(item => item.gallery),
  ], [])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offsetRef = useRef(0)
  const layoutRef = useRef({ width: 0, cardWidth: 0, gap: 0, left: 0 })
  const dragRef = useRef<{ x: number; distance: number } | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const selectedRef = useRef<number | null>(null)

  useEffect(() => { selectedRef.current = selected }, [selected])

  useEffect(() => {
    if (selected === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowLeft') setSelected(current => current === null ? null : (current - 1 + photos.length) % photos.length)
      if (event.key === 'ArrowRight') setSelected(current => current === null ? null : (current + 1) % photos.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected, photos])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context || !photos.length) return

    const prepared: Array<PreparedPhoto | null> = photos.map(() => null)
    const images = photos.map((photo, index) => {
      const image = new Image()
      image.onload = () => {
        const tile = document.createElement('canvas')
        tile.width = TILE_WIDTH
        tile.height = TILE_HEIGHT
        const tileContext = tile.getContext('2d')
        if (!tileContext) return
        const scale = Math.max(TILE_WIDTH / image.naturalWidth, TILE_HEIGHT / image.naturalHeight)
        const cropWidth = TILE_WIDTH / scale
        const cropHeight = TILE_HEIGHT / scale
        const cropX = (image.naturalWidth - cropWidth) / 2
        const cropY = (image.naturalHeight - cropHeight) / 2
        tileContext.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, TILE_WIDTH, TILE_HEIGHT)
        prepared[index] = tile
      }
      image.src = photo.src
      return image
    })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let previous = 0
    let visible = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawPhoto = (asset: PreparedPhoto | null, x: number, y: number, cardWidth: number, cardHeight: number) => {
      if (!asset) {
        context.fillStyle = '#242424'
        context.fillRect(x, y, cardWidth, cardHeight)
        return
      }
      context.drawImage(asset, x, y, cardWidth, cardHeight)
    }

    const render = (time: number) => {
      frame = 0
      if (!visible) return
      if (previous && !reducedMotion.matches && !dragRef.current && selectedRef.current === null) {
        offsetRef.current += Math.min((time - previous) / 1000, .05) * DRIFT_PX_PER_SECOND
      }
      previous = time
      context.fillStyle = '#101010'
      context.fillRect(0, 0, width, height)
      const cardWidth = Math.min(300, Math.max(185, width * .235), height * .69 * TILE_WIDTH / TILE_HEIGHT)
      const cardHeight = cardWidth * TILE_HEIGHT / TILE_WIDTH
      const gap = Math.min(28, width * .023)
      const stride = cardWidth + gap
      const left = (width - (cardWidth * 4 + gap * 3)) / 2
      const top = (height - cardHeight) / 2
      const cycle = stride * photos.length
      offsetRef.current = ((offsetRef.current % cycle) + cycle) % cycle
      layoutRef.current = { width, cardWidth, gap, left }
      const first = Math.floor((offsetRef.current - left) / stride) - 1
      const last = first + Math.ceil(width / stride) + 3
      for (let i = first; i <= last; i++) {
        const x = left + i * stride - offsetRef.current
        const index = ((i % photos.length) + photos.length) % photos.length
        if (x > width || x + cardWidth < 0) continue
        drawPhoto(prepared[index], x, top, cardWidth, cardHeight)
      }
      const shadowWidth = Math.min(220, width * .2)
      const leftShadow = context.createLinearGradient(0, 0, shadowWidth, 0)
      leftShadow.addColorStop(0, '#101010')
      leftShadow.addColorStop(1, 'rgba(16,16,16,0)')
      context.fillStyle = leftShadow
      context.fillRect(0, 0, shadowWidth, height)
      const rightShadow = context.createLinearGradient(width - shadowWidth, 0, width, 0)
      rightShadow.addColorStop(0, 'rgba(16,16,16,0)')
      rightShadow.addColorStop(1, '#101010')
      context.fillStyle = rightShadow
      context.fillRect(width - shadowWidth, 0, shadowWidth, height)
      frame = requestAnimationFrame(render)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false
      if (visible && !frame) frame = requestAnimationFrame(render)
    }, { rootMargin: '100px' })
    visibilityObserver.observe(canvas)
    frame = requestAnimationFrame(render)
    return () => {
      images.forEach(image => { image.onload = null })
      observer.disconnect()
      visibilityObserver.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [photos])

  const selectAt = (x: number) => {
    const { cardWidth, gap, left } = layoutRef.current
    const stride = cardWidth + gap
    const tile = Math.floor((x - left + offsetRef.current) / stride)
    const within = (x - left + offsetRef.current) - tile * stride
    if (within >= 0 && within <= cardWidth) setSelected(((tile % photos.length) + photos.length) % photos.length)
  }

  return <section className="about-pixel-gallery" aria-labelledby="about-gallery-title">
    <div className="about-pixel-gallery-heading">
      <span className="about-cv-kicker">Community / {photos.length} frames</span>
      <h2 id="about-gallery-title">Moments along the way</h2>
      <p>Drag to explore. Select a photo to view it in full.</p>
    </div>
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Moving gallery of ${photos.length} volunteering and award photos. Drag, use arrow keys, or press Enter to view a photo.`}
      tabIndex={0}
      onPointerDown={event => {
        dragRef.current = { x: event.clientX, distance: 0 }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={event => {
        if (!dragRef.current) return
        const change = event.clientX - dragRef.current.x
        dragRef.current.x = event.clientX
        dragRef.current.distance += Math.abs(change)
        offsetRef.current -= change
      }}
      onPointerUp={event => {
        const dragged = dragRef.current?.distance ?? 0
        dragRef.current = null
        if (dragged < 8) selectAt(event.nativeEvent.offsetX)
      }}
      onPointerCancel={() => { dragRef.current = null }}
      onKeyDown={event => {
        const { cardWidth, gap } = layoutRef.current
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          offsetRef.current += (cardWidth + gap) * (event.key === 'ArrowRight' ? 1 : -1)
        }
        if (event.key === 'Enter') {
          event.preventDefault()
          selectAt(layoutRef.current.width / 2)
        }
      }}
    />
    <ul className="about-pixel-gallery-list">{photos.map(photo => <li key={photo.src}>{photo.alt}</li>)}</ul>
    {selected !== null && <div className="about-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery photo" onClick={() => setSelected(null)}>
      <button type="button" className="about-gallery-close" aria-label="Close photo" onClick={() => setSelected(null)}><X size={24}/></button>
      <button type="button" className="about-gallery-arrow" aria-label="Previous photo" onClick={event => { event.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length) }}><ArrowLeft size={24}/></button>
      <figure onClick={event => event.stopPropagation()}><img src={photos[selected].src} alt={photos[selected].alt}/><figcaption>{photos[selected].alt} <span>{selected + 1} / {photos.length}</span></figcaption></figure>
      <button type="button" className="about-gallery-arrow" aria-label="Next photo" onClick={event => { event.stopPropagation(); setSelected((selected + 1) % photos.length) }}><ArrowRight size={24}/></button>
    </div>}
  </section>
}
