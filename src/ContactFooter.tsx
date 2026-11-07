import { Github, Linkedin, Mail } from 'lucide-react'
import FooterShader from './FooterShader'
import TacticalLink from './TacticalLink'
import { portfolio } from './data/portfolio'

const contactLinks = [
  { label: 'GitHub', href: portfolio.github, Icon: Github },
  { label: 'Email', href: `mailto:${portfolio.email}`, Icon: Mail },
  { label: 'LinkedIn', href: portfolio.linkedin, Icon: Linkedin },
]

export default function ContactFooter() {
  return <footer className="site-footer contact-shell">
    <FooterShader/>
    <section className="footer-invitation" id="contact" aria-labelledby="contact-title">
      <div className="footer-invitation-inner">
        <h2 className="contact-name" id="contact-title">{portfolio.name}</h2>
        <p className="contact-intro">I build thoughtful software and enjoy working with people who care about the details. Let’s connect.</p>
        <div className="footer-contact-row">
          {contactLinks.map(({ label, href, Icon }) => <a className="contact-orb contact-icon" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'} aria-label={label} key={label}>
            <span className="contact-icon-tooltip" aria-hidden="true">{label}</span>
            <span className="contact-icon-surface"><span className="contact-icon-fill"/><Icon aria-hidden="true"/></span>
          </a>)}
          <TacticalLink label="Let’s connect" href={portfolio.linkedin} newTab/>
        </div>
        <small className="contact-copyright">© {new Date().getFullYear()} Gehan Malshan</small>
      </div>
    </section>
  </footer>
}
