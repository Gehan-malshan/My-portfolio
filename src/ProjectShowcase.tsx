import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { portfolio } from './data/portfolio'
import './ProjectShowcase.css'

const projects = portfolio.projects

export default function ProjectShowcase() {
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()
  const project = projects[active]
  const choose = (index: number) => setActive((index + projects.length) % projects.length)

  return <section className="section project-showcase" id="projects" aria-labelledby="projects-title">
    <div className="section-inner">
      <div className="project-showcase-heading">
        <div><span className="project-kicker">Selected work / {String(projects.length).padStart(2, '0')}</span><h2 id="projects-title">Projects<span className="project-heading-period">.</span></h2></div>
        <p>A place for the work I build and the ideas I explore. Select a project to see its story.</p>
      </div>

      <div className="project-feature">
        <Link to="/projects/$slug" params={{ slug: project.slug }} className="project-feature-image" aria-label={`View details for ${project.title}`}>
          <AnimatePresence mode="wait">
            <motion.img
              key={project.slug}
              src={project.image}
              alt={`${project.title} preview placeholder`}
              initial={reducedMotion ? false : { opacity: 0, scale: 1.085, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: .965, filter: 'blur(8px)' }}
              transition={{ duration: reducedMotion ? 0 : .48, ease: [.22, 1, .36, 1] }}
            />
          </AnimatePresence>
          <span className="project-feature-image-label">View project <ArrowUpRight size={18}/></span>
        </Link>
        <div className="project-feature-info" aria-live="polite">
          <span className="project-feature-index">{project.number} / {String(projects.length).padStart(2, '0')}</span>
          <span className="project-feature-category">{project.category}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="project-feature-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="project-detail-link">View full project <ArrowUpRight size={19}/></Link>
        </div>
      </div>

      <div className="project-showcase-controls" aria-label="Choose a project">
        <div className="project-showcase-tabs">{projects.map((item, index) => <button
          type="button" key={item.slug} className={active === index ? 'is-active' : ''}
          aria-label={`Show ${item.title}`} aria-current={active === index ? 'true' : undefined}
          onClick={() => choose(index)}><span>{item.number}</span><span>{item.title}</span></button>)}</div>
        <div className="project-showcase-arrows"><button type="button" onClick={() => choose(active - 1)} aria-label="Previous project"><ChevronLeft/></button><button type="button" onClick={() => choose(active + 1)} aria-label="Next project"><ChevronRight/></button></div>
      </div>
      <p className="project-edit-hint">Project images and details are placeholders. Update them in <code>src/data/portfolio.ts</code> and <code>public/projects/</code>.</p>
    </div>
  </section>
}
