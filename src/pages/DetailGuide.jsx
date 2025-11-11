import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { apiGet } from "../lib/api"

export default function DetailGuide() {
    const { id } = useParams()
    const [guide, setGuide] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchGuide() {
            setLoading(true)
            setError("")
            try {
                console.log("Fetching guide detail from /api/guides/" + id)
                const data = await apiGet(`/api/guides/${id}`)
                console.log("Guide detail data:", data)

                // Handle different response formats
                let guideData = null
                if (data && typeof data === "object") {
                    if (data.guide) {
                        guideData = data.guide
                    } else if (data.data) {
                        guideData = data.data
                    } else {
                        guideData = data
                    }
                }

                if (!guideData) {
                    throw new Error("Data guide tidak ditemukan")
                }

                setGuide(guideData)
            } catch (e) {
                console.error("Error fetching guide:", e)
                setError(`Gagal mengambil data guide: ${e.message}`)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchGuide()
        }
    }, [id])

    function parseSpecialization(spec) {
        if (!spec) return []
        try {
            if (typeof spec === "string") {
                return JSON.parse(spec)
            }
            if (Array.isArray(spec)) {
                return spec
            }
            return []
        } catch (e) {
            if (typeof spec === "string") {
                return [spec]
            }
            return []
        }
    }

    function parseCertificate(cert) {
        if (!cert) return []
        try {
            if (typeof cert === "string") {
                return JSON.parse(cert)
            }
            if (Array.isArray(cert)) {
                return cert
            }
            return []
        } catch (e) {
            if (typeof cert === "string") {
                return [cert]
            }
            return []
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Memuat detail guide...</p>
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
                            to="/guide"
                            className="inline-block rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-6 py-3 font-bold text-slate-900 hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
                        >
                            Kembali ke Daftar Guide
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!guide) {
        return null
    }

    const spesialisasi = parseSpecialization(guide.spesialisasi)
    const sertifikat = parseCertificate(guide.sertifikat)
    const rating = guide.rating ? parseFloat(guide.rating).toFixed(1) : "0.0"

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-[95%] px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/guide"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300 mb-6"
                    >
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
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span>Kembali ke Daftar Guide</span>
                    </Link>

                    {/* Hero Section */}
                    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 overflow-hidden mb-8">
                        <div className="md:flex">
                            {/* Photo Section */}
                            <div className="relative w-full md:w-80 h-80 md:h-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                {guide.foto ? (
                                    <img
                                        src={guide.foto}
                                        alt={guide.nama || "Guide"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none"
                                        }}
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-6xl font-bold">
                                        {guide.nama
                                            ? guide.nama.charAt(0).toUpperCase()
                                            : "G"}
                                    </div>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2 text-white">
                                            {guide.nama || "Guide Tanpa Nama"}
                                        </h1>
                                        <div className="flex items-center gap-4 mb-4">
                                            {guide.rating && (
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        className="w-5 h-5 text-yellow-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-xl font-bold text-white">
                                                        {rating}
                                                    </span>
                                                </div>
                                            )}
                                            {guide.status && (
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                        guide.status === "aktif" ||
                                                        guide.status === "active"
                                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                            : "bg-slate-700/50 text-slate-400 border border-slate-700/50"
                                                    }`}
                                                >
                                                    {guide.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {guide.pengalaman && (
                                        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-700/30">
                                            <svg
                                                className="w-6 h-6 text-cyan-400"
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
                                            <div>
                                                <p className="text-slate-400 text-sm">
                                                    Pengalaman
                                                </p>
                                                <p className="text-white font-semibold">
                                                    {guide.pengalaman}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {guide.alamat && (
                                        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-700/30">
                                            <svg
                                                className="w-6 h-6 text-cyan-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-slate-400 text-sm">
                                                    Alamat
                                                </p>
                                                <p className="text-white font-semibold line-clamp-2">
                                                    {guide.alamat}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {guide.email && (
                                        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-700/30">
                                            <svg
                                                className="w-6 h-6 text-cyan-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-slate-400 text-sm">
                                                    Email
                                                </p>
                                                <a
                                                    href={`mailto:${guide.email}`}
                                                    className="text-white font-semibold hover:text-cyan-400 transition-colors"
                                                >
                                                    {guide.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    {guide.deskripsi && (
                        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-cyan-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Deskripsi
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {guide.deskripsi}
                            </p>
                        </div>
                    )}

                    {/* Spesialisasi */}
                    {spesialisasi.length > 0 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-cyan-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                                Spesialisasi
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {spesialisasi.map((spec, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 font-medium"
                                    >
                                        {typeof spec === "string"
                                            ? spec
                                            : spec.nama || spec.name || spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sertifikat */}
                    {sertifikat.length > 0 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-cyan-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                                Sertifikat & Lisensi
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sertifikat.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-700/30"
                                    >
                                        <svg
                                            className="w-6 h-6 text-cyan-400 flex-shrink-0"
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
                                            {typeof cert === "string" ? (
                                                <p className="text-slate-300">
                                                    {cert}
                                                </p>
                                            ) : (
                                                <>
                                                    {cert.nama && (
                                                        <p className="text-white font-semibold">
                                                            {cert.nama}
                                                        </p>
                                                    )}
                                                    {cert.lembaga && (
                                                        <p className="text-slate-400 text-sm">
                                                            {cert.lembaga}
                                                        </p>
                                                    )}
                                                    {cert.tahun && (
                                                        <p className="text-cyan-400 text-xs mt-1">
                                                            {cert.tahun}
                                                        </p>
                                                    )}
                                                    {!cert.nama &&
                                                        !cert.lembaga &&
                                                        (cert.name || cert.issuer) && (
                                                            <p className="text-slate-300">
                                                                {cert.name ||
                                                                    cert.issuer}
                                                            </p>
                                                        )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        {(() => {
                          const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || "6285198607913"
                            const msg = encodeURIComponent(`Halo Kawan Hiking, saya ingin menghubungi guide: ${guide.nama || 'tanpa nama'} (ID: ${guide.id || ''}).`)
                            const waLink = `https://wa.me/${WA_NUMBER}?text=${msg}`
                            return (
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-8 py-4 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_24px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105"
                                >
                                    Hubungi via WhatsApp
                                </a>
                            )
                        })()}
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

