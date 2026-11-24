/**
 * Konfigurasi Autentikasi Admin Portofolio
 * - Tidak menyimpan password plain text di source code client.
 * - Kredensial pribadi admin tersimpan dalam bentuk SHA-256 hash terenkripsi.
 */

export const SESSION_TOKEN_KEY = 'vines-portfolio-auth-token'
export const USER_INFO_KEY = 'vines-portfolio-user-info'
export const CUSTOM_CREDS_KEY = 'vines-portfolio-admin-creds'
export const LOGIN_GUARD_KEY = 'vines-portfolio-login-guard'

// Username bawaan sebelum admin membuat kredensial pribadinya sendiri
export const DEFAULT_ADMIN_USERNAME = 'vines'

// Hash SHA-256 bawaan (aktif hanya sebelum admin membuat password pribadinya)
export const ADMIN_PASSWORD_HASH = 'b29ec50969099ec5f7f71825d450a5d28e72eb8eb842c8c60ab3172142660a4a'
