import React, { useEffect, useState } from 'react'
import { apiGet, apiPut, apiDelete } from '../../lib/api'

export default function ManagePrivateTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [report, setReport] = useState({ year: new Date().getFullYear(), data: [] })
  const [reportLoading, setReportLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchTrips()
    fetchReport(year)
  }, [])

  useEffect(() => {
    fetchReport(year)
  }, [year])

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

  async function fetchReport(selectedYear) {
    setReportLoading(true)
    try {
      const data = await apiGet(`/api/private-trips/report?year=${selectedYear}`)
      if (data?.data) {
        setReport(data)
      } else if (Array.isArray(data)) {
        setReport({ year: selectedYear, data })
      } else {
        setReport({ year: selectedYear, data: [] })
      }
    } catch (e) {
      setReport({ year: selectedYear, data: [] })
    } finally {
      setReportLoading(false)
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

  function extractRequestFields(row) {
    let form = {}
    let parseError = false
    try {
      if (row?.custom_form) {
        if (typeof row.custom_form === 'string') {
          try {
            form = JSON.parse(row.custom_form)
          } catch(e) {
            // Jika error JSON parse, fallback to empty object dan catat error
            parseError = true
            form = {}
          }
        } else {
          form = row.custom_form
        }
      }
    } catch {
      form = {}
      parseError = true
    }

    // Return hasil beserta flag error
    return {
      pemesan: form.username || row?.username || '-',
      destinasi: row?.destinasi || row?.nama_destinasi || '-',
      guide: form.guide_name || row?.guide_name || '-',
      tanggal: form.tanggal_keberangkatan || row?.tanggal_keberangkatan || null,
      peserta: form.jumlah_peserta || row?.jumlah_peserta || row?.min_peserta || 1,
      status: form.status || row?.status || 'pending',
      parseError,
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Private Trip</h1>
      </div>

      {/* Laporan Bulanan */}
      <div className="mb-8 rounded-xl border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/60">
          <h2 className="text-lg font-semibold">Laporan Bulanan</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-300">Tahun</label>
            <select
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 5 }).map((_, idx) => {
                const y = new Date().getFullYear() - idx
                return <option key={y} value={y}>{y}</option>
              })}
            </select>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          {reportLoading ? (
            <div className="text-slate-400">Memuat laporan…</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/40">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Bulan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Aktif</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Pending</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Ditolak</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Total Peserta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {report.data.map((r) => (
                  <tr key={r.month} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-sm text-slate-200">
                      {new Date(r.month + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.total}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.aktif}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.pending}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.ditolak}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.total_peserta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Tgl Pesan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Tgl Berangkat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Peserta</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trips.map((t, i) => {
                const f = extractRequestFields(t)
                return (
                <tr key={t?.id || t?._id || i} className={`hover:bg-slate-800/40${f.parseError ? ' bg-red-950/20' : ''}`}>
                  <td className="px-4 py-3 text-sm text-slate-200">
                    {f.pemesan}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {f.destinasi}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {f.guide || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {formatDate(t?.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {formatDate(f.tanggal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {f.peserta}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                        onClick={async () => {
                          try {
                            await apiPut(`/api/private-trips/${t?.id || t?._id || i}/status`, { status: 'disetujui' })
                            setTrips((prev) => prev.map((row, idx) => idx === i
                              ? { ...row, custom_form: JSON.stringify({ ...(typeof row.custom_form === 'string' ? JSON.parse(row.custom_form || '{}') : (row.custom_form || {})), status: 'disetujui' }) }
                              : row))
                          } catch (e) {
                            alert(e.message)
                          }
                        }}
                      >
                        Setujui
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        onClick={async () => {
                          try {
                            await apiPut(`/api/private-trips/${t?.id || t?._id || i}/status`, { status: 'ditolak' })
                            setTrips((prev) => prev.map((row, idx) => idx === i
                              ? { ...row, custom_form: JSON.stringify({ ...(typeof row.custom_form === 'string' ? JSON.parse(row.custom_form || '{}') : (row.custom_form || {})), status: 'ditolak' }) }
                              : row))
                          } catch (e) {
                            alert(e.message)
                          }
                        }}
                      >
                        Tolak
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30"
                        onClick={async () => {
                          if (!confirm('Hapus permintaan private trip ini?')) return
                          try {
                            await apiDelete(`/api/private-trips/${t?.id || t?._id || i}`)
                            setTrips((prev) => prev.filter((_, idx) => idx !== i))
                          } catch (e) {
                            alert(e.message)
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-red-400" colSpan={9} style={{ display: f.parseError ? 'table-cell' : 'none' }}>
                    ⚠️ Data error: custom_form korup atau tidak valid JSON
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


