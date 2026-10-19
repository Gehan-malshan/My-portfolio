import React from 'react'
import { ArrowUpRight } from 'lucide-react'

type NavigationLink = readonly [label: string, href: string]

export default function ModernNavbar({ links }: { links: readonly NavigationLink[] }) {
  const [open, setOpen] = React.useState(false)
  const navigationLinks = links.filter(([label]) => label !== 'Contact')

  React.useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const closeOnDesktop = () => {
      if (window.innerWidth > 700) setOpen(false)
    }

    window.addEventListener('keydown', closeWithEscape)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeWithEscape)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <header className="modern-navbar-shell">
      <nav className={`modern-navbar${open ? ' is-open' : ''}`} aria-label="Primary navigation">
        <a className="modern-navbar-brand" href="#top" onClick={closeMenu} aria-label="Gehan Malshan, back to top">
          GEHAN <span>MALSHAN</span>
        </a>
        <button
          className="modern-navbar-toggle"
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="modern-navbar-menu"
          onClick={() => setOpen((current) => !current)}
        >
          <span/><span/>
        </button>
        <div className="modern-navbar-menu" id="modern-navbar-menu">
          <div className="modern-navbar-links">
            {navigationLinks.map(([label, href]) => <a href={href} key={href} onClick={closeMenu}>{label}</a>)}
          </div>
          <a className="modern-navbar-cta" href="#contact" onClick={closeMenu}>
            Contact me <ArrowUpRight aria-hidden="true"/>
          </a>
        </div>
      </nav>
    </header>
  )
}
