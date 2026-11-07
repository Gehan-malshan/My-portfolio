import TitleShine from './components/ui/TitleShine'
import LogoLoop from './LogoLoop'
import { darkTechnologyIcons, technologies } from './technologies'

const loopRows = [technologies.slice(0, 24), technologies.slice(24)]

export default function TechLogos() {
  return <section className="section tech-section" id="toolkit" aria-labelledby="toolkit-title">
    <div className="section-inner">
      <h2 id="toolkit-title"><TitleShine>Technologies</TitleShine></h2>
      <div className="tech-loop-stack">
        {loopRows.map((row, index) => <LogoLoop
          key={index}
          logos={row.map(([name, icon]) => ({ src: `/tech-png/${icon}.png`, alt: name, title: name, darkOnLight: darkTechnologyIcons.has(icon) }))}
          ariaLabel={`Technology logos, row ${index + 1}`}
          className="technology-loop"
          speed={index === 0 ? 72 : 64}
          direction={index === 0 ? 'left' : 'right'}
          logoHeight={48}
          gap={42}
          fadeOut
          muted={0.5}
          labels="hover"
          scaleOnHover
        />)}
      </div>
    </div>
  </section>
}

