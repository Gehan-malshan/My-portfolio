import { useEffect, useMemo, useState } from 'react'
import FlippingWordSwap from './components/ui/flipping-word-swap'
import './GithubCalendar.css'

type ContributionDay = {
  contributionCount: number
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'
  date: string
}

type ContributionData = {
  contributions: ContributionDay[][]
  totalContributions: number
}

const levelClass: Record<ContributionDay['contributionLevel'], string> = {
  NONE: 'level-0',
  FIRST_QUARTILE: 'level-1',
  SECOND_QUARTILE: 'level-2',
  THIRD_QUARTILE: 'level-3',
  FOURTH_QUARTILE: 'level-4',
}

function emptyWeeks() {
  const today = new Date()
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay())
  const weeks: ContributionDay[][] = []

  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 7)) {
    weeks.push(Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(cursor)
      date.setUTCDate(date.getUTCDate() + dayIndex)
      return { date: date.toISOString().slice(0, 10), contributionCount: 0, contributionLevel: 'NONE' as const }
    }))
  }
  return weeks
}

function monthLabels(weeks: ContributionDay[][]) {
  const labels: { index: number; label: string }[] = []
  let previousMonth = -1
  weeks.forEach((week, index) => {
    const first = week[0]
    if (!first) return
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth()
    if (month !== previousMonth) {
      if (index > 0) labels.push({ index, label: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(`${first.date}T00:00:00Z`)) })
      previousMonth = month
    }
  })
  return labels
}

export default function GithubCalendar({ username }: { username: string }) {
  const [data, setData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const placeholderWeeks = useMemo(emptyWeeks, [])
  const validUsername = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)

  useEffect(() => {
    if (!validUsername) {
      setData(null)
      setError('')
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetch(`https://github-contributions-api.kawarimidoll.deno.net/${encodeURIComponent(username)}.json`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('GitHub activity is unavailable right now.')
        const result: unknown = await response.json()
        if (!result || typeof result !== 'object' || !('contributions' in result) || !Array.isArray(result.contributions)) {
          throw new Error('GitHub activity is unavailable right now.')
        }
        return result as ContributionData
      })
      .then(setData)
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        setData(null)
        setError(reason instanceof Error ? reason.message : 'GitHub activity is unavailable right now.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [username, validUsername])

  const weeks = data?.contributions ?? placeholderWeeks
  const total = Number(data?.totalContributions ?? 0)
  const labels = monthLabels(weeks)
  const summary = data
    ? `${total.toLocaleString()} contributions in the last year`
    : loading ? 'Loading GitHub activity…'
      : error || 'GitHub contributions coming soon.'

  return (
    <section className="section github-activity" id="activity" aria-labelledby="activity-title">
      <div className="section-inner">
        <p className="github-activity-eyebrow">Developer insights</p>
        <h2 id="activity-title"><FlippingWordSwap word1="GitHub Activity." className="flip-heading-shimmer" stagger={28}/></h2>
        <div className="github-calendar-scroll">
          <div className="github-calendar" style={{ '--calendar-weeks': weeks.length } as React.CSSProperties} role="img" aria-label={data ? `GitHub contribution calendar for ${username}: ${summary}` : 'GitHub contribution calendar awaiting a username'}>
            <div className="github-calendar-months" aria-hidden="true">
              {labels.map(({ index, label }) => <span key={index} style={{ gridColumnStart: index + 1 }}>{label}</span>)}
            </div>
            <div className="github-calendar-weeks" aria-hidden="true">
              {weeks.map((week, index) => <div className="github-calendar-week" key={week[0]?.date ?? index}>
                {week.map(day => <span
                  className={`github-calendar-day ${data ? levelClass[day.contributionLevel] : 'level-0'}`}
                  key={day.date}
                  title={data ? `${day.contributionCount} contributions on ${day.date}` : undefined}
                />)}
              </div>)}
            </div>
          </div>
        </div>
        <div className="github-calendar-bottom">
          <p aria-live="polite">{summary}</p>
          <div className="github-calendar-legend" aria-label="Contribution activity levels">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(level => <i className={`github-calendar-day level-${level}`} key={level} />)}
            <span>More</span>
          </div>
        </div>
        {validUsername && <a className="github-activity-profile" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">View @{username} on GitHub ↗</a>}
      </div>
    </section>
  )
}
