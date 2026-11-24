/**
 * Utility Cryptographic Hash & Session Token menggunakan Web Crypto API
 * Menghindari penyimpanan dan pembandingan password dalam bentuk plain text.
 */

const SALT = 'vines-fernando-portfolio-salt-2026'

/**
 * Menghitung SHA-256 hash dari string dengan salt
 */
export async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message + SALT)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Membuat session token bertanda waktu (timestamped session)
 */
export function generateSessionToken(username) {
  const timestamp = Date.now()
  const payload = JSON.stringify({
    u: username,
    t: timestamp,
    exp: timestamp + 2 * 60 * 60 * 1000, // 2 Jam sesi aktif
  })
  return btoa(payload)
}

/**
 * Memvalidasi apakah session token masih berlaku
 */
export function isSessionValid(token) {
  if (!token) return false
  try {
    const data = JSON.parse(atob(token))
    if (!data || !data.exp) return false
    return Date.now() < data.exp
  } catch {
    return false
  }
}
