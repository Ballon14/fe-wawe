import React, { useEffect, useState } from 'react'
import { apiGet } from '../../lib/api'

export default function ManagePrivateTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTrips()
  }, [])

  async function fetchTrips() {
    setLoading(true)
    setError('')
    try {
      const data = await apiGet('/api/private-trips').catch(() => [])
      let list = []
      if (Array.isArray(data)) {
        list = data
      } else if (data?.trips) {
        list = data.trips
      } else if (data?.data) {
        list = data.data
      } else {
        list = []
      }
      setTrips(list)
    } catch (e) {
      setError(`Gagal mengambil data: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('id-ID')
    } catch {
      return dateString
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Private Trip</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">Memuat data…</div>
      ) : trips.length === 0 ? (
        <div className="text-slate-400">Belum ada permintaan private trip.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/60">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Pemesan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Destinasi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Guide</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Tgl Berangkat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Peserta</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trips.map((t, i) => (
                <tr key={t?.id || t?._id || i} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-sm text-slate-200">
                    {t?.pemesan?.nama || t?.user_name || t?.nama_pemesan || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {t?.destinasi?.nama || t?.nama_destinasi || t?.destinasi_nama || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {t?.guide?.nama || t?.nama_guide || t?.guide_name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {formatDate(t?.tanggal_keberangkatan || t?.tgl_berangkat)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {t?.jumlah_peserta || 1}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                      {t?.status || 'menunggu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


