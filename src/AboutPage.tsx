import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, GraduationCap, Medal, ScrollText } from 'lucide-react'
import TacticalLink from './TacticalLink'
import AboutPixelGallery from './AboutPixelGallery'
import { portfolio } from './data/portfolio'
import TitleShine from './components/ui/TitleShine'
import BlinkingDotsFallback from './components/ui/BlinkingDotsFallback'
import SplashCursor from './SplashCursor'
import './AboutPage.css'

const aboutLogos: Record<string, string> = {
  ICTS: '/about-logos/icts.png',
  VoiceTech: '/about-logos/voicetech.png',
  'IEEE ComSoc USJ': '/about-logos/ieee-comsoc-usj.png',
  'University of Sri Jayewardenepura': '/about-logos/university-of-sri-jayewardenepura.png',
  'Mahinda Rajapaksha College, Homagama': '/about-logos/mahinda-rajapaksha-college.png',
  'LFS101: Introduction to Linux': '/about-logos/lfs101-linux.png',
  'LFS158: Introduction to Kubernetes': '/about-logos/lfs158-kubernetes.png',
  'Redis Associate Software Operator': '/about-logos/redis-associate.png',
  'AWS Academy Graduate – Cloud Foundations': '/about-logos/aws-cloud-foundations.png',
  'Oracle Cloud Infrastructure 2026 Foundations Associate': '/about-logos/oracle-cloud-foundations-2026.png',
  KodeKloud: '/about-logos/cloud-logo.png',
  '2nd Runner-up · Master Designer v3.0': '/about-logos/master-designer.png',
  'Inter-Faculty Taekwondo Championship': '/about-logos/university-of-sri-jayewardenepura.png',
}

type EntryPhoto = { src: string; alt: string }

function LogoSlot({ name, logoKey = name, photo }: { name: string; logoKey?: string; photo?: EntryPhoto }) {
  const src = aboutLogos[logoKey] ?? aboutLogos[name]
  const mark = name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase()
  return <span className={`about-cv-logo${photo ? ' has-photo' : ''}`} aria-hidden="true">
    {src ? <img src={src} alt="" loading="lazy"/> : <span>{mark}</span>}
    {photo && <img className="about-entry-photo" src={photo.src} alt="" loading="lazy"/>}
  </span>
}

function MorphEntry({ name, logoKey, meta, title, description, date, photo }: {
  name: string
  logoKey?: string
  meta: string
  title: string
  description: string
  date: string
  photo?: EntryPhoto
}) {
  const [expanded, setExpanded] = useState(false)

  return <button
    type="button"
    className={`about-award-row${expanded ? ' is-open' : ''}`}
    aria-expanded={expanded}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setExpanded(true) }}
    onPointerLeave={event => { if (event.pointerType === 'mouse') setExpanded(false) }}
    onFocus={() => { if (!window.matchMedia('(hover: none)').matches) setExpanded(true) }}
    onBlur={() => setExpanded(false)}
    onClick={event => {
      if (window.matchMedia('(hover: none)').matches) setExpanded(current => !current)
      else if (event.detail > 0) setExpanded(true)
    }}
  >
    <LogoSlot name={name} logoKey={logoKey} photo={photo}/>
    <span className="about-award-copy"><span className="about-cv-organization">{meta}</span><strong className="about-award-title">{title}</strong><span className="about-award-description">{description}</span></span>
    <span className="about-award-date">{date}</span>
  </button>
}

