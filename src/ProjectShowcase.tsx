import { useState, type MouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { portfolio } from './data/portfolio'
import TitleShine from './components/ui/TitleShine'
import './ProjectShowcase.css'

const projects = portfolio.projects

export default function ProjectShowcase() {
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()
  const handleCardClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (!window.matchMedia('(max-width: 700px)').matches || event.detail === 0) return
    if ((event.target as HTMLElement).closest('.project-image-action')) return
    event.preventDefault()
    setActive(index)
  }

  return <section className="section project-showcase" id="projects" aria-labelledby="projects-title">
    <div className="section-inner">
      <div className="project-showcase-heading">
        <div><span className="project-kicker">Selected work / {String(projects.length).padStart(2, '0')}</span><h2 id="projects-title"><TitleShine>Projects</TitleShine><span className="project-heading-period">.</span></h2></div>
        <p>Explore my software and cloud projects, from service architecture to deployment. Open a card for the full story.</p>
      </div>

      <div className="project-image-accordion" aria-label="Project cards">
        {projects.map((project, index) => <Link
          key={project.slug}
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className={`project-image-card${active === index ? ' is-active' : ''}`}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={event => handleCardClick(event, index)}
          aria-label={`View ${project.title} project details`}
        >
          <motion.img
            src={project.image}
            alt={`${project.title} project image`}
            initial={reducedMotion ? false : { opacity: 0, scale: 1.08 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: .18 }}
            transition={{ duration: reducedMotion ? 0 : .7, ease: [.22, 1, .36, 1], delay: index * .09 }}
          />
          <span className="project-image-shade" aria-hidden="true"/>
          <span className="project-image-top"><span>{project.number} / {String(projects.length).padStart(2, '0')}</span><ArrowUpRight size={24} aria-hidden="true"/></span>
          <span className="project-image-bottom">
            <span className="project-image-category">{project.category}</span>
            <span className="project-image-title">{project.title}</span>
            <span className="project-image-description">{project.description}</span>
            <span className="project-image-action">View full project <ArrowUpRight size={18} aria-hidden="true"/></span>
          </span>
        </Link>)}
      </div>
    </div>
  </section>
}
