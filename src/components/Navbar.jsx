import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-slate-900/60 border-b border-slate-400/10">
      <div className="mx-auto w-[min(1140px,92%)] flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 no-underline text-inherit">
          <span className="w-7 h-7 rounded-lg shadow-[0_0_0_4px_rgba(34,211,238,0.08)] bg-gradient-to-br from-cyan-400 to-cyan-700 inline-block" />
          <span className="font-bold tracking-wide">Kawan Hiking</span>
        </Link>
        <nav className="hidden md:flex gap-4 text-slate-400">
          <a className="hover:text-slate-200" href="#fitur">Fitur</a>
          <a className="hover:text-slate-200" href="#testimoni">Testimoni</a>
          <a className="hover:text-slate-200" href="#gabung">Gabung</a>
        </nav>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.name || user.email}</span>
            <button className="rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-2 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:brightness-105" onClick={handleLogout}>Keluar</button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login">
              <button className="rounded-xl border border-cyan-400/70 bg-transparent px-4 py-2 font-bold text-slate-100 hover:brightness-110">Masuk</button>
            </Link>
            <Link to="/register">
              <button className="rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-2 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:brightness-105">Daftar</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}


