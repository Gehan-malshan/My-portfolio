import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { portfolio } from './data/portfolio'
import './ProjectShowcase.css'

export default function ProjectDetail({ slug }: { slug: string }) {
  const project = portfolio.projects.find(item => item.slug === slug)
  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!project) return <main className="project-detail-page project-not-found"><Link to="/" hash="projects" className="project-back"><ArrowLeft size={19}/> Back to projects</Link><h1>Project not found.</h1><p>Choose a project from the portfolio.</p></main>

  return <main className="project-detail-page">
    <div className="project-detail-top"><Link to="/" hash="projects" className="project-back"><ArrowLeft size={19}/> Back to projects</Link><span>{project.number} / {String(portfolio.projects.length).padStart(2, '0')}</span></div>
    <header className="project-detail-header"><span className="project-kicker">{project.category} / Project details</span><h1>{project.title}<span>.</span></h1><p>{project.description}</p><div className="project-feature-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></header>
    <div className="project-detail-art"><img src={project.image} alt={`${project.title} preview placeholder`}/></div>
    <div className="project-detail-body"><section><span>01 / Overview</span><p>{project.overview}</p></section><section><span>02 / Challenge</span><p>{project.challenge}</p></section><section><span>03 / Approach</span><p>{project.approach}</p></section><section><span>04 / Outcome</span><p>{project.outcome}</p></section></div>
    {(project.url || project.repository) && <div className="project-detail-links">{project.url && <a href={project.url} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={18}/></a>}{project.repository && <a href={project.repository} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={18}/></a>}</div>}
    <div className="project-detail-bottom"><Link to="/" hash="projects" className="project-back"><ArrowLeft size={19}/> All projects</Link><span>Gehan Malshan © {new Date().getFullYear()}</span></div>
  </main>
}