export default function AboutPage() {

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'About — Gehan Malshan'
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => { document.title = previousTitle }
  }, [])

  return <main className="about-cv" id="top">
    <BlinkingDotsFallback/>
    <SplashCursor colors={['#ffffff']} rainbow={false} colorSpeed={0.2} force={0.15} shading={0.21} swirl={7} momentum={0.4} intensity={0.7} size={0.55} trail={0.5} intro={false} quality="medium" zIndex={0}/>
    <nav className="about-cv-nav" aria-label="About page navigation">
      <Link to="/" hash="about" className="about-cv-back"><ArrowLeft size={18} aria-hidden="true"/><span>Back to portfolio</span></Link>
      <span className="about-cv-nav-name">Gehan Malshan / About</span>
    </nav>

    <div className="about-cv-container">
      <header className="about-cv-intro">
        <span className="about-cv-kicker">About / Gehan Malshan</span>
        <h1><TitleShine>The Long Version</TitleShine> <span>/</span></h1>
        <div className="about-cv-meta"><span>{portfolio.role}</span><span>{portfolio.location}</span><a className="about-cv-back" href={`mailto:${portfolio.email}`}>Get in touch <ArrowUpRight size={16} aria-hidden="true"/></a></div>
      </header>

      <section className="about-cv-profile" aria-labelledby="about-profile-title">
        <div className="about-cv-profile-portrait">
          <img src="/gehan-color-cutout.png" alt="Portrait of Gehan Malshan" loading="lazy"/>
        </div>
        <div className="about-cv-profile-copy">
          <span className="about-cv-kicker">A little more about me</span>
          <h2 id="about-profile-title"><TitleShine>Building software from code to cloud.</TitleShine></h2>
          <p>I’m Gehan Malshan, an Information Technology undergraduate at the University of Sri Jayewardenepura. I’m interested in the full path from writing an application to deploying and operating it.</p>
          <p>In university team projects, I’ve worked with frontend and backend code, Go services, databases, containers, and cloud infrastructure. StudEd and MatchMate have helped me explore service boundaries, deployment workflows, and the practical needs of distributed applications.</p>
          <p>I’m continuing to learn Linux, Docker, Kubernetes, and cloud platforms, and I’m seeking a DevOps or Software Engineering internship. My roles with ICTS, VoiceTech, and IEEE ComSoc USJ have strengthened the teamwork and communication needed to deliver reliable software together.</p>
        </div>
      </section>

      <section className="about-cv-section" id="about-education" aria-labelledby="about-education-title">
        <div className="about-cv-section-label"><GraduationCap size={20} aria-hidden="true"/><h2 id="about-education-title"><TitleShine>Education</TitleShine></h2></div>
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
        <div className="about-cv-section-label"><ScrollText size={19} aria-hidden="true"/><h2 id="about-certifications-title"><TitleShine>Certifications & qualifications</TitleShine></h2></div>
        <div className="about-cv-rows">
          {portfolio.certifications.map(item => <article className="about-cv-row about-cv-row-compact" key={item.title}>
            <LogoSlot name={item.issuer} logoKey={item.title}/>
            <div className="about-cv-row-body"><p className="about-cv-organization">{item.issuer}</p><h3>{item.title}</h3></div>
            {item.issued && <p className="about-cv-date">{item.issued}</p>}
          </article>)}
        </div>
      </section>

      <section className="about-cv-section" id="about-awards" aria-labelledby="about-awards-title">
        <div className="about-cv-section-label"><Medal size={19} aria-hidden="true"/><h2 id="about-awards-title"><TitleShine>Honors & awards</TitleShine></h2></div>
        <div className="about-cv-rows about-award-list">
          {portfolio.awards.map(item => <MorphEntry
            key={item.title}
            name={item.issuer}
            logoKey={item.title}
            meta={item.issuer}
            title={item.title}
            description={item.description}
            date={item.issued}
            photo={item.gallery[0]}
          />)}
        </div>
      </section>

      <section className="about-cv-section" id="about-volunteering" aria-labelledby="about-volunteering-title">
        <div className="about-cv-section-label"><BriefcaseBusiness size={19} aria-hidden="true"/><h2 id="about-volunteering-title"><TitleShine>Volunteering</TitleShine></h2></div>
        <div className="about-cv-rows about-award-list">
          {portfolio.volunteering.map(item => <MorphEntry
            key={`${item.organization}-${item.role}`}
            name={item.organization}
            meta={`${item.organization} / ${item.category}`}
            title={item.role}
            description={item.description}
            date={item.period}
            photo={'gallery' in item ? item.gallery?.[0] : undefined}
          />)}
        </div>
      </section>

    </div>
    <AboutPixelGallery/>
    <footer className="about-cv-outro">
      <div className="about-cv-outro-inner">
        <span className="about-cv-kicker">The next chapter</span>
        <h2><TitleShine>Let’s build something</TitleShine> <em><TitleShine>useful.</TitleShine></em></h2>
        <p>I’m open to DevOps and software engineering internships, cloud projects, and technical collaborations.</p>
        <div className="about-cv-actions"><TacticalLink href={`mailto:${portfolio.email}`} label="Contact me"/><TacticalLink label="Download CV" ariaLabel="CV will be available soon"/></div>
        <Link to="/" className="about-cv-home-link">Back to portfolio <ArrowUpRight size={17} aria-hidden="true"/></Link>
      </div>
    </footer>
  </main>
}
