import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiPost, apiGet } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cek apakah user sudah login saat app dimuat
    checkAuth()

    // Listen ke event global ketika token dianggap tidak valid oleh API
    const onAppLogout = () => {
      setUser(null)
      setToken(null)
      setLoading(false)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('app:logout', onAppLogout)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('app:logout', onAppLogout)
      }
    }
  }, [])

  async function checkAuth() {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      // Verifikasi token dengan memanggil endpoint profile di backend.
      // Jika token expired atau tidak valid, backend akan me-return 401 dan api.js akan
      // memancarkan event 'app:logout' sehingga kita akan men-set user menjadi null.
      const profile = await apiGet('/api/auth/profile')
      if (profile) {
        setUser(profile)
        // Pastikan localStorage user sinkron
        try {
          localStorage.setItem('user', JSON.stringify(profile))
        } catch (e) {}
      } else {
        setUser(JSON.parse(localStorage.getItem('user') || 'null'))
      }
    } catch (error) {
      // Jika terjadi error (mis. 401), pastikan kita logout di sisi klien
      setUser(null)
      setToken(null)
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (e) {}
    } finally {
      setLoading(false)
    }
  }

  async function login(username, password) {
    try {
      const response = await apiPost('/api/auth/login', { username: String(username || '').trim(), password })
      if (response.token) {
        setToken(response.token)
        localStorage.setItem('token', response.token)
        // simpan user (username, role) di localStorage
        localStorage.setItem('user', JSON.stringify({ username: response.username, role: response.role }))
        setUser({ username: response.username, role: response.role })
        return { success: true, data: response }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      const msg = (error.message || '').toLowerCase()
      const friendly = msg.includes('401') || msg.includes('invalid')
        ? 'Username atau password salah'
        : 'Terjadi kesalahan saat login. Silakan coba lagi.'
      return { success: false, error: friendly }
    }
  }

  async function register(username, password, email, nomor_hp, alamat) {
    try {
      const response = await apiPost('/api/auth/register', { 
        username, 
        password, 
        email, 
        nomor_hp, 
        alamat 
      })
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

