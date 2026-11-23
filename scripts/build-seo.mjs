import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { portfolio } from '../src/data/portfolio.ts'

const origin = 'https://www.gehan.dev'
const dist = new URL('../dist/', import.meta.url)
const template = await readFile(new URL('index.html', dist), 'utf8')
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const absolute = path => `${origin}${path}`
const link = (path, label) => `<a href="${esc(path)}">${esc(label)}</a>`
const paragraph = value => `<p>${esc(value)}</p>`
const person = {
  '@type': 'Person', '@id': `${origin}/#gehan-malshan`, name: portfolio.name,
  url: `${origin}/`, image: absolute('/gehan-color-cutout.png'),
  sameAs: [portfolio.github, portfolio.linkedin],
  jobTitle: portfolio.role,
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Sri Jayewardenepura' },
  knowsAbout: ['Software Engineering', 'DevOps', 'Cloud Computing', 'Go', 'Kubernetes']
}

const pages = [
  {
    path: '/', title: 'Gehan Malshan | Software Engineering, DevOps & Cloud Portfolio',
    description: 'Gehan Malshan is an Information Technology undergraduate focused on software engineering, DevOps, and cloud infrastructure. Explore his projects, education, and experience.',
    image: '/og-preview.jpg',
    body: `<main><h1>${esc(portfolio.name)}</h1>${paragraph(portfolio.role)}${paragraph(portfolio.intro)}<h2>About Gehan</h2>${paragraph(portfolio.about)}${paragraph(portfolio.aboutMore)}${link('/about', 'More about Gehan Malshan')}<h2>Projects</h2><ul>${portfolio.projects.map(project => `<li>${link(`/projects/${project.slug}`, project.title)} — ${esc(project.description)}</li>`).join('')}</ul><h2>Education</h2><ul>${portfolio.education.map(item => `<li>${esc(item.title)} — ${esc(item.institution)}</li>`).join('')}</ul><h2>Connect</h2>${link(portfolio.github, 'GitHub')} ${link(portfolio.linkedin, 'LinkedIn')} <a href="mailto:${esc(portfolio.email)}">Email Gehan</a></main>`,
    schema: [
      { '@type': 'WebSite', '@id': `${origin}/#website`, url: `${origin}/`, name: portfolio.name, alternateName: 'Gehan', description: 'Portfolio of Gehan Malshan', publisher: { '@id': person['@id'] } },
      { '@type': 'WebPage', '@id': `${origin}/#webpage`, url: `${origin}/`, name: 'Gehan Malshan Portfolio', isPartOf: { '@id': `${origin}/#website` }, about: { '@id': person['@id'] } },
      person,
    ],
  },
  {
    path: '/about', title: 'About Gehan Malshan | Education, Certifications & Volunteering',
    description: 'Learn about Gehan Malshan’s education at the University of Sri Jayewardenepura, cloud and DevOps certifications, awards, and volunteering.',
    image: '/og-preview.jpg',
    body: `<main><h1>About Gehan Malshan</h1>${paragraph(portfolio.about)}${paragraph(portfolio.aboutMore)}<h2>Education</h2>${portfolio.education.map(item => `<section><h3>${esc(item.title)}</h3>${paragraph(`${item.institution} · ${item.period}`)}${paragraph(item.description)}</section>`).join('')}<h2>Certifications</h2><ul>${portfolio.certifications.map(item => `<li>${esc(item.title)} — ${esc(item.issuer)}, ${esc(item.issued)}</li>`).join('')}</ul><h2>Awards</h2><ul>${portfolio.awards.map(item => `<li>${esc(item.title)} — ${esc(item.issuer)}</li>`).join('')}</ul><h2>Volunteering</h2>${portfolio.volunteering.map(item => `<section><h3>${esc(item.role)}</h3>${paragraph(`${item.organization} · ${item.period}`)}${paragraph(item.description)}</section>`).join('')}${link('/', 'Back to portfolio')}</main>`,
    schema: [{ '@type': 'ProfilePage', '@id': `${origin}/about#webpage`, url: `${origin}/about`, name: 'About Gehan Malshan', isPartOf: { '@id': `${origin}/#website` }, mainEntity: person }],
  },
  ...portfolio.projects.map(project => ({
    path: `/projects/${project.slug}`,
    title: `${project.title} | Project by Gehan Malshan`,
    description: `${project.description} Read Gehan Malshan’s project overview, approach, and outcome.`,
    image: project.image,
    body: `<main><h1>${esc(project.title)}</h1>${paragraph(project.category)}${paragraph(project.description)}<img src="${esc(project.image)}" alt="${esc(`${project.title} project`)}" width="900" loading="lazy"><h2>Overview</h2>${paragraph(project.overview)}<h2>Challenge</h2>${paragraph(project.challenge)}<h2>Approach</h2>${paragraph(project.approach)}<h2>Outcome</h2>${paragraph(project.outcome)}${project.repository ? link(project.repository, 'Source code') : ''}${project.url ? link(project.url, 'Case study') : ''}${project.prototype ? link(project.prototype, 'Prototype') : ''}<nav>${portfolio.projects.map(item => link(`/projects/${item.slug}`, item.title)).join(' ')} ${link('/', 'Back to portfolio')}</nav></main>`,
    schema: [{ '@type': 'CreativeWork', '@id': `${origin}/projects/${project.slug}#project`, url: absolute(`/projects/${project.slug}`), name: project.title, description: project.description, image: absolute(project.image), creator: { '@id': person['@id'] }, keywords: project.tags.join(', ') }],
  })),
]

for (const page of pages) {
  const url = absolute(page.path)
  const image = absolute(page.image)
  const tags = `<meta name="description" content="${esc(page.description)}" />
    <link rel="canonical" href="${esc(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Gehan Malshan" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': page.schema }).replace(/</g, '\\u003c')}</script>
    <title>${esc(page.title)}</title>`
  const html = template
    .replace(/    <meta name="description"[\s\S]*?    <title>[\s\S]*?<\/title>/, `    ${tags}`)
    .replace('<div id="root"></div>', `<div id="root"><div class="seo-initial-content" style="min-height:100vh;background:#080808;color:#f2f2f2;font:18px/1.6 Arial,sans-serif;padding:6rem max(2rem,10vw)">${page.body}</div></div>`)
  const path = page.path === '/' ? new URL('index.html', dist) : new URL(`${page.path.slice(1)}/index.html`, dist)
  await mkdir(new URL('./', path), { recursive: true })
  await writeFile(path, html)
}

await writeFile(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${esc(absolute(page.path))}</loc></url>`).join('\n')}\n</urlset>\n`)
console.log(`Generated SEO HTML for ${pages.length} routes and sitemap.xml`)
