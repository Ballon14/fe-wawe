import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiDelete } from '../../lib/api'

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    setLoading(true)
    setError('')
    try {
      const data = await apiGet('/api/testimonials')
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
      // If endpoint doesn't exist, use empty array
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, index) {
    if (!confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
      return
    }

    setDeleteLoading(index)
    try {
      await apiDelete(`/api/testimonials/${id}`)
      setTestimonials(testimonials.filter((t) => (t.id || t._id) !== id))
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
            Kelola Testimoni
          </h1>
          <p className="text-slate-400">Tambah, edit, atau hapus testimoni</p>
        </div>
        <Link
          to="/admin/testimonials/tambah"
          className="px-6 py-3 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(251,191,36,0.35)] transition-all duration-300"
        >
          + Tambah Testimoni
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
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-slate-700/50 bg-slate-800/50">
          <p className="text-slate-400 mb-4">Belum ada testimoni</p>
          <Link
            to="/admin/testimonials/tambah"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-400 text-slate-900 font-bold"
          >
            Tambah Testimoni Pertama
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-slate-300 font-semibold">Nama</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Trip</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Rating</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Ulasan</th>
                <th className="text-right p-4 text-slate-300 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testi, index) => (
                <tr
                  key={testi?.id || testi?._id || index}
                  className="border-b border-slate-700/30 hover:bg-slate-800/70 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">
                      {testi?.nama || testi?.name || 'Tanpa Nama'}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {testi?.trip || testi?.nama_trip || '-'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-lg bg-yellow-400/10 text-yellow-400 text-sm border border-yellow-400/20">
                      ⭐ {testi?.rating || testi?.nilai || '0'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-sm max-w-md">
                    <div className="line-clamp-2">
                      {testi?.ulasan || testi?.review || testi?.deskripsi || '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/testimonials/edit/${testi?.id || testi?._id}`}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(testi?.id || testi?._id, index)
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

