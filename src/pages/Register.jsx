import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await register(username, password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Gagal mendaftar')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-900">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Daftar</h2>
        {error && (
          <div className="rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="register-username" className="block text-sm font-medium text-slate-300">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="masukkan username"
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-password" className="block text-sm font-medium text-slate-300">
              Kata sandi
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="masukkan kata sandi"
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-3 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

