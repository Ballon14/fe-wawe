import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiDelete } from '../../lib/api'

export default function ManageGuides() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchGuides()
  }, [])

  async function fetchGuides() {
    setLoading(true)
    setError('')
    try {
      const data = await apiGet('/api/guides')
      let guideList = []
      if (Array.isArray(data)) {
        guideList = data
      } else if (data?.guides) {
        guideList = data.guides
      } else if (data?.data) {
        guideList = data.data
      }
      setGuides(guideList)
    } catch (e) {
      setError(`Gagal mengambil data: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, index) {
    if (!window.confirm('Apakah Anda yakin ingin menghapus guide ini?')) {
      return
    }

    setDeleteLoading(index)
    try {
      await apiDelete(`/api/guides/${id}`)
      // Refresh data setelah delete
      await fetchGuides()
    } catch (e) {
      alert(`Gagal menghapus: ${e.message}`)
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Kelola Guide
          </h1>
          <p className="text-slate-400">Tambah, edit, atau hapus data guide</p>
        </div>
        <Link
          to="/admin/guides/tambah"
          className="px-6 py-3 rounded-lg bg-gradient-to-tr from-purple-400 to-pink-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(168,85,247,0.35)] transition-all duration-300"
        >
          + Tambah Guide
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-6 py-4">
          {error}
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-slate-700/50 bg-slate-800/50">
          <p className="text-slate-400 mb-4">Belum ada guide</p>
          <Link
            to="/admin/guides/tambah"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-purple-400 to-pink-400 text-slate-900 font-bold"
          >
            Tambah Guide Pertama
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-slate-300 font-semibold">Nama</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Email</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Pengalaman</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Rating</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
                <th className="text-right p-4 text-slate-300 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide, index) => (
                <tr
                  key={guide?.id || guide?._id || index}
                  className="border-b border-slate-700/30 hover:bg-slate-800/70 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">
                      {guide?.nama || 'Tanpa Nama'}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">
                    {guide?.email || '-'}
                  </td>
                  <td className="p-4 text-slate-300">
                    {guide?.pengalaman || '-'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-lg bg-yellow-400/10 text-yellow-400 text-sm border border-yellow-400/20">
                      ⭐ {guide?.rating || '0.0'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-sm border ${
                      guide?.status === 'aktif' 
                        ? 'bg-green-400/10 text-green-400 border-green-400/20' 
                        : 'bg-red-400/10 text-red-400 border-red-400/20'
                    }`}>
                      {guide?.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/guides/edit/${guide?.id || guide?._id}`}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(guide?.id || guide?._id, index)
                        }
                        disabled={deleteLoading === index}
                        className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === index ? '...' : 'Hapus'}
                      </button>
                    </div>
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

