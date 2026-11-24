const CONTACT_MESSAGES_KEY = 'portfolio-contact-messages'
const MAX_MESSAGES = 100

export function getContactMessages() {
  try {
    const raw = localStorage.getItem(CONTACT_MESSAGES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore storage errors */
  }
  return []
}

export function saveContactMessage(entry) {
  try {
    const existing = getContactMessages()
    const item = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sentAt: new Date().toISOString(),
      replies: [],
      ...entry,
    }
    const updated = [item, ...existing].slice(0, MAX_MESSAGES)
    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(updated))
    return item
  } catch {
    return null
  }
}

export function addContactMessageReply(messageId, { text, sender = 'admin', via = 'chat' }) {
  try {
    const existing = getContactMessages()
    const reply = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender,
      text,
      via,
      sentAt: new Date().toISOString(),
    }
    const updated = existing.map((msg) => {
      if (msg.id !== messageId) return msg
      const prevReplies = Array.isArray(msg.replies) ? msg.replies : []
      return {
        ...msg,
        replies: [...prevReplies, reply],
        lastReplyAt: reply.sentAt,
      }
    })
    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return getContactMessages()
  }
}

export function clearContactMessages() {
  try {
    localStorage.removeItem(CONTACT_MESSAGES_KEY)
  } catch {
    /* ignore */
  }
}
