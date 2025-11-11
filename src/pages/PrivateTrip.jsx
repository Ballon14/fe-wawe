import React, { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { apiGet, apiPost } from "../lib/api"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

export default function PrivateTrip() {
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const [destinations, setDestinations] = useState([])
    const [guides, setGuides] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [myRequests, setMyRequests] = useState([])

    // Form state
    const [formData, setFormData] = useState({
        destinasi_id: "",
        guide_id: "",
        tanggal_keberangkatan: "",
        jumlah_peserta: "",
        catatan: "",
    })

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // Fetch destinations dan guides secara parallel
                const promises = [
                    apiGet("/api/destinations").catch(() => []),
                    apiGet("/api/guides").catch(() => []),
                ]
                if (user && token) {
                    promises.push(
                        apiGet("/api/private-trips/my").catch(() => [])
                    )
                }
                const results = await Promise.all(promises)
                const destsData = results[0]
                const guidesData = results[1]
                const myData = results[2]

                // Process destinations
                let destList = []
                if (Array.isArray(destsData)) {
                    destList = destsData
                } else if (destsData?.data) {
                    destList = destsData.data
                }
                setDestinations(destList)

                // Process guides (only active)
                let guideList = []
                if (Array.isArray(guidesData)) {
                    guideList = guidesData
                } else if (guidesData?.data) {
                    guideList = guidesData.data
                }
                guideList = guideList.filter(
                    (guide) =>
                        !guide.status ||
                        guide.status === "aktif" ||
                        guide.status === "active"
                )
                setGuides(guideList)
                // My requests
                let reqList = []
                if (Array.isArray(myData)) {
                    reqList = myData
                } else if (myData?.data) {
                    reqList = myData.data
                }
                setMyRequests(reqList)
            } catch (e) {
                console.error("Error fetching data:", e)
                setError("Gagal memuat data destinasi dan guide")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSuccess("")

        // Validasi login
        if (!user || !token) {
            setError(
                "Anda harus login terlebih dahulu untuk membuat permintaan trip"
            )
            setTimeout(() => navigate("/login"), 2000)
            return
        }

        // Validasi form
        if (
            !formData.destinasi_id ||
            !formData.tanggal_keberangkatan ||
            !formData.jumlah_peserta
        ) {
            setError("Mohon lengkapi semua field yang wajib diisi")
            return
        }

        setSubmitting(true)
        try {
            // Kirim request ke backend
            // Note: Mungkin perlu endpoint khusus untuk user request private trip
            // Untuk sekarang, kita simpan sebagai catatan atau kirim ke admin
            const response = await apiPost("/api/private-trips/request", {
                destinasi_id: formData.destinasi_id,
                guide_id: formData.guide_id || null,
                tanggal_keberangkatan: formData.tanggal_keberangkatan,
                jumlah_peserta: parseInt(formData.jumlah_peserta),
                catatan: formData.catatan || null,
                username: user.username,
            })

            setSuccess(
                "Permintaan trip berhasil dikirim! Admin akan menghubungi Anda segera."
            )
            setFormData({
                destinasi_id: "",
                guide_id: "",
                tanggal_keberangkatan: "",
                jumlah_peserta: "",
                catatan: "",
            })
        } catch (e) {
            console.error("Error submitting request:", e)
            setError(
                e.message ||
                    "Gagal mengirim permintaan trip. Silakan coba lagi."
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Memuat data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-[95%] px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Private Trip
                    </h1>
                    <p className="text-center text-slate-400 mb-12">
                        Private Trip, bisa bebas pilih guide dan jadwal sesuka
                        hati
                    </p>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-center">
                            {success}
                        </div>
                    )}

                    <div className="mb-6 text-center">
                        <Link
                            to="/status-private-trip"
                            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/60 px-4 py-2 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
                        >
                            Lihat Semua Status Permintaan
                        </Link>
                    </div>

                    {user && myRequests.length > 0 && (
                        <div className="mb-8 rounded-xl border border-slate-700 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-800/60 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Status Permintaan Anda
                                </h2>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-700">
                                    <thead className="bg-slate-800/40">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                                Destinasi
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                                Tgl Pesan
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                                Tgl Berangkat
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                                Peserta
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {myRequests.slice(0, 5).map((r, i) => {
                                            let form = {}
                                            try {
                                                form =
                                                    typeof r.custom_form ===
                                                    "string"
                                                        ? JSON.parse(
                                                              r.custom_form
                                                          )
                                                        : r.custom_form || {}
                                            } catch {}
                                            const status = (
                                                form.status || "pending"
                                            ).toLowerCase()
                                            const badge =
                                                status === "disetujui"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : status === "ditolak"
                                                    ? "bg-red-500/20 text-red-300"
                                                    : status === "diproses"
                                                    ? "bg-blue-500/20 text-blue-300"
                                                    : "bg-yellow-500/20 text-yellow-300"
                                            return (
                                                <tr
                                                    key={r.id || i}
                                                    className="hover:bg-slate-800/30"
                                                >
                                                    <td className="px-4 py-3 text-sm text-slate-200">
                                                        {r.destinasi}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">
                                                        {(r.created_at &&
                                                            new Date(
                                                                r.created_at
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )) ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">
                                                        {(form.tanggal_keberangkatan &&
                                                            new Date(
                                                                form.tanggal_keberangkatan
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )) ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">
                                                        {form.jumlah_peserta ||
                                                            r.min_peserta ||
                                                            1}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge}`}
                                                        >
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
                        <h2 className="text-2xl font-semibold mb-4">
                            Custom Trip Anda
                        </h2>
                        <p className="text-slate-400 mb-8">
                            Rencanakan perjalanan pendakian yang sesuai dengan
                            kebutuhan Anda. Pilih destinasi, guide, dan waktu
                            yang Anda inginkan.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">
                                        Pilih Destinasi{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={formData.destinasi_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                destinasi_id: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="">
                                            -- Pilih Destinasi --
                                        </option>
                                        {destinations.map((dest) => (
                                            <option
                                                key={dest?.id || dest?._id}
                                                value={dest?.id || dest?._id}
                                            >
                                                {dest?.nama_destinasi ||
                                                    dest?.nama_gunung ||
                                                    dest?.nama ||
                                                    dest?.name ||
                                                    "Destinasi"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">
                                        Tanggal Keberangkatan{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.tanggal_keberangkatan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tanggal_keberangkatan:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">
                                        Pilih Guide (Opsional)
                                    </label>
                                    <select
                                        value={formData.guide_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                guide_id: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="">
                                            -- Pilih Guide (Opsional) --
                                        </option>
                                        {guides.map((guide) => (
                                            <option
                                                key={guide?.id || guide?._id}
                                                value={guide?.id || guide?._id}
                                            >
                                                {guide?.nama ||
                                                    guide?.name ||
                                                    "Guide"}
                                                {guide?.rating
                                                    ? ` (⭐ ${parseFloat(
                                                          guide.rating
                                                      ).toFixed(1)})`
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">
                                        Jumlah Peserta{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.jumlah_peserta}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                jumlah_peserta: e.target.value,
                                            })
                                        }
                                        required
                                        min="1"
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
                                        placeholder="Minimal 1 peserta"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    value={formData.catatan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            catatan: e.target.value,
                                        })
                                    }
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
                                    placeholder="Tambahkan catatan atau permintaan khusus untuk trip Anda..."
                                />
                            </div>

                            {!user || !token ? (
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                                    <p className="mb-2">
                                        Anda harus login terlebih dahulu untuk
                                        membuat permintaan trip.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/login")}
                                        className="text-cyan-400 hover:text-cyan-300 underline"
                                    >
                                        Klik di sini untuk login
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting
                                        ? "Mengirim..."
                                        : "Buat Permintaan Trip"}
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
