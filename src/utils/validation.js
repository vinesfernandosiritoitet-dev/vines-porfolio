/**
 * Utility validasi dan sanitasi input untuk Portofolio Vines Fernando
 */

// Regex validasi email standar RFC 5322 sederhana
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

/**
 * Sanitasi string sederhana untuk mencegah XSS injection pada input teks
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Validasi formulir kontak
 */
export function validateContactForm({ name, email, subject, message }) {
  const errors = {}

  if (!name || !name.trim()) {
    errors.name = 'Nama lengkap wajib diisi.'
  } else if (name.trim().length < 2) {
    errors.name = 'Nama minimal berisi 2 karakter.'
  } else if (name.trim().length > 100) {
    errors.name = 'Nama maksimal 100 karakter.'
  }

  if (!email || !email.trim()) {
    errors.email = 'Alamat email wajib diisi.'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Format alamat email tidak valid (contoh: user@domain.com).'
  }

  if (!subject || !subject.trim()) {
    errors.subject = 'Subjek pesan wajib diisi.'
  } else if (subject.trim().length < 3) {
    errors.subject = 'Subjek minimal berisi 3 karakter.'
  } else if (subject.trim().length > 150) {
    errors.subject = 'Subjek maksimal 150 karakter.'
  }

  if (!message || !message.trim()) {
    errors.message = 'Pesan wajib diisi.'
  } else if (message.trim().length < 10) {
    errors.message = 'Pesan minimal berisi 10 karakter agar lebih jelas.'
  } else if (message.trim().length > 3000) {
    errors.message = 'Pesan maksimal 3000 karakter.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validasi data proyek baru atau suntingan proyek
 */
export function validateProjectForm(data) {
  const errors = {}
  if (!data.title || !data.title.trim()) {
    errors.title = 'Nama project wajib diisi.'
  }
  if (!data.category || !data.category.trim()) {
    errors.category = 'Kategori project wajib diisi.'
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
