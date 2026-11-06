import { useLayoutEffect } from 'react'
import './ScrollReveals.css'

const revealSelector = [
  '.about-feature .about-eyebrow',
  '.about-feature .about-copy h2',
  '.about-feature .about-copy p',
  '.about-feature .about-actions',
  '.project-showcase-heading > div',
  '.project-showcase-heading > p',
  '.project-image-accordion',
  '.tech-section h2',
  '.github-activity-eyebrow',
  '.github-activity h2',
  '.github-calendar-scroll',
  '.education > .section-inner > h2',
  '.education > .section-inner > .section-intro',
  '.volunteering > .section-inner > h2',
  '.volunteering > .section-inner > .section-intro',
  '.footer-invitation .contact-name',
  '.footer-invitation .contact-intro',
  '.footer-contact-row',
  '.about-cv-intro > *',
  '.about-cv-section-label',
  '.about-cv-row',
  '.about-cv-outro > *',
  '.project-detail-header > *',
  '.project-detail-art',
  '.project-detail-gallery figure',
  '.project-detail-body section',
  '.project-detail-links',
].join(',')

const imageSelector = '.project-image-accordion, .github-calendar-scroll, .project-detail-art, .project-detail-gallery figure'
const headingSelector = 'h1, h2, .project-showcase-heading > div, .about-cv-section-label'

export default function ScrollReveals() {
  useLayoutEffect(() => {
    const root = document.getElementById('root')
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || !('IntersectionObserver' in window) || motionPreference.matches) return

    const watched = new WeakSet<Element>()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.remove('scroll-reveal-pending')
        entry.target.classList.add('scroll-reveal-visible')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.06 })

    const scan = () => {
      root.querySelectorAll<HTMLElement>(revealSelector).forEach(element => {
        if (watched.has(element)) return
        watched.add(element)
        element.classList.add('scroll-reveal')
        if (element.matches(imageSelector)) element.classList.add('scroll-reveal-image')
        else if (element.matches(headingSelector)) element.classList.add('scroll-reveal-heading')

        // Content already on screen stays visible when returning from a project page.
        if (element.getBoundingClientRect().top < window.innerHeight * 0.88) {
          element.classList.add('scroll-reveal-visible')
        } else {
          element.classList.add('scroll-reveal-pending')
          observer.observe(element)
        }
      })
    }

    let frame = 0
    const scheduleScan = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; scan() })
    }
    const mutations = new MutationObserver(scheduleScan)
    mutations.observe(root, { childList: true, subtree: true })
    const revealAll = () => {
      if (!motionPreference.matches) return
      observer.disconnect()
      root.querySelectorAll('.scroll-reveal-pending').forEach(element => {
        element.classList.remove('scroll-reveal-pending')
        element.classList.add('scroll-reveal-visible')
      })
    }
    motionPreference.addEventListener('change', revealAll)
    scan()

    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      observer.disconnect()
      motionPreference.removeEventListener('change', revealAll)
    }
  }, [])

  return null
}
