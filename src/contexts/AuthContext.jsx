import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiPost, apiGet } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cek apakah user sudah login saat app dimuat
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const userData = await apiGet('/api/auth/me')
      setUser(userData)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(username, password) {
    try {
      const response = await apiPost('/api/auth/login', { username, password })
      setUser(response.user || response)
      return { success: true, data: response }
    } catch (error) {
      console.error('Login error:', error)
      // Format pesan error yang lebih user-friendly
      const errorMessage = error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.'
      return { success: false, error: errorMessage }
    }
  }

  async function register(username, password) {
    try {
      const response = await apiPost('/api/auth/register', { username, password })
      setUser(response.user || response)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function logout() {
    try {
      await apiPost('/api/auth/logout', {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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

