import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiGet, apiPost, apiPut } from '../../lib/api'

export default function OpenTripForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nama_trip: '',
    tanggal_berangkat: '',
    durasi: '',
    kuota: '',
    harga_per_orang: '',
    fasilitas: '',
    itinerary: '',
    dokumentasi: '',
  })

  useEffect(() => {
    if (isEdit) {
      fetchTrip()
    }
  }, [id])

  async function fetchTrip() {
    try {
      const data = await apiGet(`/api/open-trips/${id}`)
      const trip = data?.trip || data?.data || data
      
      // Parse JSON fields
      let fasilitasStr = ''
      if (trip?.fasilitas) {
        if (typeof trip.fasilitas === 'string') {
          try {
            const parsed = JSON.parse(trip.fasilitas)
            fasilitasStr = typeof parsed === 'string' ? parsed : ''
          } catch {
            fasilitasStr = trip.fasilitas
          }
        } else {
          fasilitasStr = trip.fasilitas
        }
      }
      
      setFormData({
        nama_trip: trip?.nama_trip || '',
        tanggal_berangkat: trip?.tanggal_berangkat ? trip.tanggal_berangkat.split('T')[0] : '',
        durasi: trip?.durasi || '',
        kuota: trip?.kuota || '',
        harga_per_orang: trip?.harga_per_orang || '',
        fasilitas: fasilitasStr,
        itinerary: trip?.itinerary || '',
        dokumentasi: trip?.dokumentasi ? (typeof trip.dokumentasi === 'string' ? trip.dokumentasi : JSON.stringify(trip.dokumentasi)) : '',
      })
    } catch (e) {
      setError(`Gagal mengambil data: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const submitData = {
        nama_trip: formData.nama_trip,
        tanggal_berangkat: formData.tanggal_berangkat,
        durasi: formData.durasi ? parseInt(formData.durasi) : null,
        kuota: formData.kuota ? parseInt(formData.kuota) : null,
        harga_per_orang: formData.harga_per_orang ? parseInt(formData.harga_per_orang) : null,
        fasilitas: formData.fasilitas || null,
        itinerary: formData.itinerary || null,
        dokumentasi: formData.dokumentasi || null,
      }

      if (isEdit) {
        await apiPut(`/api/open-trips/${id}`, submitData)
      } else {
        await apiPost('/api/open-trips', submitData)
      }
      navigate('/admin/open-trips')
    } catch (e) {
      setError(`Gagal menyimpan: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          {isEdit ? 'Edit Open Trip' : 'Tambah Open Trip Baru'}
        </h1>
        <p className="text-slate-400">
          Isi form di bawah untuk {isEdit ? 'mengubah' : 'menambah'} open trip
        </p>
      </div>

      <div className="max-w-3xl">
        {error && (
          <div className="mb-6 rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-6 py-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nama Trip *
              </label>
              <input
                type="text"
                name="nama_trip"
                value={formData.nama_trip}
                onChange={handleChange}
                required
                placeholder="Contoh: Explore Bromo Midnight 2D1N"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tanggal Berangkat *
                </label>
                <input
                  type="date"
                  name="tanggal_berangkat"
                  value={formData.tanggal_berangkat}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Durasi (hari) *
                </label>
                <input
                  type="number"
                  name="durasi"
                  value={formData.durasi}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Contoh: 2"
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kuota *
                </label>
                <input
                  type="number"
                  name="kuota"
                  value={formData.kuota}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Jumlah peserta"
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Harga per Orang (Rp) *
                </label>
                <input
                  type="number"
                  name="harga_per_orang"
                  value={formData.harga_per_orang}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="500000"
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fasilitas
              </label>
              <textarea
                name="fasilitas"
                value={formData.fasilitas}
                onChange={handleChange}
                rows="3"
                placeholder="Masukkan fasilitas yang disediakan..."
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Itinerary
              </label>
              <textarea
                name="itinerary"
                value={formData.itinerary}
                onChange={handleChange}
                rows="5"
                placeholder="Detail itinerary per hari..."
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-gradient-to-tr from-green-400 to-emerald-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(74,222,128,0.35)] transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Update' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/open-trips')}
              className="px-6 py-3 rounded-lg bg-slate-700 text-slate-100 font-medium hover:bg-slate-600 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

