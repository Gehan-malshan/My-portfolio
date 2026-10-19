import FlippingWordSwap from './components/ui/flipping-word-swap'

const logos = [
  ['JavaScript', 'javascript'],
  ['TypeScript', 'typescript'],
  ['React', 'react'],
  ['HTML5', 'html5'],
  ['CSS3', 'css3'],
  ['Python', 'python'],
  ['C#', 'csharp'],
  ['Angular', 'angular'],
  ['AWS', 'amazonaws'],
  ['Apache Kafka', 'apachekafka'],
  ['Bootstrap', 'bootstrap'],
  ['C', 'c'],
  ['Docker', 'docker'],
  ['Express', 'express'],
  ['Figma', 'figma'],
  ['Git', 'git'],
  ['GitLab', 'gitlab'],
  ['GitHub', 'github'],
  ['IntelliJ IDEA', 'intellijidea'],
  ['Java', 'java'],
  ['Jira', 'jira'],
  ['Kubernetes', 'kubernetes'],
  ['Linux', 'linux'],
  ['Material UI', 'mui'],
  ['MongoDB', 'mongodb'],
  ['MySQL', 'mysql'],
  ['Next.js', 'nextdotjs'],
  ['Nginx', 'nginx'],
  ['npm', 'npm'],
  ['Node.js', 'nodedotjs'],
  ['PostgreSQL', 'postgresql'],
  ['Redis', 'redis'],
  ['Spring', 'spring'],
  ['VS Code', 'vscode'],
  ['ESLint', 'eslint'],
  ['Solidity', 'solidity'],
  ['Ubuntu', 'ubuntu'],
  ['Vercel', 'vercel'],
  ['WebStorm', 'webstorm'],
  ['Apache', 'apache'],
  ['Selenium', 'selenium'],
  ['.NET', 'dotnet'],
  ['Oracle', 'oracle'],
  ['Prometheus', 'prometheus'],
  ['Microsoft Azure', 'azure'],
  ['Zed', 'zedindustries'],
  ['GitHub Actions', 'githubactions'],
  ['Terraform', 'terraform'],
] as const

const loopRows = [logos.slice(0, 24), logos.slice(24)]

export default function TechLogos() {
  return <section className="section tech-section" id="toolkit" aria-labelledby="toolkit-title">
    <div className="section-inner">
      <h2 id="toolkit-title"><FlippingWordSwap word1="Technologies" stagger={28}/></h2>
      <div className="tech-loop-stack">
        {loopRows.map((row, index) => <LogoLoop
          key={index}
          logos={row.map(([name, icon]) => ({ src: `/tech/${icon}.svg`, alt: name, title: name }))}
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
import LogoLoop from './LogoLoop'

