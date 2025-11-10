import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet } from '../lib/api'

export default function DetailOpenTrip() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTrip() {
      try {
        setLoading(true)
        const data = await apiGet(`/api/open-trips/${id}`)
        setTrip(data)
      } catch (err) {
        setError('Gagal memuat detail trip')
        console.error('Error fetching trip:', err)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchTrip()
    }
  }, [id])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Trip tidak ditemukan'}</p>
          <Link
            to="/open-trip"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
          >
            Kembali ke Open Trips
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-5xl px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>

        {/* Trip Header */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {trip?.nama_trip || trip?.title || trip?.name || 'Trip Tanpa Judul'}
              </h1>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Trip Info */}
            <div className="grid md:grid-cols-2 gap-4">
              {trip?.tanggal_berangkat && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Tanggal Keberangkatan</p>
                    <p className="font-semibold">{formatDate(trip.tanggal_berangkat)}</p>
                  </div>
                </div>
              )}

              {trip?.durasi && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Durasi</p>
                    <p className="font-semibold">{trip.durasi} hari</p>
                  </div>
                </div>
              )}

              {trip?.kuota !== undefined && trip?.kuota !== null && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Kuota</p>
                    <p className="font-semibold">{trip.kuota} peserta</p>
                  </div>
                </div>
              )}

              {trip?.harga_per_orang && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Harga per Orang</p>
                    <p className="font-semibold text-cyan-400">Rp {parseInt(trip.harga_per_orang).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {trip?.itinerary && (
              <div className="pt-4 border-t border-slate-700/50">
                <h3 className="text-xl font-semibold mb-3 text-cyan-400">Itinerary</h3>
                <div className="text-slate-300 whitespace-pre-line">
                  {trip.itinerary}
                </div>
              </div>
            )}

            {/* Facilities */}
            {trip?.fasilitas && (
              <div className="pt-4 border-t border-slate-700/50">
                <h3 className="text-xl font-semibold mb-3 text-cyan-400">Fasilitas</h3>
                <div className="text-slate-300">
                  {typeof trip.fasilitas === 'string' ? (
                    <p>{trip.fasilitas}</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {Array.isArray(trip.fasilitas) ? (
                        trip.fasilitas.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))
                      ) : (
                        <li>{JSON.stringify(trip.fasilitas)}</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-700/50">
              <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300">
                Daftar Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



