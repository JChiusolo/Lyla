import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthCallback from './pages/AuthCallback'
import SearchPage from './pages/SearchPage'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  )
}
