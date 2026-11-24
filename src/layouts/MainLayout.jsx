import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink antialiased">
      <Navbar />
      <ScrollToTop />
      <div className="relative z-1 flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
