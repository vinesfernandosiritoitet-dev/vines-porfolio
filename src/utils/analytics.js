const VISIT_LOGS_KEY = 'portfolio-visit-logs'
const LAST_VISIT_TS_KEY = 'portfolio-last-visit-ts'
const MAX_LOGS = 100

function detectDevice() {
  if (typeof navigator === 'undefined') return 'Desktop'
  const ua = navigator.userAgent || ''
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

function detectBrowser() {
  if (typeof navigator === 'undefined') return 'Browser'
  const ua = navigator.userAgent || ''
  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome'
  if (ua.includes('Firefox/')) return 'Firefox'
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari'
  return 'Browser'
}

export function getVisitStats() {
  let logs = []
  try {
    const raw = localStorage.getItem(VISIT_LOGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) logs = parsed
    }
  } catch {
    /* ignore storage errors */
  }

  const todayStr = new Date().toDateString()
  const todayVisits = logs.filter((v) => {
    try {
      return new Date(v.visitedAt).toDateString() === todayStr
    } catch {
      return false
    }
  }).length

  return {
    totalVisits: logs.length,
    todayVisits,
    logs,
  }
}

export function recordPortfolioVisit() {
  try {
    const now = Date.now()
    const lastTs = Number(sessionStorage.getItem(LAST_VISIT_TS_KEY) || 0)
    // Hindari pencatatan ganda dari React StrictMode pada mount yang sama
    if (now - lastTs < 1500) return
    sessionStorage.setItem(LAST_VISIT_TS_KEY, String(now))

    const { logs } = getVisitStats()
    const entry = {
      id: `visit-${now}-${Math.random().toString(36).slice(2, 6)}`,
      visitedAt: new Date(now).toISOString(),
      device: detectDevice(),
      browser: detectBrowser(),
    }

    const updated = [entry, ...logs].slice(0, MAX_LOGS)
    localStorage.setItem(VISIT_LOGS_KEY, JSON.stringify(updated))
  } catch {
    /* ignore storage errors */
  }
}

export function clearVisitLogs() {
  try {
    localStorage.removeItem(VISIT_LOGS_KEY)
  } catch {
    /* ignore */
  }
}
