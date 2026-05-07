const ANALYTICS_KEY = 'hanzi_analytics_events'

function readEvents() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeEvents(events) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-200)))
}

export function trackEvent(name, payload = {}) {
  try {
    const event = {
      name,
      payload,
      time: new Date().toISOString(),
      path: typeof window !== 'undefined' ? window.location.hash || window.location.pathname : '',
    }

    const events = readEvents()
    events.push(event)
    writeEvents(events)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanzi:track', { detail: event }))
    }

    if (import.meta.env.DEV) {
      console.log('[track]', event)
    }

    return event
  } catch (error) {
    console.error('trackEvent failed', error)
    return null
  }
}

export function getTrackedEvents() {
  return readEvents()
}

export function clearTrackedEvents() {
  localStorage.removeItem(ANALYTICS_KEY)
}

export function getEventCount(name) {
  return readEvents().filter(item => item.name === name).length
}
