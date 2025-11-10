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
    email: '',
    pengalaman: '',
    rating: '',
    alamat: '',
    spesialisasi: '',
    deskripsi: '',
    foto: '',
    sertifikat: '',
    status: 'aktif',
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
      
      // Parse spesialisasi
      let spesialisasiStr = ''
      if (guide?.spesialisasi) {
        if (Array.isArray(guide.spesialisasi)) {
          spesialisasiStr = guide.spesialisasi.join(', ')
        } else if (typeof guide.spesialisasi === 'string') {
          try {
            const parsed = JSON.parse(guide.spesialisasi)
            spesialisasiStr = Array.isArray(parsed) ? parsed.join(', ') : guide.spesialisasi
          } catch {
            spesialisasiStr = guide.spesialisasi
          }
        }
      }

      // Parse sertifikat
      let sertifikatStr = ''
      if (guide?.sertifikat) {
        if (Array.isArray(guide.sertifikat)) {
          sertifikatStr = guide.sertifikat.join(', ')
        } else if (typeof guide.sertifikat === 'string') {
          try {
            const parsed = JSON.parse(guide.sertifikat)
            sertifikatStr = Array.isArray(parsed) ? parsed.join(', ') : guide.sertifikat
          } catch {
            sertifikatStr = guide.sertifikat
          }
        }
      }
      
      setFormData({
        nama: guide?.nama || '',
        email: guide?.email || '',
        pengalaman: guide?.pengalaman || '',
        rating: guide?.rating || '',
        alamat: guide?.alamat || '',
        spesialisasi: spesialisasiStr,
        deskripsi: guide?.deskripsi || '',
        foto: guide?.foto || '',
        sertifikat: sertifikatStr,
        status: guide?.status || 'aktif',
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
        nama: formData.nama,
        email: formData.email || null,
        pengalaman: formData.pengalaman || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        alamat: formData.alamat || null,
        spesialisasi: formData.spesialisasi
          ? formData.spesialisasi.split(',').map((s) => s.trim()).filter(s => s)
          : [],
        deskripsi: formData.deskripsi || null,
        foto: formData.foto || null,
        sertifikat: formData.sertifikat
          ? formData.sertifikat.split(',').map((s) => s.trim()).filter(s => s)
          : [],
        status: formData.status || 'aktif',
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="guide@example.com"
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
                placeholder="Contoh: Gunung Bromo, Gunung Semeru, Pendakian Jarak Jauh"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <p className="mt-1 text-xs text-slate-400">
                Masukkan spesialisasi guide, pisahkan dengan koma
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sertifikat (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="sertifikat"
                value={formData.sertifikat}
                onChange={handleChange}
                placeholder="Contoh: Sertifikat Pemandu Gunung APGI, Lisensi Pemandu Geowisata"
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <p className="mt-1 text-xs text-slate-400">
                Masukkan sertifikat atau lisensi yang dimiliki, pisahkan dengan koma
              </p>
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
                placeholder="Masukkan deskripsi lengkap tentang guide..."
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <p className="mt-1 text-xs text-slate-400">
                Deskripsi lengkap tentang guide, pengalaman, keahlian, dll.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <option value="aktif">Aktif</option>
                <option value="tidak aktif">Tidak Aktif</option>
              </select>
              <p className="mt-1 text-xs text-slate-400">
                Status guide (aktif/tidak aktif)
              </p>
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

