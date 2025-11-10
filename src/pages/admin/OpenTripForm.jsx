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
    judul: '',
    destinasi: '',
    tanggal: '',
    harga: '',
    kuota: '',
    deskripsi: '',
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
      
      setFormData({
        judul: trip?.judul || trip?.title || trip?.nama || '',
        destinasi: trip?.destinasi || trip?.destination || '',
        tanggal: trip?.tanggal || trip?.date || '',
        harga: trip?.harga || trip?.price || '',
        kuota: trip?.kuota || trip?.quota || '',
        deskripsi: trip?.deskripsi || trip?.description || '',
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
      if (isEdit) {
        await apiPut(`/api/open-trips/${id}`, formData)
      } else {
        await apiPost('/api/open-trips', formData)
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
                Judul Trip *
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                required
                placeholder="Contoh: Open Trip Gunung Bromo"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Destinasi *
              </label>
              <input
                type="text"
                name="destinasi"
                value={formData.destinasi}
                onChange={handleChange}
                required
                placeholder="Contoh: Gunung Bromo"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tanggal *
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kuota
                </label>
                <input
                  type="number"
                  name="kuota"
                  value={formData.kuota}
                  onChange={handleChange}
                  min="1"
                  placeholder="Jumlah peserta"
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Harga (Rp) *
              </label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                required
                min="0"
                placeholder="500000"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows="5"
                placeholder="Detail informasi trip..."
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

