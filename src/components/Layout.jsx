import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-200">
        <div className="container-max">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary-600">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
              <span>Lyla</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`font-medium ${location.pathname === '/' ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600'}`}>Home</Link>
              <Link to="/search" className={`font-medium ${location.pathname === '/search' ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600'}`}>Search</Link>
              <Link to="/docs" className={`font-medium ${location.pathname === '/docs' ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600'}`}>Docs</Link>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-900 text-neutral-400 py-8 mt-20">
        <div className="container-max text-center">
          <p>&copy; 2024 Lyla Research Demo. PubMed + Clinical Trials</p>
        </div>
      </footer>
    </div>
  )
}
