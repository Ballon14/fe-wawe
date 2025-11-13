import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function OpenTripRegister() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nomorHp: '',
    alamat: '',
    kontakDarurat: '',
    nomorDarurat: '',
    riwayatPenyakit: '',
    jumlahPeserta: 1,
    kondisiFit: false,
    catatan: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchTrip() {
      try {
        setLoading(true)
        const data = await apiGet(`/api/open-trips/${id}`)
        setTrip(data)
      } catch (err) {
        console.error('Error fetching trip:', err)
        setError('Gagal memuat data trip. Silakan kembali dan coba lagi.')
      } finally {
        setLoading(false)
      }
    }
    if (!user) {
      navigate('/login')
      return
    }
    if (id) {
      fetchTrip()
    }
  }, [id, user, navigate])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : name === 'jumlahPeserta'
        ? Math.max(1, parseInt(value) || 1)
        : value,
    }))
  }

  function validate() {
    if (!formData.namaLengkap.trim()) return 'Nama lengkap wajib diisi'
    if (!formData.email.trim()) return 'Email wajib diisi'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return 'Format email tidak valid'
    if (!formData.nomorHp.trim()) return 'Nomor HP wajib diisi'
    if (!formData.alamat.trim()) return 'Alamat lengkap wajib diisi'
    if (!formData.kontakDarurat.trim()) return 'Nama kontak darurat wajib diisi'
    if (!formData.nomorDarurat.trim()) return 'Nomor kontak darurat wajib diisi'
    if (!formData.kondisiFit) return 'Mohon konfirmasi kondisi kesehatan Anda sebelum melanjutkan'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const message = validate()
    if (message) {
      setError(message)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        nama_lengkap: formData.namaLengkap,
        email: formData.email,
        nomor_hp: formData.nomorHp,
        jumlah_peserta: formData.jumlahPeserta,
        catatan: formData.catatan,
        alamat: formData.alamat,
        kontak_darurat_nama: formData.kontakDarurat,
        kontak_darurat_nomor: formData.nomorDarurat,
        riwayat_penyakit: formData.riwayatPenyakit,
        kondisi_fit: formData.kondisiFit,
      }
      const res = await apiPost(`/api/open-trips/${id}/register`, payload)
      if (!res || !res.id) {
        throw new Error('Registrasi gagal. Silakan coba lagi.')
      }
      navigate(`/open-trip/${id}/pembayaran`, {
        state: {
          trip,
          formData,
          registrationId: res.id,
        },
      })
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Gagal melakukan registrasi. Silakan coba lagi atau hubungi admin.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat data trip...</p>
        </div>
      </div>
    )
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <Link
            to="/open-trip"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
          >
            Kembali ke Open Trip
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-4xl px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>

        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-900/60">
            <h1 className="text-2xl font-bold text-white">Daftar Open Trip</h1>
            <p className="text-slate-400 text-sm mt-1">
              {trip?.nama_trip || 'Trip Tanpa Judul'} • {trip?.tanggal_berangkat ? new Date(trip.tanggal_berangkat).toLocaleDateString('id-ID') : 'Tanggal belum tersedia'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nama Lengkap *</label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  placeholder="contoh@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nomor HP *</label>
                <input
                  type="tel"
                  name="nomorHp"
                  value={formData.nomorHp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Jumlah Peserta *</label>
                <input
                  type="number"
                  name="jumlahPeserta"
                  min={1}
                  value={formData.jumlahPeserta}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Alamat Lengkap *</label>
              <textarea
                name="alamat"
                rows={3}
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="Alamat lengkap sesuai KTP atau tempat tinggal saat ini"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Kontak Darurat (Nama) *</label>
                <input
                  type="text"
                  name="kontakDarurat"
                  value={formData.kontakDarurat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  placeholder="Nama yang bisa dihubungi"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Kontak Darurat (Nomor) *</label>
                <input
                  type="tel"
                  name="nomorDarurat"
                  value={formData.nomorDarurat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Riwayat Penyakit / Alergi</label>
              <textarea
                name="riwayatPenyakit"
                rows={3}
                value={formData.riwayatPenyakit}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="Tuliskan riwayat penyakit, alergi, atau kondisi khusus (jika ada)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Catatan Tambahan</label>
              <textarea
                name="catatan"
                rows={4}
                value={formData.catatan}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="Tulis permintaan khusus atau informasi tambahan"
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-slate-900/40 border border-slate-700/40 p-4">
              <input
                type="checkbox"
                id="kondisiFit"
                name="kondisiFit"
                checked={formData.kondisiFit}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
                required
              />
              <label htmlFor="kondisiFit" className="text-sm text-slate-300 leading-relaxed">
                Saya menyatakan dalam kondisi sehat, fit, dan siap mengikuti kegiatan pendakian. Saya juga memahami risiko perjalanan dan siap mengikuti instruksi guide selama trip.
              </label>
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-slate-300 text-sm">
                <p>Total estimasi biaya</p>
                <p className="text-lg font-bold text-cyan-400">
                  {trip?.harga_per_orang
                    ? `Rp ${(parseInt(trip.harga_per_orang) * formData.jumlahPeserta).toLocaleString('id-ID')}`
                    : 'Harga belum tersedia'}
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
