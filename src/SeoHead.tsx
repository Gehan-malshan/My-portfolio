import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { portfolio } from './data/portfolio'

const origin = 'https://www.gehan.dev'

export default function SeoHead() {
  const path = useRouterState({ select: state => state.location.pathname })

  useEffect(() => {
    const project = portfolio.projects.find(item => path === `/projects/${item.slug}`)
    const about = path === '/about'
    const title = project ? `${project.title} | Project by Gehan Malshan` : about ? 'About Gehan Malshan | Education, Certifications & Volunteering' : 'Gehan Malshan | Software Engineering, DevOps & Cloud Portfolio'
    const description = project ? `${project.description} Read Gehan Malshan’s project overview, approach, and outcome.` : about ? 'Learn about Gehan Malshan’s education at the University of Sri Jayewardenepura, cloud and DevOps certifications, awards, and volunteering.' : 'Gehan Malshan is an Information Technology undergraduate focused on software engineering, DevOps, and cloud infrastructure. Explore his projects, education, and experience.'
    const canonical = `${origin}${path === '/' ? '/' : path.replace(/\/$/, '')}`
    const image = `${origin}${project?.image ?? '/og-preview.jpg'}`
    const setMeta = (selector: string, content: string) => {
      const element = document.head.querySelector<HTMLMetaElement>(selector)
      if (element) element.content = content
    }
    document.title = title
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical)
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:url"]', canonical)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:image"]', image)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[name="twitter:image"]', image)
  }, [path])

  return null
}
