import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router'
import { ArrowUpRight, Dribbble, Github, Linkedin, Mail, type LucideIcon } from 'lucide-react'
import GridTrails from './GridTrails'
import FooterShader from './FooterShader'
import TacticalLink from './TacticalLink'
import PagePreloader from './PagePreloader'
import TechLogos from './TechLogos'
import PageScrollBlur from './PageScrollBlur'
import BackToTop from './BackToTop'
import BlurredHeroTicker from './BlurredHeroTicker'
import ScrollMorph from './ScrollMorph'
import { portfolio } from './data/portfolio'
import './editorial.css'

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]) })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
const links = [['Projects', '#projects'], ['About', '#about'], ['Education', '#education'], ['Volunteering', '#volunteering'], ['Contact', '#contact']]
const contactPlatforms = [
  { label: 'GitHub', href: portfolio.github, Icon: Github },
  { label: 'Email', href: portfolio.email ? `mailto:${portfolio.email}` : '', Icon: Mail },
  { label: 'Dribbble', href: portfolio.dribbble, Icon: Dribbble },
  { label: 'LinkedIn', href: portfolio.linkedin, Icon: Linkedin },
]

function ContactIcon({ label, href, Icon, variant, onMissing }: { label: string, href: string, Icon: LucideIcon, variant: 'hero' | 'footer', onMissing: (label: string) => void }) {
  const className = variant === 'hero' ? 'contact-icon' : 'contact-orb contact-icon'
  const content = <><span className="contact-icon-tooltip" aria-hidden="true">{label}</span><span className="contact-icon-surface"><span className="contact-icon-fill"/><Icon aria-hidden="true"/></span></>
  return href
    ? <a className={className} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'} aria-label={label}>{content}</a>
    : <button className={className} type="button" aria-label={label} onClick={() => onMissing(label)}>{content}</button>
}

