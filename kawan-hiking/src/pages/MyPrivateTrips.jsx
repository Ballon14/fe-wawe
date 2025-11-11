import React, { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import { Link } from 'react-router-dom'

export default function MyPrivateTrips() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all') // all | disetujui | ditolak | pending | diproses

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const data = await apiGet('/api/private-trips/my')
        let list = Array.isArray(data) ? data : (data?.data || [])
        setItems(list)
      } catch (e) {
        setError(e.message || 'Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function parseForm(row) {
    try {
      return typeof row.custom_form === 'string' ? JSON.parse(row.custom_form) : (row.custom_form || {})
    } catch {
      return {}
    }
  }

  function badgeClass(status) {
    const s = String(status || '').toLowerCase()
    if (s === 'disetujui' || s === 'aktif') return 'bg-green-500/20 text-green-300'
    if (s === 'ditolak') return 'bg-red-500/20 text-red-300'
    if (s === 'diproses') return 'bg-blue-500/20 text-blue-300'
    return 'bg-yellow-500/20 text-yellow-300'
  }

  const displayed = items.filter((it) => {
    const f = parseForm(it)
    if (filter === 'all') return true
    return String(f.status || it.status || 'pending').toLowerCase() === filter
  })

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Status Permintaan Private Trip</h1>
            <Link
              to="/private-trip"
              className="rounded-lg border border-cyan-400/60 px-4 py-2 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
            >
              Buat Permintaan Baru
            </Link>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-slate-400 text-sm">Filter:</span>
            <select
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="disetujui">Disetujui</option>
              <option value="diproses">Diproses</option>
              <option value="pending">Pending</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-slate-400">Memuat data…</div>
          ) : displayed.length === 0 ? (
            <div className="text-slate-400">Belum ada permintaan atau tidak ada data sesuai filter.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800/40">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Destinasi</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Tgl Pesan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Tgl Berangkat</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Peserta</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {displayed.map((r, i) => {
                    const f = parseForm(r)
                    const status = (f.status || r.status || 'pending').toLowerCase()
                    return (
                      <tr key={r.id || i} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-sm text-slate-200">{r.destinasi}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {(r.created_at && new Date(r.created_at).toLocaleDateString('id-ID')) || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {(f.tanggal_keberangkatan && new Date(f.tanggal_keberangkatan).toLocaleDateString('id-ID')) || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">{f.jumlah_peserta || r.min_peserta || 1}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass(status)}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




