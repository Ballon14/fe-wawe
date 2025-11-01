import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { apiGet, apiPost, apiPut } from "../../lib/api"

export default function DestinasiForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id

    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        nama_destinasi: "",
        lokasi: "",
        ketinggian: "",
        kesulitan: "",
        durasi: "",
        deskripsi: "",
        gambar: "",
        jalur_pendakian: "",
        fasilitas: "",
        tips: "",
    })

    useEffect(() => {
        if (isEdit) {
            fetchDestinasi()
        }
    }, [id])

    async function fetchDestinasi() {
        try {
            const data = await apiGet(`/api/destinations/${id}`)
            const dest = data?.destination || data?.data || data

            // Parse JSON fields if they are strings
            function parseJsonField(field) {
                if (!field) return ""
                if (typeof field === "string") {
                    try {
                        return JSON.parse(field).join(", ")
                    } catch {
                        return field
                    }
                }
                if (Array.isArray(field)) {
                    return field.join(", ")
                }
                return field
            }

            setFormData({
                nama_destinasi:
                    dest?.nama_destinasi ||
                    dest?.nama_gunung ||
                    dest?.nama ||
                    dest?.name ||
                    "",
                lokasi: dest?.lokasi || dest?.location || "",
                ketinggian:
                    dest?.ketinggian || dest?.elevation || dest?.tinggi || "",
                kesulitan: (
                    dest?.kesulitan ||
                    dest?.level_kesulitan ||
                    dest?.difficulty ||
                    ""
                ).toLowerCase(),
                durasi:
                    dest?.durasi ||
                    dest?.durasi_normal ||
                    dest?.duration ||
                    dest?.estimasi_waktu ||
                    "",
                deskripsi: dest?.deskripsi || dest?.description || "",
                gambar: dest?.gambar || dest?.image || dest?.foto || "",
                jalur_pendakian: parseJsonField(dest?.jalur_pendakian),
                fasilitas: parseJsonField(dest?.fasilitas),
                tips: parseJsonField(dest?.tips),
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

    function parseArrayField(value) {
        if (!value) return []
        if (typeof value === "string") {
            return value
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
        }
        if (Array.isArray(value)) {
            return value
        }
        return []
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError("")

        try {
            // Convert comma-separated strings to JSON arrays
            const submitData = {
                ...formData,
                jalur_pendakian: formData.jalur_pendakian
                    ? JSON.stringify(parseArrayField(formData.jalur_pendakian))
                    : null,
                fasilitas: formData.fasilitas
                    ? JSON.stringify(parseArrayField(formData.fasilitas))
                    : null,
                tips: formData.tips
                    ? JSON.stringify(parseArrayField(formData.tips))
                    : null,
            }

            if (isEdit) {
                await apiPut(`/api/destinations/${id}`, submitData)
            } else {
                await apiPost("/api/destinations", submitData)
            }
            navigate("/admin/destinasi")
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
                    {isEdit ? "Edit Destinasi" : "Tambah Destinasi Baru"}
                </h1>
                <p className="text-slate-400">
                    Isi form di bawah untuk {isEdit ? "mengubah" : "menambah"}{" "}
                    destinasi
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
                                Nama Destinasi *
                            </label>
                            <input
                                type="text"
                                name="nama_destinasi"
                                value={formData.nama_destinasi}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Lokasi *
                            </label>
                            <input
                                type="text"
                                name="lokasi"
                                value={formData.lokasi}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Ketinggian (mdpl) *
                                </label>
                                <input
                                    type="number"
                                    name="ketinggian"
                                    value={formData.ketinggian}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                    placeholder="Contoh: 3145"
                                    className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Kesulitan *
                                </label>
                                <select
                                    name="kesulitan"
                                    value={formData.kesulitan}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                                >
                                    <option value="">Pilih...</option>
                                    <option value="mudah">Mudah</option>
                                    <option value="sedang">Sedang</option>
                                    <option value="sulit">Sulit</option>
                                    <option value="sangat sulit">
                                        Sangat Sulit
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Durasi
                            </label>
                            <input
                                type="text"
                                name="durasi"
                                value={formData.durasi}
                                onChange={handleChange}
                                placeholder="Contoh: 2 hari 1 malam"
                                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                            />
                        </div>

                        {/* Upload gambar + preview */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Upload Gambar
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0]
                                    if (file) {
                                        const formDataFile = new FormData()
                                        formDataFile.append("file", file)
                                        try {
                                            const resp = await fetch(
                                                "/api/uploads/image",
                                                {
                                                    method: "POST",
                                                    body: formDataFile,
                                                }
                                            )
                                            if (!resp.ok)
                                                throw new Error("Upload gagal")
                                            const data = await resp.json()
                                            if (data.url) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    gambar: data.url,
                                                }))
                                            } else {
                                                alert(
                                                    "Response API upload gambar tidak mengandung url."
                                                )
                                            }
                                        } catch (err) {
                                            alert(
                                                "Gagal upload gambar: " +
                                                    err.message
                                            )
                                        }
                                    }
                                }}
                                className="block w-full text-slate-100 border border-slate-400/30 rounded-lg bg-slate-800/70 file:bg-slate-700 file:text-slate-300 file:rounded-lg file:border-none"
                            />
                            {formData.gambar && (
                                <img
                                    src={formData.gambar}
                                    alt="Preview Gambar"
                                    style={{
                                        maxHeight: 190,
                                        marginTop: 8,
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Gambar (URL)
                            </label>
                            <input
                                type="url"
                                name="gambar"
                                value={formData.gambar}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
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

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Jalur Pendakian (pisahkan dengan koma)
                            </label>
                            <input
                                type="text"
                                name="jalur_pendakian"
                                value={formData.jalur_pendakian}
                                onChange={handleChange}
                                placeholder="Contoh: Via Cibodas, Via Selabintana"
                                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Fasilitas (pisahkan dengan koma)
                            </label>
                            <input
                                type="text"
                                name="fasilitas"
                                value={formData.fasilitas}
                                onChange={handleChange}
                                placeholder="Contoh: Basecamp, Toilet, Parkir"
                                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Tips (pisahkan dengan koma)
                            </label>
                            <textarea
                                name="tips"
                                value={formData.tips}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Contoh: Bawa jaket tebal, Siapkan fisik yang prima"
                                className="w-full rounded-lg border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300 disabled:opacity-50"
                        >
                            {saving
                                ? "Menyimpan..."
                                : isEdit
                                ? "Update"
                                : "Simpan"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/destinasi")}
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
