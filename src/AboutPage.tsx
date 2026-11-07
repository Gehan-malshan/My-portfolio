import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, GraduationCap, Medal, ScrollText } from 'lucide-react'
import TacticalLink from './TacticalLink'
import { portfolio } from './data/portfolio'
import TitleShine from './components/ui/TitleShine'
import BlinkingDotsFallback from './components/ui/BlinkingDotsFallback'
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
  KodeKloud: '/about-logos/cloud-logo.png',
  '2nd Runner-up · Master Designer v3.0': '/about-logos/master-designer.png',
  'Inter-Faculty Taekwondo Championship': '/about-logos/university-of-sri-jayewardenepura.png',
}

function LogoSlot({ name, logoKey = name }: { name: string; logoKey?: string }) {
  const src = aboutLogos[logoKey] ?? aboutLogos[name]
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
    <BlinkingDotsFallback/>
    <nav className="about-cv-nav" aria-label="About page navigation">
      <Link to="/" hash="about" className="about-cv-back"><ArrowLeft size={18} aria-hidden="true"/><span>Back to portfolio</span></Link>
      <span className="about-cv-nav-name">Gehan Malshan / About</span>
    </nav>

    <div className="about-cv-container">
      <header className="about-cv-intro">
        <span className="about-cv-kicker">About / Gehan Malshan</span>
        <h1><TitleShine>The Long Version</TitleShine> <span>/</span></h1>
        <div className="about-cv-meta"><span>{portfolio.role}</span><span>{portfolio.location}</span><a href={`mailto:${portfolio.email}`}>Get in touch <ArrowUpRight size={15} aria-hidden="true"/></a></div>
      </header>

      <section className="about-cv-profile" aria-labelledby="about-profile-title">
        <div className="about-cv-profile-portrait">
          <img src="/gehan-color-cutout.png" alt="Portrait of Gehan Malshan" loading="lazy"/>
        </div>
        <div className="about-cv-profile-copy">
          <span className="about-cv-kicker">A little more about me</span>
          <h2 id="about-profile-title"><TitleShine>From ideas to working software.</TitleShine></h2>
          <p>I’m Gehan Malshan, an Information Technology undergraduate at the University of Sri Jayewardenepura. I’m interested in how digital products are designed, built, deployed, and maintained.</p>
          <p>Through university projects, I’m exploring frontend and backend development, cloud systems, and the practical decisions that make software useful and reliable.</p>
          <p>Outside coursework, I contribute to ICTS, VoiceTech, and IEEE ComSoc USJ through design, marketing, and outreach. I’m currently building my skills in Linux, Docker, and Kubernetes while looking for a DevOps or Software Engineering internship.</p>
        </div>
      </section>

      <section className="about-cv-section" id="about-experience" aria-labelledby="about-experience-title">
        <div className="about-cv-section-label"><BriefcaseBusiness size={19} aria-hidden="true"/><h2 id="about-experience-title"><TitleShine>Experience & volunteering</TitleShine></h2></div>
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
        <div className="about-cv-rows">
          {portfolio.awards.map(item => <article className="about-cv-row" key={item.title}>
            <LogoSlot name={item.issuer} logoKey={item.title}/>
            <div className="about-cv-row-body"><p className="about-cv-organization">{item.issuer}</p><h3>{item.title}</h3><p className="about-cv-description">{item.description}</p></div>
            <p className="about-cv-date">{item.issued}</p>
          </article>)}
        </div>
      </section>

      <footer className="about-cv-outro">
        <span className="about-cv-kicker">The next chapter</span>
        <h2><TitleShine>Let’s build something</TitleShine> <em><TitleShine>useful.</TitleShine></em></h2>
        <p>I’m open to internships, software projects, and thoughtful collaborations.</p>
        <div className="about-cv-actions"><TacticalLink href={`mailto:${portfolio.email}`} label="Contact me"/><TacticalLink href={portfolio.cvPath} label={portfolio.cvIsTemplate ? 'Download CV template' : 'Download my CV'} download/></div>
        <Link to="/" className="about-cv-home-link">Back to portfolio <ArrowUpRight size={17} aria-hidden="true"/></Link>
      </footer>
    </div>
  </main>
}
