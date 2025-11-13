import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiGet } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

// Fungsi untuk format tanggal
function formatDate(dateString) {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  } catch {
    return dateString
  }
}

export default function OpenTrip() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true)
      setError('')
      try {
        const data = await apiGet('/api/open-trips')
        let tripList = []
        if (Array.isArray(data)) {
          tripList = data
        } else if (data?.trips) {
          tripList = data.trips
        } else if (data?.data) {
          tripList = data.data
        }
        setTrips(tripList)
      } catch (e) {
        setError(`Gagal memuat data: ${e.message}`)
        console.error('Error fetching trips:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat data trip...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Open Trip
          </h1>
          <p className="text-center text-slate-400 mb-12">
            Trip gabungan, cocok untuk solo hiker
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-center">
              {error}
            </div>
          )}

          {trips.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">Belum ada Open Trip tersedia</p>
              <p className="text-slate-500 text-sm">Silakan cek kembali nanti</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {trips.map((trip, index) => (
                <div
                  key={trip?.id || trip?._id || index}
                  className="group bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] hover:-translate-y-1"
                >
                  {/* Image placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-cyan-400/20 to-blue-400/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold mb-2 text-slate-100">
                      {trip?.nama_trip || trip?.title || trip?.name || 'Trip Tanpa Judul'}
                    </h3>

                    {/* Trip Info */}
                    {trip?.tanggal_berangkat && (
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(trip.tanggal_berangkat)}</span>
                      </div>
                    )}

                    <div className="flex gap-4 text-slate-400 text-sm flex-wrap">
                      {trip?.durasi && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{trip.durasi} hari</span>
                        </div>
                      )}
                      {trip?.kuota !== undefined && trip?.kuota !== null && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{trip.kuota} peserta</span>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm line-clamp-2">
                      {trip?.itinerary || trip?.deskripsi || 'Join bersama pendaki lainnya dan nikmati perjalanan seru'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                      <span className="text-cyan-400 font-bold text-lg">
                        {trip?.harga_per_orang 
                          ? `Rp ${parseInt(trip.harga_per_orang).toLocaleString('id-ID')}`
                          : 'Rp 500.000'}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          to={`/open-trip/${trip?.id || trip?._id || index}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                        >
                          Detail
                        </Link>
                        <button
                          onClick={() => {
                            const idValue = trip?.id || trip?._id || index
                            if (!user) {
                              navigate('/login')
                              return
                            }
                            navigate(`/open-trip/${idValue}/daftar`)
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
                        >
                          Daftar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
