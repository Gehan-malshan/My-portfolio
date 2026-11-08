import { useEffect, useMemo, useState } from 'react'
import TitleShine from './components/ui/TitleShine'
import TacticalLink from './TacticalLink'
import './GithubCalendar.css'

type ContributionDay = {
  contributionCount: number
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'
  date: string
}

type ContributionData = {
  contributions: ContributionDay[][]
  totalContributions: number
  startDate: string
  endDate: string
}

type ApiDay = { date: string; count: number; level: number }
type ApiResponse = { contributions: ApiDay[]; total: Record<string, number> }

function periodStart() {
  const today = new Date()
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  start.setUTCFullYear(start.getUTCFullYear() - 1)
  start.setUTCDate(start.getUTCDate() + 1)
  return start
}

function periodEnd() {
  const today = new Date()
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
}

function normalizeContributions(result: ApiResponse): ContributionData {
  if (!Array.isArray(result.contributions) || result.contributions.length === 0) throw new Error('GitHub activity is unavailable right now.')
  const byDate = new Map(result.contributions.map(day => [day.date, day]))
  const dates = result.contributions.map(day => day.date).sort()
  const firstDate = dates[0]
  const lastDate = dates[dates.length - 1]
  const weeks = emptyWeeks(new Date(`${firstDate}T00:00:00Z`), new Date(`${lastDate}T00:00:00Z`)).map(week => week.map(day => {
    const contribution = day.date >= firstDate && day.date <= lastDate ? byDate.get(day.date) : undefined
    const level = Math.max(0, Math.min(4, Number(contribution?.level ?? 0)))
    const levels: ContributionDay['contributionLevel'][] = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
    return { ...day, contributionCount: Number(contribution?.count ?? 0), contributionLevel: levels[level] }
  }))
  return { contributions: weeks, totalContributions: Number(result.total?.lastYear ?? result.contributions.reduce((total, day) => total + Number(day.count || 0), 0)), startDate: firstDate, endDate: lastDate }
}

const levelClass: Record<ContributionDay['contributionLevel'], string> = {
  NONE: 'level-0',
  FIRST_QUARTILE: 'level-1',
  SECOND_QUARTILE: 'level-2',
  THIRD_QUARTILE: 'level-3',
  FOURTH_QUARTILE: 'level-4',
}

function emptyWeeks(from = periodStart(), end = periodEnd()) {
  const start = new Date(from)
  start.setUTCDate(start.getUTCDate() - start.getUTCDay())
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

function monthLabels(weeks: ContributionDay[][], firstDate: string, lastDate: string) {
  const start = new Date(`${firstDate}T00:00:00Z`)
  const end = new Date(`${lastDate}T00:00:00Z`)
  const monthCount = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth() + 1
  return Array.from({ length: monthCount }, (_, monthOffset) => {
    const monthStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + monthOffset, 1))
    const month = monthStart.toISOString().slice(0, 7)
    return {
      index: weeks.findIndex(week => week.some(day => day.date.startsWith(month) && day.date >= firstDate && day.date <= lastDate)),
      label: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(monthStart),
    }
  }).filter(({ index }) => index >= 0)
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
    const endpoint = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      ? `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
      : `/api/github-contributions?username=${encodeURIComponent(username)}`
    fetch(endpoint, { signal: controller.signal, cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('GitHub activity is unavailable right now.')
        const result = await response.json() as ApiResponse
        return normalizeContributions(result)
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
  const firstDate = data?.startDate ?? periodStart().toISOString().slice(0, 10)
  const lastDate = data?.endDate ?? periodEnd().toISOString().slice(0, 10)
  const labels = monthLabels(weeks, firstDate, lastDate)
  const summary = data
    ? `${total.toLocaleString()} contributions in the last year`
    : loading ? 'Loading GitHub activity…'
      : error || 'GitHub contributions coming soon.'

  return (
    <section className="section github-activity" id="activity" aria-labelledby="activity-title" style={{ '--calendar-weeks': weeks.length } as React.CSSProperties}>
      <div className="section-inner">
        <p className="github-activity-eyebrow">Developer insights</p>
        <h2 id="activity-title"><TitleShine>GitHub Activity</TitleShine></h2>
        <div className="github-calendar-scroll">
          <div className="github-calendar" role="img" aria-busy={loading} aria-label={validUsername ? `GitHub contribution calendar for ${username}: ${summary}` : 'GitHub contribution calendar awaiting a username'}>
            <div className="github-calendar-months" aria-hidden="true">
              {labels.map(({ index, label }) => <span key={index} style={{ gridColumnStart: index + 1 }}>{label}</span>)}
            </div>
            <div className="github-calendar-weeks" aria-hidden="true">
              {weeks.map((week, index) => <div className="github-calendar-week" key={week[0]?.date ?? index}>
                {week.map(day => <span
                  className={`github-calendar-day ${data ? levelClass[day.contributionLevel] : 'level-0'}${day.date < firstDate || day.date > lastDate ? ' is-outside-period' : ''}`}
                  key={day.date}
                  title={day.date < firstDate || day.date > lastDate ? undefined : data ? `${day.contributionCount} contributions on ${day.date}` : day.date}
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
        {validUsername && <TacticalLink href={`https://github.com/${username}`} label={`View @${username} on GitHub ↗`} newTab/>}
      </div>
    </section>
  )
}
