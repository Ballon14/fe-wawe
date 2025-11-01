import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiGet, apiPost, apiPut } from '../../lib/api'

export default function GuideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nama: '',
    pengalaman: '',
    rating: '',
    alamat: '',
    spesialisasi: '',
    deskripsi: '',
    foto: '',
  })

  useEffect(() => {
    if (isEdit) {
      fetchGuide()
    }
  }, [id])

  async function fetchGuide() {
    try {
      const data = await apiGet(`/api/guides/${id}`)
      const guide = data?.guide || data?.data || data
      
      setFormData({
        nama: guide?.nama || '',
        pengalaman: guide?.pengalaman || '',
        rating: guide?.rating || '',
        alamat: guide?.alamat || '',
        spesialisasi: Array.isArray(guide?.spesialisasi)
          ? guide.spesialisasi.join(', ')
          : typeof guide?.spesialisasi === 'string'
          ? guide.spesialisasi
          : '',
        deskripsi: guide?.deskripsi || '',
        foto: guide?.foto || '',
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
        ...formData,
        spesialisasi: formData.spesialisasi
          ? formData.spesialisasi.split(',').map((s) => s.trim())
          : [],
      }

      if (isEdit) {
        await apiPut(`/api/guides/${id}`, submitData)
      } else {
        await apiPost('/api/guides', submitData)
      }
      navigate('/admin/guides')
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
          {isEdit ? 'Edit Guide' : 'Tambah Guide Baru'}
        </h1>
        <p className="text-slate-400">
          Isi form di bawah untuk {isEdit ? 'mengubah' : 'menambah'} guide
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
                Nama Guide *
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pengalaman *
                </label>
                <input
                  type="text"
                  name="pengalaman"
                  value={formData.pengalaman}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: 5 tahun"
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0.0 - 5.0"
                  className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Alamat
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Spesialisasi (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="spesialisasi"
                value={formData.spesialisasi}
                onChange={handleChange}
                placeholder="Contoh: Gunung Bromo, Gunung Semeru"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Foto URL
              </label>
              <input
                type="url"
                name="foto"
                value={formData.foto}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
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
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-gradient-to-tr from-purple-400 to-pink-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(168,85,247,0.35)] transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Update' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/guides')}
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

