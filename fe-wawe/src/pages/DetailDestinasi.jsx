import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { apiGet } from "../lib/api"

export default function DetailDestinasi() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [destinasi, setDestinasi] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchDestinasi() {
            setLoading(true)
            setError("")
            try {
                console.log("Fetching destination detail from /api/destinations/" + id)
                const data = await apiGet(`/api/destinations/${id}`)
                console.log("Destination detail data:", data)
                
                // Handle different response formats
                let destData = null
                if (data && typeof data === "object") {
                    if (data.destination) {
                        destData = data.destination
                    } else if (data.data) {
                        destData = data.data
                    } else {
                        destData = data
                    }
                }
                
                if (!destData) {
                    throw new Error("Data destinasi tidak ditemukan")
                }
                
                setDestinasi(destData)
            } catch (e) {
                console.error("Error fetching destination:", e)
                setError(`Gagal mengambil data destinasi: ${e.message}`)
            } finally {
                setLoading(false)
            }
        }
        
        if (id) {
            fetchDestinasi()
        }
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Memuat detail destinasi...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen py-20">
                <div className="mx-auto w-full max-w-[95%] px-4">
                    <div className="max-w-3xl mx-auto text-center py-12">
                        <div className="inline-block rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-6 py-4 mb-6">
                            {error}
                        </div>
                        <Link
                            to="/destinasi"
                            className="inline-block rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-6 py-3 font-bold text-slate-900 hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
                        >
                            Kembali ke Daftar Destinasi
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!destinasi) {
        return null
    }

    const nama = destinasi?.nama_gunung || destinasi?.nama || destinasi?.name || destinasi?.nama_destinasi || "Destinasi Tanpa Nama"
    const lokasi = destinasi?.lokasi || destinasi?.location || "-"
    const ketinggian = destinasi?.ketinggian || destinasi?.elevation || destinasi?.tinggi || "-"
    const kesulitan = destinasi?.level_kesulitan || destinasi?.difficulty || destinasi?.kesulitan || "-"
    const durasi = destinasi?.durasi_normal || destinasi?.duration || destinasi?.estimasi_waktu || "-"
    const deskripsi = destinasi?.deskripsi || destinasi?.description || "Tidak ada deskripsi tersedia."
    const jalurPendakian = destinasi?.jalur_pendakian || destinasi?.route || destinasi?.rute || []
    const fasilitas = destinasi?.fasilitas || destinasi?.facilities || []
    const tips = destinasi?.tips || destinasi?.saran || []

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-[95%] px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/destinasi"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300 mb-6"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Kembali ke Daftar Destinasi</span>
                    </Link>

                    {/* Hero Image */}
                    <div className="relative h-96 rounded-2xl overflow-hidden mb-8 border border-slate-700/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                {nama}
                            </h1>
                            <div className="flex items-center gap-2 text-cyan-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-lg">{lokasi}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-slate-400 text-sm">Ketinggian</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{ketinggian}</div>
                            <div className="text-slate-400 text-xs">mdpl</div>
                        </div>

                        <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="text-slate-400 text-sm">Kesulitan</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{kesulitan}</div>
                            <div className="text-slate-400 text-xs">Level</div>
                        </div>

                        <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-slate-400 text-sm">Durasi</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{durasi}</div>
                            <div className="text-slate-400 text-xs">Estimasi</div>
                        </div>

                        <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-slate-400 text-sm">Status</span>
                            </div>
                            <div className="text-2xl font-bold text-cyan-400">Aktif</div>
                            <div className="text-slate-400 text-xs">Tersedia</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Deskripsi
                        </h2>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            {deskripsi}
                        </p>
                    </div>

                    {/* Jalur Pendakian */}
                    {Array.isArray(jalurPendakian) && jalurPendakian.length > 0 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                Jalur Pendakian
                            </h2>
                            <div className="space-y-3">
                                {jalurPendakian.map((jalur, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-700/30">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            {typeof jalur === "string" ? (
                                                <p className="text-slate-300">{jalur}</p>
                                            ) : (
                                                <>
                                                    {jalur.nama && <h4 className="font-semibold text-white mb-1">{jalur.nama}</h4>}
                                                    {jalur.deskripsi && <p className="text-slate-300 text-sm">{jalur.deskripsi}</p>}
                                                    {jalur.durasi && (
                                                        <p className="text-cyan-400 text-sm mt-1">⏱️ {jalur.durasi}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fasilitas */}
                    {Array.isArray(fasilitas) && fasilitas.length > 0 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Fasilitas
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {fasilitas.map((fasilitasItem, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                                        <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-slate-300">
                                            {typeof fasilitasItem === "string" ? fasilitasItem : fasilitasItem.nama || fasilitasItem.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    {Array.isArray(tips) && tips.length > 0 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Tips & Saran
                            </h2>
                            <ul className="space-y-3">
                                {tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <span className="text-slate-300 leading-relaxed">
                                            {typeof tip === "string" ? tip : tip.teks || tip.text || tip.saran || tip.tips}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/open-trip"
                            className="rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-8 py-4 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_24px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105"
                        >
                            Lihat Open Trip
                        </Link>
                        <Link
                            to="/private-trip"
                            className="rounded-xl border-2 border-cyan-400/70 bg-transparent px-8 py-4 font-bold text-slate-100 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300"
                        >
                            Buat Private Trip
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

