import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router'
import { Github, Linkedin, Mail, type LucideIcon } from 'lucide-react'
import GridTrails from './GridTrails'
import SplashCursor from './SplashCursor'
import ContactFooter from './ContactFooter'
import TacticalLink from './TacticalLink'
import PagePreloader from './PagePreloader'
import TechLogos from './TechLogos'
import PageScrollBlur from './PageScrollBlur'
import BackToTop from './BackToTop'
import ScrollReveals from './ScrollReveals'
import BlurredHeroTicker from './BlurredHeroTicker'
import EducationProgress from './EducationProgress'
import GithubCalendar from './GithubCalendar'
import SpiralTechGallery from './SpiralTechGallery'
import ProjectShowcase from './ProjectShowcase'
import ProjectDetail from './ProjectDetail'
import AboutPage from './AboutPage'
import VolunteeringMilestones from './VolunteeringMilestones'
import TitleShine from './components/ui/TitleShine'
import { portfolio } from './data/portfolio'
import './tailwind.css'
import './editorial.css'

const rootRoute = createRootRoute({ component: () => <><Outlet/><BackToTop/><ScrollReveals/></> })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage })
const projectRoute = createRoute({ getParentRoute: () => rootRoute, path: '/projects/$slug', component: ProjectDetailRoute })
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute, aboutRoute, projectRoute]) })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
function ProjectDetailRoute() { const { slug } = projectRoute.useParams(); return <ProjectDetail slug={slug}/> }
const links = [['About', '#about'], ['Projects', '#projects'], ['Technology', '#toolkit'], ['Activity', '#activity'], ['Education', '#education'], ['Volunteering', '#volunteering'], ['Contact', '#contact']]
const contactPlatforms = [
  { label: 'GitHub', href: portfolio.github, Icon: Github },
  { label: 'Email', href: portfolio.email ? `mailto:${portfolio.email}` : '', Icon: Mail },
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
  const [portraitColor, setPortraitColor] = React.useState(false)
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
        <div className={`hero-portrait${portraitColor ? ' is-color' : ''}`} role="button" tabIndex={0} aria-label="Toggle portrait color" aria-pressed={portraitColor} onClick={() => setPortraitColor(value => !value)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPortraitColor(value => !value) } }}><img src="/gehan-color-cutout.png" alt="Portrait of Gehan Malshan" fetchPriority="high"/></div>
        <div className="hero-copy">
          <BlurredHeroTicker words={portfolio.heroWords}/>
          <div className="hero-intro">
            <p className="hero-identity">Hi, I’m {portfolio.name}<br/>{portfolio.role}</p>
            <p className="hero-description">{portfolio.intro}</p>
          </div>
        </div>
        <div className="hero-bottom-row"><nav className="hero-socials" aria-label="Social links">
          {[contactPlatforms[2], contactPlatforms[1], contactPlatforms[0]].map(({ label, href, Icon }) =>
            <ContactIcon label={label} href={href} Icon={Icon} variant="hero" onMissing={onMissingContact} key={label}/>)}
        </nav><TacticalLink href="#contact" label="Contact me"/></div>
      </section>
      <section className="section about-feature" id="about" aria-labelledby="about-title">
        <div className="about-feature-inner">
          <SpiralTechGallery/>
          <div className="about-copy">
            <span className="about-eyebrow">Know about me</span>
            <h2 id="about-title"><TitleShine>Building software</TitleShine>{' '}<em><TitleShine>from code to cloud</TitleShine></em></h2>
            <p>{portfolio.about}</p>
            <p>{portfolio.aboutMore}</p>
            <div className="about-actions"><TacticalLink label="More about me" onClick={() => void router.navigate({ to: '/about' })}/></div>
            <nav className="about-socials hero-socials" aria-label="About social links">
              {[contactPlatforms[0], contactPlatforms[2]].map(({ label, href, Icon }) =>
                <ContactIcon label={label} href={href} Icon={Icon} variant="hero" onMissing={onMissingContact} key={label}/>)}
            </nav>
          </div>
        </div>
      </section>
      <ProjectShowcase/>
      <TechLogos/>
      <GithubCalendar username={portfolio.githubUsername}/>
      <section className="section education" id="education"><div className="section-inner"><h2><TitleShine>Education</TitleShine></h2><p className="section-intro">The academic foundation behind my software, systems, and cloud work.</p><EducationProgress items={portfolio.education}/><div className="cv-row"><div><h3><TitleShine>Resume</TitleShine></h3><p>My CV will be available here soon.</p></div><TacticalLink label="Download CV" ariaLabel="CV will be available soon"/></div></div></section>
      <section className="section volunteering" id="volunteering"><div className="section-inner"><h2><TitleShine>Volunteering</TitleShine></h2><p className="section-intro">The communities, teams, and initiatives I contribute to.</p><VolunteeringMilestones items={portfolio.volunteering}/></div></section>
    </main>
    <ContactFooter/>
    {contactNotice && <div className="contact-notice" role="status">{contactNotice}</div>}
  </>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>)
