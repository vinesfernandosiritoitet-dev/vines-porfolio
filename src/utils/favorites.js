const PHOTOS_KEY = 'portfolio-favorite-photos'
const SONGS_KEY = 'portfolio-favorite-songs'

function loadArray(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore storage errors */
  }
  return []
}

function saveArray(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'Penyimpanan browser penuh. Coba gunakan ukuran file yang lebih kecil atau hapus item lama.',
    }
  }
}

export function getFavoritePhotos() {
  return loadArray(PHOTOS_KEY)
}

export function addFavoritePhoto({ title, caption, image }) {
  const existing = getFavoritePhotos()
  const item = {
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: title || 'Foto Favorit',
    caption: caption || '',
    image,
    createdAt: new Date().toISOString(),
  }
  const next = [item, ...existing]
  const res = saveArray(PHOTOS_KEY, next)
  return res.ok ? { ok: true, list: next } : res
}

export function deleteFavoritePhoto(id) {
  const next = getFavoritePhotos().filter((p) => p.id !== id)
  saveArray(PHOTOS_KEY, next)
  return next
}

export function getFavoriteSongs() {
  return loadArray(SONGS_KEY)
}

export function addFavoriteSong({ title, artist, url, thumbnail }) {
  const existing = getFavoriteSongs()
  const item = {
    id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: title || 'Lagu Favorit',
    artist: artist || '',
    url: url || '',
    thumbnail: thumbnail || '',
    createdAt: new Date().toISOString(),
  }
  const next = [item, ...existing]
  const res = saveArray(SONGS_KEY, next)
  return res.ok ? { ok: true, list: next } : res
}

export function deleteFavoriteSong(id) {
  const next = getFavoriteSongs().filter((s) => s.id !== id)
  saveArray(SONGS_KEY, next)
  return next
}

export function compressFavoriteImage(file, onDone) {
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result
    if (typeof dataUrl !== 'string' || file.size <= 350 * 1024) {
      onDone(dataUrl)
      return
    }
    const img = new Image()
    img.onload = () => {
      const maxW = 1200
      const scale = img.width > maxW ? maxW / img.width : 1
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        onDone(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      onDone(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => onDone(dataUrl)
    img.src = dataUrl
  }
  reader.readAsDataURL(file)
}
