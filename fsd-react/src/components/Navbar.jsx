import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const currentUser = typeof window !== 'undefined' && localStorage.getItem('currentUser')

  function handleLogout(){
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/loundery logo.png" alt="logo" className="h-10 w-10 rounded-md" />
          <div>
            <div className="font-bold text-lg text-brand">ELITE</div>
            <div className="text-sm text-brand">CLEAN</div>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          {!currentUser && <Link to="/login" className="text-brand font-semibold">Login</Link>}
          {!currentUser && <Link to="/signup" className="bg-brand text-white px-4 py-2 rounded">Sign Up</Link>}
          {currentUser && <button onClick={handleLogout} className="text-sm text-gray-600">Logout</button>}
        </nav>
      </div>
    </header>
  )
}
