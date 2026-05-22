import { ref } from 'vue'

// Persistent session ID for funnel tracking
function getSessionId() {
  let id = sessionStorage.getItem('dp_session')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('dp_session', id)
  }
  return id
}

const sessionId = ref(getSessionId())

export function useTracking() {
  function track(event, metadata = null) {
    fetch('/api/v1/events', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ session_id: sessionId.value, event, metadata }),
    }).catch(() => {})
  }

  return { track, sessionId }
}
