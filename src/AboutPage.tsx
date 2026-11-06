import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, GraduationCap, Medal, ScrollText } from 'lucide-react'
import TacticalLink from './TacticalLink'
import { portfolio } from './data/portfolio'
import './AboutPage.css'

// Add uploaded organization logos in public/about-logos and map them here.
// Until then, each row has a readable text mark instead of a missing image.
const aboutLogos: Record<string, string> = {}

function LogoSlot({ name }: { name: string }) {
  const src = aboutLogos[name]
  const mark = name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase()
  return <span className="about-cv-logo" aria-hidden="true">
    {src ? <img src={src} alt="" loading="lazy"/> : <span>{mark}</span>}
  </span>
}

export default function AboutPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'About — Gehan Malshan'
    window.scrollTo(0, 0)
    return () => { document.title = previousTitle }
  }, [])

  return <main className="about-cv" id="top">
    <nav className="about-cv-nav" aria-label="About page navigation">
      <Link to="/" hash="about" className="about-cv-back"><ArrowLeft size={18} aria-hidden="true"/><span>Back to portfolio</span></Link>
      <span className="about-cv-nav-name">Gehan Malshan / About</span>
    </nav>

    <div className="about-cv-container">
      <header className="about-cv-intro">
        <span className="about-cv-kicker">About / Gehan Malshan</span>
        <h1>The Long Version <span>/</span></h1>
        <p>A closer look at my academic journey, technical learning, and the teams and communities I contribute to.</p>
        <div className="about-cv-meta"><span>{portfolio.role}</span><span>{portfolio.location}</span><a href={`mailto:${portfolio.email}`}>Get in touch <ArrowUpRight size={15} aria-hidden="true"/></a></div>
      </header>

      <section className="about-cv-section" id="about-experience" aria-labelledby="about-experience-title">
        <div className="about-cv-section-label"><BriefcaseBusiness size={19} aria-hidden="true"/><h2 id="about-experience-title">Experience & volunteering</h2></div>
        <div className="about-cv-rows">
          {portfolio.volunteering.map(item => <article className="about-cv-row" key={`${item.organization}-${item.role}`}>
            <LogoSlot name={item.organization}/>
            <div className="about-cv-row-body">
              <p className="about-cv-organization">{item.organization} <span>/ {item.category}</span></p>
              <h3>{item.role}</h3>
              <p className="about-cv-description">{item.description}</p>
            </div>
            <p className="about-cv-date">{item.period}</p>
          </article>)}
        </div>
      </section>

      <section className="about-cv-section" id="about-education" aria-labelledby="about-education-title">
        <div className="about-cv-section-label"><GraduationCap size={20} aria-hidden="true"/><h2 id="about-education-title">Education</h2></div>
        <div className="about-cv-rows">
          {portfolio.education.map(item => <article className="about-cv-row" key={item.institution}>
            <LogoSlot name={item.institution}/>
            <div className="about-cv-row-body">
              <p className="about-cv-organization">{item.institution}</p>
              <h3>{item.title}</h3>
              <p className="about-cv-description">{item.description}</p>
            </div>
            <p className="about-cv-date">{item.period}</p>
          </article>)}
        </div>
      </section>

      <section className="about-cv-section" id="about-certifications" aria-labelledby="about-certifications-title">
        <div className="about-cv-section-label"><ScrollText size={19} aria-hidden="true"/><h2 id="about-certifications-title">Certifications & qualifications</h2></div>
        <div className="about-cv-rows">
          {portfolio.certifications.map(item => <article className="about-cv-row about-cv-row-compact" key={item.title}>
            <LogoSlot name={item.issuer}/>
            <div className="about-cv-row-body"><p className="about-cv-organization">{item.issuer}</p><h3>{item.title}</h3></div>
            <p className="about-cv-date">{item.issued}</p>
          </article>)}
        </div>
      </section>

      <section className="about-cv-section" id="about-awards" aria-labelledby="about-awards-title">
        <div className="about-cv-section-label"><Medal size={19} aria-hidden="true"/><h2 id="about-awards-title">Honors & awards</h2></div>
        <div className="about-cv-rows">
          {portfolio.awards.map(item => <article className="about-cv-row" key={item.title}>
            <LogoSlot name={item.issuer}/>
            <div className="about-cv-row-body"><p className="about-cv-organization">{item.issuer}</p><h3>{item.title}</h3><p className="about-cv-description">{item.description}</p></div>
            <p className="about-cv-date">{item.issued}</p>
          </article>)}
        </div>
      </section>

      <footer className="about-cv-outro">
        <span className="about-cv-kicker">The next chapter</span>
        <h2>Let’s build something <em>useful.</em></h2>
        <p>I’m open to internships, software projects, and thoughtful collaborations.</p>
        <div className="about-cv-actions"><TacticalLink href={`mailto:${portfolio.email}`} label="Contact me"/><TacticalLink href={portfolio.cvPath} label={portfolio.cvIsTemplate ? 'Download CV template' : 'Download my CV'} download/></div>
        <Link to="/" className="about-cv-home-link">Back to portfolio <ArrowUpRight size={17} aria-hidden="true"/></Link>
      </footer>
    </div>
  </main>
}
