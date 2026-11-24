import { useEffect, useState, useCallback } from 'react'
import { AuthContext } from './context'
import {
  SESSION_TOKEN_KEY,
  USER_INFO_KEY,
  CUSTOM_CREDS_KEY,
  LOGIN_GUARD_KEY,
  DEFAULT_ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH,
} from './adminConfig'
import { sha256, generateSessionToken, isSessionValid } from '../utils/crypto'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 60 * 1000 // 60 detik jika 5 kali salah

function loadStoredCredentials() {
  try {
    const raw = localStorage.getItem(CUSTOM_CREDS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.username && parsed.passwordHash) {
        return {
          username: String(parsed.username),
          passwordHash: String(parsed.passwordHash),
          isCustom: true,
        }
      }
    }
  } catch {
    /* ignore storage errors */
  }
  return {
    username: DEFAULT_ADMIN_USERNAME,
    passwordHash: ADMIN_PASSWORD_HASH,
    isCustom: false,
  }
}

function getGuardState() {
  try {
    const raw = localStorage.getItem(LOGIN_GUARD_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        attempts: Number(parsed.attempts || 0),
        lockedUntil: Number(parsed.lockedUntil || 0),
      }
    }
  } catch {
    /* ignore */
  }
  return { attempts: 0, lockedUntil: 0 }
}

function getInitialAuth() {
  try {
    const token = localStorage.getItem(SESSION_TOKEN_KEY)
    if (token && isSessionValid(token)) {
      const rawUser = localStorage.getItem(USER_INFO_KEY)
      const creds = loadStoredCredentials()
      return {
        isAdmin: true,
        user: rawUser ? JSON.parse(rawUser) : { username: creds.username },
      }
    }
  } catch {
    /* empty */
  }
  return { isAdmin: false, user: null }
}

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuth)
  const [hasCustomCredentials, setHasCustomCredentials] = useState(
    () => loadStoredCredentials().isCustom,
  )

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_TOKEN_KEY)
      localStorage.removeItem(USER_INFO_KEY)
    } catch {
      /* empty */
    }
    setAuthState({ isAdmin: false, user: null })
  }, [])

  // Cek masa berlaku sesi secara berkala (setiap 60 detik)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem(SESSION_TOKEN_KEY)
      if (token && !isSessionValid(token)) {
        logout()
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [logout])

  const getLockRemainingSeconds = () => {
    const { lockedUntil } = getGuardState()
    if (!lockedUntil || Date.now() >= lockedUntil) return 0
    return Math.ceil((lockedUntil - Date.now()) / 1000)
  }

  const login = async (username, password) => {
    if (!username || !password) return { ok: false, error: 'Username dan password wajib diisi.' }

    // Cek kunci keamanan brute-force
    const remaining = getLockRemainingSeconds()
    if (remaining > 0) {
      return {
        ok: false,
        error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${remaining} detik.`,
      }
    }

    // 1. Jika API backend eksternal dikonfigurasi, gunakan request HTTP POST
    const apiBase = import.meta.env.VITE_API_BASE_URL
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })
        if (res.ok) {
          const data = await res.json()
          const token = data.token || generateSessionToken(username)
          localStorage.setItem(SESSION_TOKEN_KEY, token)
          localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username }))
          localStorage.removeItem(LOGIN_GUARD_KEY)
          setAuthState({ isAdmin: true, user: { username } })
          return { ok: true }
        }
      } catch (err) {
        console.warn('Gagal menghubungi backend API auth, fallback ke verifikasi lokal:', err)
      }
    }

    // 2. Verifikasi lokal aman berbasis Cryptographic SHA-256 Hash
    try {
      const activeCreds = loadStoredCredentials()
      const inputHash = await sha256(password)
      const isUserMatch = username.trim().toLowerCase() === activeCreds.username.toLowerCase()
      const isPassMatch = inputHash === activeCreds.passwordHash

      if (isUserMatch && isPassMatch) {
        const cleanUser = activeCreds.username
        const token = generateSessionToken(cleanUser)
        localStorage.setItem(SESSION_TOKEN_KEY, token)
        localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: cleanUser }))
        localStorage.removeItem(LOGIN_GUARD_KEY)
        setAuthState({ isAdmin: true, user: { username: cleanUser } })
        return { ok: true }
      }
    } catch (err) {
      console.error('Error saat enkripsi password:', err)
      return { ok: false, error: 'Terjadi kesalahan saat memverifikasi keamanan.' }
    }

    // Catat percobaan gagal
    const guard = getGuardState()
    const nextAttempts = (Date.now() >= guard.lockedUntil ? guard.attempts : 0) + 1
    if (nextAttempts >= MAX_ATTEMPTS) {
      localStorage.setItem(
        LOGIN_GUARD_KEY,
        JSON.stringify({ attempts: 0, lockedUntil: Date.now() + LOCKOUT_MS }),
      )
      return {
        ok: false,
        error: 'Akses dikunci sementara selama 60 detik karena 5 kali gagal login.',
      }
    }

    localStorage.setItem(
      LOGIN_GUARD_KEY,
      JSON.stringify({ attempts: nextAttempts, lockedUntil: 0 }),
    )
    const sisa = MAX_ATTEMPTS - nextAttempts
    return {
      ok: false,
      error: `Username atau password salah. Sisa percobaan: ${sisa} kali.`,
    }
  }

  // Membuat / memperbarui username & password pribadi admin (hanya saat sudah terautentikasi)
  const updateCredentials = async (newUsername, newPassword) => {
    if (!authState.isAdmin) {
      return { ok: false, error: 'Akses ditolak. Anda harus login terlebih dahulu.' }
    }

    const cleanUser = String(newUsername || '').trim()
    const cleanPass = String(newPassword || '')

    if (cleanUser.length < 3) {
      return { ok: false, error: 'Nama pengguna minimal 3 karakter.' }
    }
    if (cleanPass.length < 6) {
      return { ok: false, error: 'Password minimal 6 karakter agar aman.' }
    }

    try {
      const passwordHash = await sha256(cleanPass)
      localStorage.setItem(
        CUSTOM_CREDS_KEY,
        JSON.stringify({
          username: cleanUser,
          passwordHash,
          updatedAt: new Date().toISOString(),
        }),
      )

      const token = generateSessionToken(cleanUser)
      localStorage.setItem(SESSION_TOKEN_KEY, token)
      localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: cleanUser }))

      setHasCustomCredentials(true)
      setAuthState({ isAdmin: true, user: { username: cleanUser } })
      return { ok: true }
    } catch (err) {
      console.error('Gagal menyimpan kredensial admin:', err)
      return { ok: false, error: 'Gagal menyimpan nama pengguna & password baru.' }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin: authState.isAdmin,
        user: authState.user,
        hasCustomCredentials,
        login,
        logout,
        updateCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
