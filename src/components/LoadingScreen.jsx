import { useState, useEffect } from 'react'
import useTheme from '../hooks/useTheme'

export default function LoadingScreen({ message = 'Memuat Pengalaman Digital...' }) {
  const [progress, setProgress] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    // 50ms * 100 langkah = 5000ms (5 detik penuh)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-end pb-6 sm:pb-10 overflow-hidden bg-bg text-heading transition-colors duration-500">
      {/* Background Foto Penuh Tajam Tanpa Blur (Bagian Tengah Terbuka Jelas) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          src="/loading-bg.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        {/* Lapisan tipis agar foto & orang di tengah tetap nampak jelas */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark ? 'bg-[#080B16]/25' : 'bg-white/20'
          }`}
        />
        {/* Gradiasi lembut khusus bagian bawah agar teks & bar tetap terbaca tajam */}
        <div
          className={`absolute inset-x-0 bottom-0 h-[58%] transition-colors duration-500 ${
            isDark
              ? 'bg-linear-to-t from-[#080B16]/90 via-[#080B16]/55 to-transparent'
              : 'bg-linear-to-t from-white/95 via-white/60 to-transparent'
          }`}
        />
      </div>

      {/* Konten Loading Diperbesar & Tetap di Bawah agar Foto Orang di Tengah Terlihat */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Animated Yin-Yang Logo */}
        <div className="relative mb-3">
          <div className="relative grid h-32 w-32 sm:h-36 sm:w-36 place-items-center rounded-full bg-surface p-2 shadow-button border-2 border-indigo/30 overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo Vines Fernando"
              className="h-full w-full rounded-full object-contain animate-spin [animation-duration:3s]"
            />
          </div>
        </div>

        {/* Brand & Subtitle */}
        <h2 className="font-heading text-[2.3rem] sm:text-[2.85rem] font-extrabold tracking-tight text-heading leading-tight">
          Saipull Yiinn<span className="text-indigo">.</span>
        </h2>
        <p className="mt-1 text-[1.05rem] sm:text-[1.2rem] font-bold uppercase tracking-[0.25em] text-indigo">
          UI/UX Designer
        </p>

        {/* Dynamic Loading Message */}
        <p className="mt-3 text-[1.05rem] sm:text-[1.2rem] font-semibold text-heading/85">
          {message}
        </p>

        {/* 5-Detik Loading Progress Bar */}
        <div className="mt-3.5 flex flex-col items-center gap-2">
          <div className="h-3.5 w-80 sm:w-105 overflow-hidden rounded-full bg-soft border border-line shadow-inner">
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo via-indigo-light to-indigo transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-heading text-[1.08rem] sm:text-[1.2rem] font-extrabold text-indigo tracking-wider">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  )
}
