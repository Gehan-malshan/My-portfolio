import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import TacticalLink from './TacticalLink'
import { portfolio } from './data/portfolio'
import TitleShine from './components/ui/TitleShine'
import BlinkingDotsFallback from './components/ui/BlinkingDotsFallback'
import './ProjectShowcase.css'

export default function ProjectDetail({ slug }: { slug: string }) {
  const project = portfolio.projects.find(item => item.slug === slug)
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [slug])

  if (!project) return <main className="project-detail-page project-not-found"><Link to="/" hash="projects" className="project-back"><ArrowLeft size={19}/> Back to projects</Link><h1><TitleShine>Project not found.</TitleShine></h1><p>Choose a project from the portfolio.</p></main>

  const index = portfolio.projects.findIndex(item => item.slug === slug)
  const previous = portfolio.projects[(index - 1 + portfolio.projects.length) % portfolio.projects.length]
  const next = portfolio.projects[(index + 1) % portfolio.projects.length]
  const openProject = (nextSlug: string) => void navigate({ to: '/projects/$slug', params: { slug: nextSlug } })

  return <main className="project-detail-page">
    <BlinkingDotsFallback/>
    <div className="project-detail-top"><Link to="/" hash="projects" className="project-back"><ArrowLeft size={19}/> Back to projects</Link><span>{project.number} / {String(portfolio.projects.length).padStart(2, '0')}</span></div>
    <header className="project-detail-header"><span className="project-kicker">{project.category} / Project details</span><h1><TitleShine>{project.title}</TitleShine><span>.</span></h1><p>{project.description}</p><div className="project-feature-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></header>
    <div className={`project-detail-art${project.slug === 'govilink' ? ' project-detail-art-portrait' : ''}`}><img src={project.image} alt={`${project.title} project image`}/></div>
    {project.gallery.length > 0 && <div className="project-detail-gallery">{project.gallery.map(image => <figure key={image.src}><img src={image.src} alt={image.alt}/><figcaption>{image.caption}</figcaption></figure>)}</div>}
    <div className="project-detail-body"><section><span>01 / Overview</span><p>{project.overview}</p></section><section><span>02 / Challenge</span><p>{project.challenge}</p></section><section><span>03 / Approach</span><p>{project.approach}</p></section><section><span>04 / Outcome</span><p>{project.outcome}</p></section></div>
    {(project.url || project.prototype || project.repository) && <div className="project-detail-links">{project.url && <TacticalLink href={project.url} label="View Behance case study ↗" newTab/>}{project.prototype && <TacticalLink href={project.prototype} label="Explore Figma prototype ↗" newTab/>}{project.repository && <TacticalLink href={project.repository} label="Source code ↗" newTab/>}</div>}
    <nav className="project-detail-navigation" aria-label="Browse projects"><TacticalLink label={`← Previous · ${previous.title}`} onClick={() => openProject(previous.slug)}/><TacticalLink label={`Next · ${next.title} →`} onClick={() => openProject(next.slug)}/></nav>
    <div className="project-detail-bottom"><span>Gehan Malshan © {new Date().getFullYear()}</span></div>
  </main>
}