function Home() {
  const [contactNotice, setContactNotice] = React.useState('')
  React.useEffect(() => {
    if (!contactNotice) return
    const timeout = window.setTimeout(() => setContactNotice(''), 4000)
    return () => window.clearTimeout(timeout)
  }, [contactNotice])
  const onMissingContact = (label: string) => setContactNotice(`${label} contact details are coming soon.`)
  return <>
    <PagePreloader/>
    <PageScrollBlur/>
    <nav className="toc-nav" aria-label="Main navigation">{links.map(([label, href]) => <a href={href} key={href} aria-label={label}><span className="toc-label" aria-hidden="true">{label}</span><span className="toc-line" aria-hidden="true"/></a>)}</nav>
    <main id="top">
      <section className="hero hero-no-photo" aria-label="Introduction">
        <div className="hero-grid" aria-hidden="true"><GridTrails background="#000000" lineColor="#171717" accent="#ffffff" cellSize={72} lights={0} trailLength={4} glow={70} hover={85}/></div>
        <div className="hero-copy">
          <BlurredHeroTicker words={portfolio.heroWords}/>
          <div className="hero-intro">
            <p className="hero-identity">Hi, I’m {portfolio.name}<br/>{portfolio.role}</p>
            <p className="hero-description">{portfolio.intro}</p>
          </div>
          <nav className="hero-socials" aria-label="Social links">
            {[contactPlatforms[3], contactPlatforms[2], contactPlatforms[1], contactPlatforms[0]].map(({ label, href, Icon }) =>
              <ContactIcon label={label} href={href} Icon={Icon} variant="hero" onMissing={onMissingContact} key={label}/>)}
          </nav>
        </div>
        <div className="hero-cta"><TacticalLink href="#contact" label="Contact me"/></div>
      </section>
      <section className="section projects" id="projects"><div className="section-inner"><h2>Some projects<span>.</span></h2><div className="project-grid">{portfolio.projects.map((project, index) => <article className="project-card" key={project.number}><div className={`project-visual visual-${index % 2}`} aria-hidden="true"><div className="project-screen"><div className="screen-top"><i/><i/><i/></div><div className="screen-body"><b/><i/><i/><div><em/><em/></div></div></div></div><div className="project-copy"><h3>{project.title}</h3><p>{project.description}</p></div>{project.url ? <a className="project-arrow" href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><ArrowUpRight/></a> : <span className="project-arrow" aria-hidden="true"><ArrowUpRight/></span>}</article>)}</div><p className="section-note">Starter spaces for your projects. Edit <code>src/data/portfolio.ts</code>.</p></div></section>
      <ScrollMorph/>
      <section className="section about-feature" id="about" aria-labelledby="about-title">
        <div className="about-feature-inner">
          <div className="about-portrait"><img src="/gehan-color-cutout.png" alt="Black and white portrait of Gehan Malshan in a suit" loading="lazy"/></div>
          <div className="about-copy">
            <span className="about-eyebrow">Know about me</span>
            <h2 id="about-title">Curious about code and <em>everything around it.</em></h2>
            <p>{portfolio.about}</p>
            <p>{portfolio.aboutMore}</p>
            <div className="about-actions"><TacticalLink href="#education" label="More about me"/></div>
            <nav className="about-socials hero-socials" aria-label="About social links">
              {[contactPlatforms[0], contactPlatforms[3]].map(({ label, href, Icon }) =>
                <ContactIcon label={label} href={href} Icon={Icon} variant="hero" onMissing={onMissingContact} key={label}/>)}
            </nav>
          </div>
        </div>
      </section>
      <TechLogos/>
      <section className="section education" id="education"><div className="section-inner"><h2>Education<span>.</span></h2><div className="education-row"><div><h3>{portfolio.education.degree}</h3><p>{portfolio.education.institution || portfolio.education.note}</p></div><span>{portfolio.education.period}</span></div><div className="cv-row"><div><h3>Resume.</h3><p>A starter CV is ready to download and replace with your finished version.</p></div><TacticalLink href={portfolio.cvPath} label={portfolio.cvIsTemplate ? 'Download CV template' : 'Download my CV'} download/></div></div></section>
      <section className="section volunteering" id="volunteering"><div className="section-inner"><h2>Volunteering<span>.</span></h2><p className="section-intro">The communities, teams, and initiatives I contribute to.</p><div className="timeline">{portfolio.volunteering.map((item, index) => <article className={`timeline-item timeline-item-${index % 2}`} key={`${item.category}-${index}`}><div className="timeline-meta"><span className="timeline-icon">✳</span><strong>{item.organization}</strong><small>{item.period}</small></div><div className="timeline-card"><span>{item.category}</span><h3>{item.role}</h3><p>{item.description}</p></div></article>)}</div><p className="section-note">Add your real roles and dates in <code>src/data/portfolio.ts</code>.</p></div></section>
    </main>
    <footer className="site-footer" id="footer">
      <FooterShader/>
      <section className="footer-invitation" id="contact" aria-labelledby="contact-title">
        <div className="footer-invitation-inner">
          <h2 className="contact-name" id="contact-title">GEHAN <span>MALSHAN.</span></h2>
          <p className="contact-intro">I build thoughtful software and enjoy working with people who care about the details. Let’s connect.</p>
          <div className="footer-contact-row">
            {contactPlatforms.slice(0, 2).map(({ label, href, Icon }) =>
              <ContactIcon label={label} href={href} Icon={Icon} variant="footer" onMissing={onMissingContact} key={label}/>)}
            <TacticalLink label="Contact me" href={portfolio.email ? `mailto:${portfolio.email}` : undefined} onClick={() => onMissingContact('Email')}/>
            {contactPlatforms.slice(2).map(({ label, href, Icon }) =>
              <ContactIcon label={label} href={href} Icon={Icon} variant="footer" onMissing={onMissingContact} key={label}/>)}
          </div>
          {!portfolio.email && <small className="contact-edit-note">Add your email and social links in <code>src/data/portfolio.ts</code> to connect these buttons.</small>}
          <small className="contact-copyright">© {new Date().getFullYear()} Gehan Malshan</small>
        </div>
      </section>
    </footer>
    {contactNotice && <div className="contact-notice" role="status">{contactNotice}</div>}
    <BackToTop/>
  </>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>)
