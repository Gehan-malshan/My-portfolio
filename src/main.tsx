import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router'
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Braces, Code2, Github, Linkedin, Mail, Menu, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { portfolio } from './data/portfolio'
import './style.css'

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const routeTree = rootRoute.addChildren([indexRoute])
const router = createRouter({ routeTree })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }

const nav = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Volunteering', href: '#volunteering' },
  { label: 'Contact', href: '#contact' },
]

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    if (!portfolio.email) return
    await navigator.clipboard.writeText(portfolio.email)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Gehan Malshan, back to top"><span className="brand-mark">gm<span>.</span></span><span className="brand-name">GEHAN<br/>MALSHAN</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
      <a className="header-cta" href="#contact">Let’s talk <ArrowUpRight size={15}/></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={17}/></a>)}</nav>}

    <main id="top">
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse"/> OPEN TO LEARNING & COLLABORATION <span className="eyebrow-line"/></div>
          <h1 id="hero-title">Hi, I’m <span>Gehan.</span><br/>I build for<br/><em>what’s next.</em></h1>
          <p>{portfolio.intro}</p>
          <div className="hero-actions"><a className="button button-primary" href="#projects">Explore my work <ArrowUpRight size={18}/></a><a className="text-link" href="#about">More about me <ArrowDown size={16}/></a></div>
          <div className="hero-foot"><span>SOFTWARE ENGINEERING UNDERGRADUATE</span><span>BASED IN {portfolio.location.toUpperCase()}</span></div>
        </div>
        <div className="hero-visual">
          <div className="portrait-frame"><img src="/gehan-portrait.png" alt="Portrait of Gehan Malshan" fetchPriority="high"/><div className="portrait-sheen"/></div>
          <div className="orbit-label orbit-label-top"><Sparkles size={17}/><span>Curiosity led.<br/>Purpose driven.</span></div>
          <div className="orbit-label orbit-label-bottom"><span className="asterisk">✳</span><span>DESIGN <b>×</b> DEVELOPMENT</span></div>
          <div className="hero-index">01 / 05</div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="marquee-track">BUILD • LEARN • CREATE • CONTRIBUTE • BUILD • LEARN • CREATE • CONTRIBUTE •</div></div>

      <section className="section about shell" id="about">
        <div className="section-kicker"><span>01 / ABOUT</span><span>GET TO KNOW ME</span></div>
        <div className="about-grid"><div><h2>Always curious.<br/><span>Always building.</span></h2><div className="about-symbol"><Braces strokeWidth={1.3}/></div></div><div className="about-body"><p className="lead">{portfolio.about}</p><p>Right now, I’m growing my craft through study, hands-on projects, and opportunities to contribute with others. I care about the details that make software feel clear and useful.</p><div className="education"><div className="education-icon"><Code2 size={22}/></div><div><span className="mini-label">EDUCATION</span><strong>{portfolio.education.degree}</strong><small>{portfolio.education.institution || portfolio.education.note}</small></div><span className="education-period">{portfolio.education.period}</span></div></div></div>
      </section>

      <section className="section projects-section" id="projects"><div className="shell"><div className="section-kicker"><span>02 / SELECTED WORK</span><span>IDEAS IN ACTION</span></div><div className="section-heading"><h2>Projects<span className="orange-dot">.</span></h2><p>A space for the things I’ve made and the problems I’m learning to solve.</p></div><div className="projects-grid">{portfolio.projects.map(project => <article className={`project-card ${project.accent}`} key={project.number}><div className="project-top"><span>{project.number} / {project.category}</span>{project.url ? <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><ArrowUpRight size={23}/></a> : <span className="project-arrow"><ArrowUpRight size={23}/></span>}</div><div className="project-art" aria-hidden="true"><div className="art-window"><div className="art-window-top"><i/><i/><i/></div><div className="art-window-body"><div className="art-line wide"/><div className="art-line"/><div className="art-blocks"><span/><span/><span/></div></div></div><div className="art-orb"/></div><div className="project-content"><div className="project-status">{project.placeholder ? 'READY FOR YOUR STORY' : 'FEATURED WORK'}</div><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div><p className="editor-note">These are starter spaces. Add your real projects in <code>src/data/portfolio.ts</code>.</p></div></section>

      <section className="section skills shell" id="skills"><div className="section-kicker"><span>03 / MY APPROACH</span><span>GROWING EVERY DAY</span></div><div className="skills-grid"><div><h2>Curiosity is<br/>my <em>toolkit.</em></h2><p>I’m interested in the full journey from an idea to something people can actually use.</p></div><div className="interest-list">{portfolio.interests.map((interest, index) => <div className="interest-row" key={interest}><span>0{index+1}</span><strong>{interest}</strong><ArrowUpRight size={19}/></div>)}</div></div></section>

      <section className="section volunteering-section" id="volunteering"><div className="shell"><div className="section-kicker"><span>04 / BEYOND CODE</span><span>SHOWING UP FOR OTHERS</span></div><div className="section-heading"><h2>Volunteering<span className="orange-dot">.</span></h2><p>Teams, communities, and initiatives that shape how I grow.</p></div><div className="volunteer-grid">{portfolio.volunteering.map((item, index) => <article className="volunteer-card" key={`${item.category}-${index}`}><div className="volunteer-card-top"><span className="category-pill">{item.category}</span><span>{item.period}</span></div><div><h3>{item.role}</h3><span className="volunteer-org">{item.organization}</span><p>{item.description}</p></div><ArrowUpRight size={22} className="volunteer-arrow"/></article>)}</div><p className="editor-note">Replace these starter roles with your own volunteering experience.</p></div></section>

      <section className="resume-band shell"><div><span className="mini-label">THE SHORT VERSION</span><h2>Want the full story?</h2><p>Download a starter CV now. Replace it with your final PDF when it’s ready.</p></div><a className="button button-dark" href={portfolio.cvPath} download>{portfolio.cvIsTemplate ? 'Download CV template' : 'Download my CV'} <ArrowDownToLine size={18}/></a></section>

      <section className="contact-section" id="contact"><div className="shell"><div className="section-kicker"><span>05 / CONTACT</span><span>LET’S MAKE SOMETHING GOOD</span></div><div className="contact-grid"><div><h2>Have an idea?<br/><em>Let’s connect.</em></h2><p>I’m always open to interesting conversations, collaborations, and opportunities to learn.</p></div><div className="contact-actions">{portfolio.email ? <><a className="contact-email" href={`mailto:${portfolio.email}`}>{portfolio.email}<ArrowUpRight/></a><button className="copy-button" onClick={copyEmail} type="button">{copied ? 'Email copied' : 'Copy email'}</button></> : <div className="contact-prompt"><Mail size={26}/><strong>Contact details coming soon</strong><span>Add your email and profile links in the content file to make this section yours.</span></div>}<div className="socials">{portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={19}/> GitHub <ArrowUpRight size={14}/></a>}{portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={19}/> LinkedIn <ArrowUpRight size={14}/></a>}{!portfolio.github && !portfolio.linkedin && <span>GITHUB & LINKEDIN LINKS CAN BE ADDED HERE</span>}</div></div></div><footer><a href="#top" className="footer-brand">gm<span>.</span></a><span>© {new Date().getFullYear()} {portfolio.name}. Built with care.</span><a href="#top">BACK TO TOP ↑</a></footer></div></section>
    </main>
  </>
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>)
