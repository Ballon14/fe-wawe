import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiGet, apiPut } from '../lib/api'

export default function Profile() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    nomor_hp: '',
    alamat: ''
  })

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [user, token, navigate])

  async function fetchProfile() {
    setLoading(true)
    setError('')
    try {
      const data = await apiGet('/api/auth/profile')
      if (data && data.username) {
        setProfile(data)
        setFormData({
          email: data.email || '',
          nomor_hp: data.nomor_hp || '',
          alamat: data.alamat || ''
        })
      } else {
        setError('Data profil tidak valid')
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Gagal memuat profil. Pastikan Anda sudah login.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await apiPut('/api/auth/profile', formData)
      setSuccess('Profil berhasil diperbarui!')
      setEditing(false)
      await fetchProfile() // Refresh data
    } catch (err) {
      setError(err.message || 'Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Gagal memuat profil</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  const displayName = profile.username || user?.username || 'User'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Profil Saya
          </h1>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-center">
              {success}
            </div>
          )}

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 border-b border-slate-700/50">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold text-4xl shadow-lg">
                  {initial}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-100 mb-1">
                    {displayName}
                  </h2>
                  {profile.role && (
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-sm font-semibold capitalize">
                      {profile.role}
                    </span>
                  )}
                  {profile.email && (
                    <p className="text-slate-400 text-sm mt-2">{profile.email}</p>
                  )}
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
                  >
                    Edit Profil
                  </button>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8 space-y-6">
              {editing ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        disabled
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">Username tidak dapat diubah</p>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Nomor HP
                      </label>
                      <input
                        type="tel"
                        value={formData.nomor_hp}
                        onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="+62 812-3456-7890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Alamat
                      </label>
                      <textarea
                        value={formData.alamat}
                        onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                        placeholder="Alamat lengkap"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          email: profile.email || '',
                          nomor_hp: profile.nomor_hp || '',
                          alamat: profile.alamat || ''
                        })
                        setError('')
                        setSuccess('')
                      }}
                      disabled={saving}
                      className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      Batal
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm text-slate-400">Username</label>
                      <p className="text-slate-100 font-semibold">{displayName}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-400">Role</label>
                      <p className="text-slate-100 font-semibold capitalize">{profile.role || 'User'}</p>
                    </div>

                    {profile.email && (
                      <div className="space-y-1">
                        <label className="text-sm text-slate-400">Email</label>
                        <p className="text-slate-100 font-semibold">{profile.email}</p>
                      </div>
                    )}

                    {profile.nomor_hp && (
                      <div className="space-y-1">
                        <label className="text-sm text-slate-400">Nomor HP</label>
                        <p className="text-slate-100 font-semibold">{profile.nomor_hp}</p>
                      </div>
                    )}

                    {profile.alamat && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm text-slate-400">Alamat</label>
                        <p className="text-slate-100 font-semibold">{profile.alamat}</p>
                      </div>
                    )}

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm text-slate-400">Bergabung Sejak</label>
                      <p className="text-slate-100 font-semibold">
                        {profile.created_at 
                          ? new Date(profile.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

