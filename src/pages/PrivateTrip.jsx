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
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [bookingData, setBookingData] = useState(null)
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

    // Handle ESC key to close modal
    useEffect(() => {
        function handleEscape(e) {
            if (e.key === "Escape" && showSuccessModal) {
                setShowSuccessModal(false)
            }
        }
        if (showSuccessModal) {
            document.addEventListener("keydown", handleEscape)
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [showSuccessModal])

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

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

            // Get destination name for modal
            const selectedDestination = destinations.find(
                (d) => (d?.id || d?._id) == formData.destinasi_id
            )
            const destinationName =
                selectedDestination?.nama_destinasi ||
                selectedDestination?.nama_gunung ||
                selectedDestination?.nama ||
                "Destinasi"

            // Get guide name if selected
            const selectedGuide = formData.guide_id
                ? guides.find((g) => (g?.id || g?._id) == formData.guide_id)
                : null
            const guideName = selectedGuide?.nama || selectedGuide?.name || null

            // Set booking data for modal
            setBookingData({
                destination: destinationName,
                guide: guideName,
                tanggal: formData.tanggal_keberangkatan,
                jumlahPeserta: formData.jumlah_peserta,
                bookingId: response.id || response.data?.id,
            })

            // Show success modal
            setShowSuccessModal(true)

            // Reset form
            setFormData({
                destinasi_id: "",
                guide_id: "",
                tanggal_keberangkatan: "",
                jumlah_peserta: "",
                catatan: "",
            })

            // Refresh my requests list
            if (user && token) {
                try {
                    const myData = await apiGet("/api/private-trips/my")
                    let reqList = []
                    if (Array.isArray(myData)) {
                        reqList = myData
                    } else if (myData?.data) {
                        reqList = myData.data
                    }
                    setMyRequests(reqList)
                } catch (e) {
                    console.error("Error refreshing requests:", e)
                }
            }
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

                    <div className="mb-6 text-center">
                        <Link
                            to="/status-private-trip"
                            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/60 px-4 py-2 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
                        >
                            Lihat Semua Status Permintaan
                        </Link>
                    </div>

                    {user && myRequests.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-slate-100">
                                    Status Permintaan Anda
                                </h2>
                                <span className="text-sm text-slate-400">
                                    Menampilkan {Math.min(myRequests.length, 5)}{" "}
                                    dari {myRequests.length} permintaan
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {myRequests.slice(0, 5).map((r, i) => {
                                    let form = {}
                                    try {
                                        form =
                                            typeof r.custom_form === "string"
                                                ? JSON.parse(r.custom_form)
                                                : r.custom_form || {}
                                    } catch {}
                                    const status = (
                                        form.status || "pending"
                                    ).toLowerCase()
                                    const badgeConfig =
                                        status === "disetujui"
                                            ? {
                                                  bg: "bg-green-500/20",
                                                  text: "text-green-300",
                                                  border: "border-green-500/30",
                                                  icon: (
                                                      <svg
                                                          className="w-5 h-5"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                      >
                                                          <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M5 13l4 4L19 7"
                                                          />
                                                      </svg>
                                                  ),
                                              }
                                            : status === "ditolak"
                                            ? {
                                                  bg: "bg-red-500/20",
                                                  text: "text-red-300",
                                                  border: "border-red-500/30",
                                                  icon: (
                                                      <svg
                                                          className="w-5 h-5"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                      >
                                                          <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M6 18L18 6M6 6l12 12"
                                                          />
                                                      </svg>
                                                  ),
                                              }
                                            : status === "diproses"
                                            ? {
                                                  bg: "bg-blue-500/20",
                                                  text: "text-blue-300",
                                                  border: "border-blue-500/30",
                                                  icon: (
                                                      <svg
                                                          className="w-5 h-5"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                      >
                                                          <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                          />
                                                      </svg>
                                                  ),
                                              }
                                            : {
                                                  bg: "bg-yellow-500/20",
                                                  text: "text-yellow-300",
                                                  border: "border-yellow-500/30",
                                                  icon: (
                                                      <svg
                                                          className="w-5 h-5"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                      >
                                                          <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                          />
                                                      </svg>
                                                  ),
                                              }

                                    const tanggalPesan = r.created_at
                                        ? new Date(
                                              r.created_at
                                          ).toLocaleDateString("id-ID", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                          })
                                        : "-"

                                    const tanggalBerangkat =
                                        form.tanggal_keberangkatan
                                            ? new Date(
                                                  form.tanggal_keberangkatan
                                              ).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "-"

                                    const jumlahPeserta =
                                        form.jumlah_peserta ||
                                        r.min_peserta ||
                                        1

                                    return (
                                        <div
                                            key={r.id || i}
                                            className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] hover:-translate-y-1"
                                        >
                                            <div className="p-6">
                                                {/* Header dengan Status Badge */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-slate-100 mb-2 line-clamp-2">
                                                            {r.destinasi}
                                                        </h3>
                                                    </div>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text} ${badgeConfig.border} border`}
                                                    >
                                                        {badgeConfig.icon}
                                                        <span className="capitalize">
                                                            {status}
                                                        </span>
                                                    </span>
                                                </div>

                                                {/* Detail Information */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                                                        <svg
                                                            className="w-4 h-4 text-cyan-400 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <div className="flex-1">
                                                            <span className="text-slate-400">
                                                                Tgl Pesan:
                                                            </span>{" "}
                                                            <span className="font-medium">
                                                                {tanggalPesan}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                                                        <svg
                                                            className="w-4 h-4 text-cyan-400 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <div className="flex-1">
                                                            <span className="text-slate-400">
                                                                Tgl Berangkat:
                                                            </span>{" "}
                                                            <span className="font-medium">
                                                                {
                                                                    tanggalBerangkat
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                                                        <svg
                                                            className="w-4 h-4 text-cyan-400 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                            />
                                                        </svg>
                                                        <div className="flex-1">
                                                            <span className="text-slate-400">
                                                                Peserta:
                                                            </span>{" "}
                                                            <span className="font-medium">
                                                                {jumlahPeserta}{" "}
                                                                orang
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {form.guide_name && (
                                                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                                                            <svg
                                                                className="w-4 h-4 text-cyan-400 flex-shrink-0"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                />
                                                            </svg>
                                                            <div className="flex-1">
                                                                <span className="text-slate-400">
                                                                    Guide:
                                                                </span>{" "}
                                                                <span className="font-medium">
                                                                    {
                                                                        form.guide_name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer dengan Link */}
                                                <div className="mt-5 pt-4 border-t border-slate-700/50">
                                                    <Link
                                                        to="/status-private-trip"
                                                        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                                                    >
                                                        <span>
                                                            Lihat Detail
                                                        </span>
                                                        <svg
                                                            className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
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

            {/* Success Modal */}
            {showSuccessModal && bookingData && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setShowSuccessModal(false)}
                >
                    <div
                        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-8 shadow-2xl animate-scaleIn transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white text-center mb-3">
                            Booking Berhasil!
                        </h3>

                        {/* Message */}
                        <p className="text-slate-300 text-center mb-6">
                            Permintaan private trip Anda berhasil dikirim. Admin
                            akan menghubungi Anda segera untuk konfirmasi dan
                            detail pembayaran.
                        </p>

                        {/* Booking Details */}
                        <div className="bg-slate-900/50 rounded-lg p-4 mb-6 space-y-3 border border-slate-700/50">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">
                                    Destinasi:
                                </span>
                                <span className="text-slate-200 font-semibold">
                                    {bookingData.destination}
                                </span>
                            </div>
                            {bookingData.guide && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">
                                        Guide:
                                    </span>
                                    <span className="text-slate-200 font-semibold">
                                        {bookingData.guide}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">
                                    Tanggal:
                                </span>
                                <span className="text-slate-200 font-semibold">
                                    {new Date(
                                        bookingData.tanggal
                                    ).toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">
                                    Jumlah Peserta:
                                </span>
                                <span className="text-slate-200 font-semibold">
                                    {bookingData.jumlahPeserta} orang
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false)
                                    navigate("/status-private-trip")
                                }}
                                className="w-full py-3 px-4 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
                            >
                                Lihat Status Booking
                            </button>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-2 px-4 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
