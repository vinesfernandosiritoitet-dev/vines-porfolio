/**
 * Kumpulan helper utility untuk Portofolio Vines Fernando
 */

/**
 * Format tanggal Indonesia
 */
export function formatDateID(dateString) {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  } catch {
    return dateString
  }
}

/**
 * Mengambil 2 inisial huruf pertama nama
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/**
 * Smooth scroll ke elemen dengan offset header
 */
export function scrollToElement(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
