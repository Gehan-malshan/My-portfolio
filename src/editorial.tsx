import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router'
import { Dribbble, Github, Linkedin, Mail, type LucideIcon } from 'lucide-react'
import GridTrails from './GridTrails'
import SplashCursor from './SplashCursor'
import FooterShader from './FooterShader'
import TacticalLink from './TacticalLink'
import PagePreloader from './PagePreloader'
import TechLogos from './TechLogos'
import PageScrollBlur from './PageScrollBlur'
import BackToTop from './BackToTop'
import BlurredHeroTicker from './BlurredHeroTicker'
import EducationProgress from './EducationProgress'
import GithubCalendar from './GithubCalendar'
import SpiralTechGallery from './SpiralTechGallery'
import FlippingWordSwap from './components/ui/flipping-word-swap'
import { portfolio } from './data/portfolio'
import './editorial.css'

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]) })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
const links = [['About', '#about'], ['Technology', '#toolkit'], ['Activity', '#activity'], ['Education', '#education'], ['Volunteering', '#volunteering'], ['Contact', '#contact']]
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
    const hero = document.querySelector<HTMLElement>('.hero')
    const about = document.querySelector<HTMLElement>('.about-feature')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      const scale = window.innerWidth <= 700 ? 0.5 : 1
      const offset = (element: HTMLElement | null, distance: number) => {
        if (!element) return '0px'
        const rect = element.getBoundingClientRect()
        const travel = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        return `${((Math.min(1, Math.max(0, travel)) - 0.5) * distance * scale).toFixed(1)}px`
      }
      if (hero) {
        const progress = reducedMotion.matches ? 0 : Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight))
        hero.style.setProperty('--hero-parallax', progress.toFixed(3))
      }
      about?.style.setProperty('--about-parallax', reducedMotion.matches ? '0px' : offset(about, 170))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reducedMotion.addEventListener('change', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reducedMotion.removeEventListener('change', schedule)
    }
  }, [])
  React.useEffect(() => {
    if (!contactNotice) return
    const timeout = window.setTimeout(() => setContactNotice(''), 4000)
    return () => window.clearTimeout(timeout)
  }, [contactNotice])
  const onMissingContact = (label: string) => setContactNotice(`${label} contact details are coming soon.`)
  return <>
    <PagePreloader/>
    <SplashCursor colors={['#ffffff']} rainbow={false} colorSpeed={0.2} force={0.15} shading={0.21} swirl={7} momentum={0.4} intensity={0.7} size={0.55} trail={0.5} intro={false} quality="medium" zIndex={25} excludeSelector=".hero"/>
    <PageScrollBlur/>
    <nav className="toc-nav" aria-label="Main navigation">{links.map(([label, href]) => <a href={href} key={href} aria-label={label}><span className="toc-label" aria-hidden="true">{label}</span><span className="toc-line" aria-hidden="true"/></a>)}</nav>
    <main id="top">
      <section className="hero hero-with-portrait" aria-label="Introduction">
        <div className="hero-grid" aria-hidden="true"><GridTrails background="#000000" lineColor="#242424" accent="#ffffff" cellSize={72} lights={0} trailLength={4} glow={86} hover={115}/></div>
        <div className="hero-portrait"><img src="/gehan-color-cutout.png" alt="Portrait of Gehan Malshan" fetchPriority="high"/></div>
        <div className="hero-copy">
          <BlurredHeroTicker words={portfolio.heroWords}/>
          <div className="hero-intro">
            <p className="hero-identity">Hi, I’m {portfolio.name}<br/>{portfolio.role}</p>
            <p className="hero-description">{portfolio.intro}</p>
          </div>
        </div>
        <div className="hero-bottom-row"><nav className="hero-socials" aria-label="Social links">
          {[contactPlatforms[3], contactPlatforms[2], contactPlatforms[1], contactPlatforms[0]].map(({ label, href, Icon }) =>
            <ContactIcon label={label} href={href} Icon={Icon} variant="hero" onMissing={onMissingContact} key={label}/>)}
        </nav><TacticalLink href="#contact" label="Contact me"/></div>
      </section>
      <section className="section about-feature" id="about" aria-labelledby="about-title">
        <div className="about-feature-inner">
          <SpiralTechGallery/>
          <div className="about-copy">
            <span className="about-eyebrow">Know about me</span>
            <h2 id="about-title">Curious about code and <em><FlippingWordSwap word1="everything around it." stagger={25}/></em></h2>
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
      <GithubCalendar username={portfolio.githubUsername}/>
      <section className="section education" id="education"><div className="section-inner"><h2><FlippingWordSwap word1="Education." stagger={35}/></h2><p className="section-intro">My academic path, qualifications, and continued learning.</p><EducationProgress items={portfolio.education}/><p className="section-note">Update these education steps in <code>src/data/portfolio.ts</code>.</p><div className="cv-row"><div><h3><FlippingWordSwap word1="Resume." stagger={35}/></h3><p>A starter CV is ready to download and replace with your finished version.</p></div><TacticalLink href={portfolio.cvPath} label={portfolio.cvIsTemplate ? 'Download CV template' : 'Download my CV'} download/></div></div></section>
      <section className="section volunteering" id="volunteering"><div className="section-inner"><h2><FlippingWordSwap word1="Volunteering." stagger={32}/></h2><p className="section-intro">The communities, teams, and initiatives I contribute to.</p><div className="timeline">{portfolio.volunteering.map((item, index) => <article className={`timeline-item timeline-item-${index % 2}`} key={`${item.category}-${index}`}><div className="timeline-meta"><span className="timeline-icon">✳</span><strong>{item.organization}</strong><small>{item.period}</small></div><div className="timeline-card"><span>{item.category}</span><h3><FlippingWordSwap word1={item.role} stagger={24}/></h3><p>{item.description}</p></div></article>)}</div><p className="section-note">Add your real roles and dates in <code>src/data/portfolio.ts</code>.</p></div></section>
    </main>
    <div className="site-footer contact-shell">
      <FooterShader/>
      <section className="footer-invitation" id="contact" aria-labelledby="contact-title">
        <div className="footer-invitation-inner">
          <h2 className="contact-name" id="contact-title"><span className="contact-name-part"><FlippingWordSwap word1="GEHAN" stagger={28}/></span> <span className="contact-name-part"><FlippingWordSwap word1="MALSHAN." stagger={28}/></span></h2>
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
    </div>
    {contactNotice && <div className="contact-notice" role="status">{contactNotice}</div>}
    <BackToTop/>
  </>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>)
