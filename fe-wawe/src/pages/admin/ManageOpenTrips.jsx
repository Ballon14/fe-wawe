import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiDelete } from '../../lib/api'

export default function ManageOpenTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchTrips()
  }, [])

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
      setError(`Gagal mengambil data: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, index) {
    if (!confirm('Apakah Anda yakin ingin menghapus open trip ini?')) {
      return
    }

    setDeleteLoading(index)
    try {
      await apiDelete(`/api/open-trips/${id}`)
      setTrips(trips.filter((t) => (t.id || t._id) !== id))
    } catch (e) {
      alert(`Gagal menghapus: ${e.message}`)
    } finally {
      setDeleteLoading(null)
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Kelola Open Trip
          </h1>
          <p className="text-slate-400">Tambah, edit, atau hapus open trip</p>
        </div>
        <Link
          to="/admin/open-trips/tambah"
          className="px-6 py-3 rounded-lg bg-gradient-to-tr from-green-400 to-emerald-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(74,222,128,0.35)] transition-all duration-300"
        >
          + Tambah Open Trip
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
      ) : trips.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-slate-700/50 bg-slate-800/50">
          <p className="text-slate-400 mb-4">Belum ada open trip</p>
          <Link
            to="/admin/open-trips/tambah"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-green-400 to-emerald-400 text-slate-900 font-bold"
          >
            Tambah Open Trip Pertama
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-slate-300 font-semibold">Judul</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Destinasi</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Tanggal</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Harga</th>
                <th className="text-right p-4 text-slate-300 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip, index) => (
                <tr
                  key={trip?.id || trip?._id || index}
                  className="border-b border-slate-700/30 hover:bg-slate-800/70 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">
                      {trip?.nama_trip || trip?.judul || trip?.title || trip?.nama || 'Tanpa Judul'}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {trip?.destinasi || trip?.destination || '-'}
                  </td>
                  <td className="p-4 text-slate-300">
                    {formatDate(trip?.tanggal_berangkat || trip?.tanggal || trip?.date)}
                  </td>
                  <td className="p-4">
                    <span className="text-green-400 font-semibold">
                      {trip?.harga_per_orang != null ? `Rp ${parseInt(trip.harga_per_orang).toLocaleString('id-ID')}` : (trip?.harga != null ? `Rp ${parseInt(trip.harga).toLocaleString('id-ID')}` : '-')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/open-trips/edit/${trip?.id || trip?._id}`}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(trip?.id || trip?._id, index)
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

