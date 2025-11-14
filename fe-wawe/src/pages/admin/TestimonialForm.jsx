import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiGet, apiPost, apiPut } from '../../lib/api'

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nama: '',
    trip: '',
    rating: '',
    ulasan: '',
  })

  useEffect(() => {
    if (isEdit) {
      fetchTestimonial()
    }
  }, [id])

  async function fetchTestimonial() {
    try {
      const data = await apiGet(`/api/testimonials/${id}`)
      const testi = data?.testimonial || data?.data || data
      
      setFormData({
        nama: testi?.nama || testi?.name || '',
        trip: testi?.trip || testi?.nama_trip || '',
        rating: testi?.rating || testi?.nilai || '',
        ulasan: testi?.ulasan || testi?.review || testi?.deskripsi || '',
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
        await apiPut(`/api/testimonials/${id}`, formData)
      } else {
        await apiPost('/api/testimonials', formData)
      }
      navigate('/admin/testimonials')
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
          {isEdit ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
        </h1>
        <p className="text-slate-400">
          Isi form di bawah untuk {isEdit ? 'mengubah' : 'menambah'} testimoni
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
                Nama Pengulas *
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                placeholder="Nama lengkap pengulas"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nama Trip *
              </label>
              <input
                type="text"
                name="trip"
                value={formData.trip}
                onChange={handleChange}
                required
                placeholder="Contoh: Open Trip Gunung Bromo"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rating (1-5) *
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                min="1"
                max="5"
                placeholder="1 - 5"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ulasan *
              </label>
              <textarea
                name="ulasan"
                value={formData.ulasan}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Tulis ulasan dari pengulas..."
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(251,191,36,0.35)] transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Update' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/testimonials')}
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

