import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import AOS from 'aos'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CaseStudy from './pages/CaseStudy'
import AdminLogin from './pages/AdminLogin'
import NotFound from './pages/NotFound'
import AuthProvider from './auth/AuthProvider'
import LoadingScreen from './components/LoadingScreen'
import { recordPortfolioVisit } from './utils/analytics'

function ProjectRedirect() {
  const { id } = useParams()
  return <Navigate to={`/case-study/${id}`} replace />
}

function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    recordPortfolioVisit()
    const timer = setTimeout(() => {
      setLoading(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading) {
      const refreshTimer = setTimeout(() => {
        AOS.refreshHard()
      }, 60)
      return () => clearTimeout(refreshTimer)
    }
  }, [loading])

  if (loading) {
    return <LoadingScreen message="Memuat Pengalaman Digital Saipull Yiinn..." />
  }

  return (
    <>
      <Navbar />
      <main className="relative z-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-study/:id" element={<CaseStudy />} />
          <Route path="/project/:id" element={<ProjectRedirect />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}