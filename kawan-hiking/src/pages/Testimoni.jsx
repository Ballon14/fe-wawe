import React, { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

export default function Testimoni() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true)
      setError('')
      try {
        const data = await apiGet('/api/testimonials').catch(() => null)
        let testiList = []
        if (Array.isArray(data)) {
          testiList = data
        } else if (data?.testimonials) {
          testiList = data.testimonials
        } else if (data?.data) {
          testiList = data.data
        }
        setTestimonials(testiList)
      } catch (e) {
        console.error('Error fetching testimonials:', e)
        setError('Gagal memuat testimoni')
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat testimoni...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Testimoni
          </h1>
          <p className="text-center text-slate-400 mb-12">
            Review dari pendaki yang sudah ikut trip
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-center">
              {error}
            </div>
          )}

          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">Belum ada testimoni tersedia</p>
              <p className="text-slate-500 text-sm">Silakan cek kembali nanti</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testi, i) => {
                const name = testi.name || testi.nama || testi.username || 'User'
                const trip = testi.trip || testi.trip_name || testi.nama_trip || ''
                const rating = testi.rating || 5
                const text = testi.text || testi.testimoni || testi.message || testi.deskripsi || 'Testimoni yang sangat memuaskan!'
                
                return (
                  <div
                    key={testi.id || testi._id || i}
                    className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-slate-900">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-100">{name}</h4>
                        {trip && <p className="text-sm text-slate-400">{trip}</p>}
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(rating)].map((_, idx) => (
                        <svg key={idx} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-slate-300">"{text}"</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
