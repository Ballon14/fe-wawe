import React, { useEffect, useState } from 'react'
import { apiGet, apiPut, apiDelete } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function MyTrip() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [filter, setFilter] = useState('all') // all | completed | unpaid
  const [cancellingId, setCancellingId] = useState(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const data = await apiGet('/api/open-trips/my/registrations')
        setRegistrations(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e.message || 'Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, navigate])

  async function handleCancelTrip(registrationId) {
    setCancellingId(registrationId)
    setError('')
    try {
      await apiPut(`/api/open-trips/my/registrations/${registrationId}/cancel`)
      // Refresh data
      const data = await apiGet('/api/open-trips/my/registrations')
      setRegistrations(Array.isArray(data) ? data : [])
      setShowCancelConfirm(null)
    } catch (e) {
      setError(e.message || 'Gagal membatalkan trip')
    } finally {
      setCancellingId(null)
    }
  }

  async function handleDeleteTrip(registrationId) {
    setDeletingId(registrationId)
    setError('')
    try {
      await apiDelete(`/api/open-trips/my/registrations/${registrationId}`)
      // Refresh data
      const data = await apiGet('/api/open-trips/my/registrations')
      setRegistrations(Array.isArray(data) ? data : [])
      setShowDeleteConfirm(null)
    } catch (e) {
      setError(e.message || 'Gagal menghapus riwayat trip')
    } finally {
      setDeletingId(null)
    }
  }

  function getStatusBadgeClass(paymentStatus, dilaksanakan, status) {
    if (status === 'cancelled') {
      return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
    if (dilaksanakan === 1) {
      return 'bg-green-500/20 text-green-300 border-green-500/50'
    }
    if (paymentStatus === 'paid') {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
    }
    if (paymentStatus === 'expired') {
      return 'bg-red-500/20 text-red-300 border-red-500/50'
    }
    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
  }

  function getStatusText(paymentStatus, dilaksanakan, status) {
    if (status === 'cancelled') {
      return 'Dibatalkan'
    }
    if (dilaksanakan === 1) {
      return 'Sudah Dilaksanakan'
    }
    if (paymentStatus === 'paid') {
      return 'Sudah Dibayar'
    }
    if (paymentStatus === 'expired') {
      return 'Pembayaran Kadaluarsa'
    }
    return 'Belum Dibayar'
  }

  function canCancelTrip(dilaksanakan, status) {
    return dilaksanakan !== 1 && status !== 'cancelled'
  }

  function formatDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredRegistrations = registrations.filter((reg) => {
    if (filter === 'all') return true
    if (filter === 'completed') {
      return reg.dilaksanakan === 1
    }
    if (filter === 'unpaid') {
      return (reg.payment_status === 'pending' || reg.payment_status === 'expired') && reg.status !== 'cancelled'
    }
    return true
  }).sort((a, b) => {
    // Urutan prioritas: 1. Belum dibayar, 2. Sudah dibayar, 3. Terlaksanakan, 4. Dibatalkan
    
    // Helper function untuk mendapatkan priority
    function getPriority(reg) {
      // 1. Belum dibayar (pending atau expired, belum dilaksanakan, belum dibatalkan)
      if ((reg.payment_status === 'pending' || reg.payment_status === 'expired') && 
          reg.dilaksanakan !== 1 && 
          reg.status !== 'cancelled') {
        return 1
      }
      // 2. Sudah dibayar (paid, belum dilaksanakan, belum dibatalkan)
      if (reg.payment_status === 'paid' && 
          reg.dilaksanakan !== 1 && 
          reg.status !== 'cancelled') {
        return 2
      }
      // 3. Terlaksanakan
      if (reg.dilaksanakan === 1) {
        return 3
      }
      // 4. Dibatalkan
      if (reg.status === 'cancelled') {
        return 4
      }
      // Default
      return 5
    }
    
    const priorityA = getPriority(a)
    const priorityB = getPriority(b)
    
    // Sort by priority first
    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }
    
    // If same priority, sort by created_at (newest first)
    const dateA = new Date(a.created_at || 0)
    const dateB = new Date(b.created_at || 0)
    return dateB - dateA
  })

  const unpaidTrips = registrations.filter(
    (reg) => (reg.payment_status === 'pending' || reg.payment_status === 'expired') && 
             reg.dilaksanakan !== 1 && 
             reg.status !== 'cancelled'
  )
  const completedTrips = registrations.filter((reg) => reg.dilaksanakan === 1)

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

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Trip</h1>
          <p className="text-slate-400">Kelola dan lihat status trip Anda</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-5">
            <div className="text-slate-400 text-sm mb-1">Total Trip</div>
            <div className="text-2xl font-bold text-white">{registrations.length}</div>
          </div>
          <div className="bg-yellow-500/10 rounded-xl border border-yellow-500/30 p-5">
            <div className="text-yellow-400 text-sm mb-1">Belum Dibayar</div>
            <div className="text-2xl font-bold text-yellow-400">{unpaidTrips.length}</div>
          </div>
          <div className="bg-green-500/10 rounded-xl border border-green-500/30 p-5">
            <div className="text-green-400 text-sm mb-1">Sudah Dilaksanakan</div>
            <div className="text-2xl font-bold text-green-400">{completedTrips.length}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-slate-400 text-sm">Filter:</span>
          <select
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua Trip</option>
            <option value="unpaid">Belum Dibayar</option>
            <option value="completed">Sudah Dilaksanakan</option>
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 text-red-300 border border-red-500/50">
            {error}
          </div>
        )}

        {filteredRegistrations.length === 0 ? (
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-12 text-center">
            <p className="text-slate-400 text-lg mb-4">
              {filter === 'all' 
                ? 'Belum ada trip yang terdaftar' 
                : filter === 'unpaid'
                ? 'Tidak ada trip yang belum dibayar'
                : 'Tidak ada trip yang sudah dilaksanakan'}
            </p>
            <Link
              to="/open-trip"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
            >
              Daftar Open Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegistrations.map((reg) => {
              const totalAmount = (reg.harga_per_orang || 0) * (reg.jumlah_peserta || 1)
              const isUnpaid = reg.payment_status === 'pending' || reg.payment_status === 'expired'
              const isCompleted = reg.dilaksanakan === 1

              return (
                <div
                  key={reg.id}
                  className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {reg.nama_trip || 'Trip Tanpa Nama'}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              Tanggal Berangkat: {formatDate(reg.tanggal_berangkat)}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                              reg.payment_status,
                              reg.dilaksanakan,
                              reg.status
                            )}`}
                          >
                            {getStatusText(reg.payment_status, reg.dilaksanakan, reg.status)}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-slate-400">Jumlah Peserta:</span>
                            <span className="text-white ml-2 font-semibold">
                              {reg.jumlah_peserta} orang
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Total Pembayaran:</span>
                            <span className="text-white ml-2 font-semibold">
                              {formatCurrency(totalAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Durasi:</span>
                            <span className="text-white ml-2 font-semibold">
                              {reg.durasi} hari
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Tanggal Daftar:</span>
                            <span className="text-white ml-2 font-semibold">
                              {formatDate(reg.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:min-w-[200px]">
                        {isUnpaid && !isCompleted && reg.status !== 'cancelled' && (
                          <Link
                            to={`/open-trip/${reg.trip_id}/pembayaran`}
                            state={{
                              trip: {
                                id: reg.trip_id,
                                nama_trip: reg.nama_trip,
                                harga_per_orang: reg.harga_per_orang,
                              },
                              formData: {
                                namaLengkap: reg.nama_lengkap,
                                email: reg.email,
                                nomorHp: reg.nomor_hp,
                                jumlahPeserta: reg.jumlah_peserta,
                                alamat: reg.alamat,
                                kontakDarurat: reg.kontak_darurat_nama,
                                nomorDarurat: reg.kontak_darurat_nomor,
                                riwayatPenyakit: reg.riwayat_penyakit,
                                kondisiFit: reg.kondisi_fit === 1,
                                catatan: reg.catatan,
                              },
                              registrationId: reg.id,
                            }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(251,191,36,0.35)] transition-all duration-300 text-center"
                          >
                            {reg.payment_status === 'expired' ? 'Ulangi Pembayaran' : 'Bayar Sekarang'}
                          </Link>
                        )}
                        {canCancelTrip(reg.dilaksanakan, reg.status) && (
                          <button
                            onClick={() => setShowCancelConfirm(reg.id)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-tr from-red-400 to-red-600 text-white font-bold hover:shadow-[0_6px_16px_rgba(239,68,68,0.35)] transition-all duration-300"
                          >
                            Batalkan Trip
                          </button>
                        )}
                        {reg.status === 'cancelled' && (
                          <button
                            onClick={() => setShowDeleteConfirm(reg.id)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-tr from-gray-500 to-gray-700 text-white font-bold hover:shadow-[0_6px_16px_rgba(107,114,128,0.35)] transition-all duration-300"
                          >
                            Hapus Riwayat
                          </button>
                        )}
                        <Link
                          to={`/open-trip/${reg.trip_id}`}
                          className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors text-center"
                        >
                          Lihat Detail Trip
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Batalkan Trip?</h3>
              <p className="text-slate-300 mb-6">
                Apakah Anda yakin ingin membatalkan trip ini? Tindakan ini tidak dapat dibatalkan.
                {registrations.find(r => r.id === showCancelConfirm)?.payment_status === 'paid' && (
                  <span className="block mt-2 text-yellow-400 text-sm">
                    ⚠️ Jika Anda sudah membayar, silakan hubungi admin untuk pengembalian dana.
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleCancelTrip(showCancelConfirm)}
                  disabled={cancellingId === showCancelConfirm}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-tr from-red-400 to-red-600 text-white font-bold hover:shadow-[0_6px_16px_rgba(239,68,68,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancellingId === showCancelConfirm ? 'Membatalkan...' : 'Ya, Batalkan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Hapus Riwayat Trip?</h3>
              <p className="text-slate-300 mb-6">
                Apakah Anda yakin ingin menghapus riwayat trip yang dibatalkan ini? Tindakan ini tidak dapat dibatalkan dan data akan dihapus permanen.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteTrip(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-tr from-gray-500 to-gray-700 text-white font-bold hover:shadow-[0_6px_16px_rgba(107,114,128,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === showDeleteConfirm ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

