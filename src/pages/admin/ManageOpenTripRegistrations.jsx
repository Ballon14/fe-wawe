import React, { useEffect, useState } from 'react'
import { apiGet } from '../../lib/api'

export default function ManageOpenTripRegistrations() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const data = await apiGet('/api/open-trips/registrations')
        const list = Array.isArray(data) ? data : (data?.data || [])
        setItems(list)
      } catch (e) {
        setError(e.message || 'Gagal memuat pendaftar')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function formatDate(dateString) {
    if (!dateString) return '-'
    try { return new Date(dateString).toLocaleString('id-ID') } catch { return dateString }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pendaftar Open Trip</h1>
        <p className="text-slate-400">Daftar semua peserta yang mendaftar open trip</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">{error}</div>
      )}

      {loading ? (
        <div className="text-slate-400">Memuat data…</div>
      ) : items.length === 0 ? (
        <div className="text-slate-400">Belum ada pendaftar.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/60">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Waktu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Trip</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Peserta</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Kontak</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Darurat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((r, i) => (
                <tr key={r.id || i} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-sm text-slate-300">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{r.nama_trip || `Trip #${r.trip_id}`}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{r.nama_lengkap}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{r.jumlah_peserta}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{r.email} • {r.nomor_hp}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{r.kontak_darurat_nama || '-'} • {r.kontak_darurat_nomor || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                      {r.status}
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


