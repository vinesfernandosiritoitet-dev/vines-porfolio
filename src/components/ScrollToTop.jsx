import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiArrowUp } from 'react-icons/fi'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > 350)
    }
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {visible && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
          className="fixed bottom-6 right-6 z-990 grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-[#2563EB] text-white shadow-[0_8px_25px_rgba(37,99,235,0.5)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1D4ED8] hover:shadow-[0_12px_32px_rgba(37,99,235,0.7)] backdrop-blur-md animate-fade-in"
        >
          <FiArrowUp className="text-[1.25rem]" />
        </button>
      )}
    </>
  )
}
