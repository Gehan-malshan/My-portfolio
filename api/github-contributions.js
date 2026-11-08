export default async function handler(request, response) {
  const username = String(request.query?.username ?? '')
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) {
    return response.status(400).json({ error: 'Invalid GitHub username' })
  }

  try {
    const github = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: { Accept: 'text/html', 'User-Agent': 'GehanPortfolio/1.0' },
    })
    if (!github.ok) throw new Error(`GitHub returned ${github.status}`)
    const html = await github.text()
    const total = Number(html.match(/<h2[^>]*id="js-contribution-activity-description"[^>]*>\s*([\d,]+)/)?.[1]?.replace(/,/g, ''))
    const tooltips = new Map()
    for (const match of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)) {
      const id = match[1].match(/\bfor="([^"]+)"/)?.[1]
      if (id) tooltips.set(id, Number(match[2].match(/([\d,]+) contributions? on/)?.[1]?.replace(/,/g, '') ?? 0))
    }
    const contributions = []
    for (const match of html.matchAll(/<td\b([^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*)>/g)) {
      const attributes = match[1]
      const date = attributes.match(/\bdata-date="([^"]+)"/)?.[1]
      const id = attributes.match(/\bid="([^"]+)"/)?.[1]
      const level = Number(attributes.match(/\bdata-level="(\d)"/)?.[1] ?? 0)
      if (date) contributions.push({ date, count: tooltips.get(id) ?? 0, level })
    }
    if (!Number.isFinite(total) || contributions.length < 350) throw new Error('GitHub calendar markup changed')
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    return response.status(200).json({ contributions, total: { lastYear: total } })
  } catch (error) {
    return response.status(502).json({ error: error instanceof Error ? error.message : 'GitHub activity unavailable' })
  }
}
