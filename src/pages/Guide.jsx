import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiGet } from "../lib/api"

export default function Guide() {
    const [guides, setGuides] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchGuides() {
            setLoading(true)
            setError("")
            try {
                console.log("Fetching guides from /api/guides")
                const data = await apiGet("/api/guides")
                console.log("Raw data received from API:", data)
                console.log("Data type:", typeof data)
                console.log("Is array?", Array.isArray(data))

                // Handle different response formats
                let guideList = []
                if (Array.isArray(data)) {
                    guideList = data
                } else if (data && data.guides && Array.isArray(data.guides)) {
                    guideList = data.guides
                } else if (data && data.data && Array.isArray(data.data)) {
                    guideList = data.data
                } else if (data && typeof data === "object") {
                    console.warn("Unexpected data format. Data object:", data)
                    guideList = []
                } else {
                    console.warn("Data is not in expected format")
                    guideList = []
                }

                // Filter only active guides
                guideList = guideList.filter(
                    (guide) =>
                        !guide.status ||
                        guide.status === "aktif" ||
                        guide.status === "active"
                )

                console.log("Processed guides:", guideList)
                console.log("Number of guides:", guideList.length)
                setGuides(guideList)
            } catch (e) {
                console.error("Error fetching guides:", e)
                console.error("Error message:", e.message)
                setError(`Gagal mengambil data guides: ${e.message}`)
                setGuides([])
            } finally {
                setLoading(false)
            }
        }
        fetchGuides()
    }, [])

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
            // If not JSON, treat as string
            if (typeof spec === "string") {
                return [spec]
            }
            return []
        }
    }

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-[95%] px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Pemandu / Guide
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Profil para guide profesional dengan pengalaman dan
                            rating terpercaya
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="inline-block rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-6 py-4">
                                {error}
                            </div>
                        </div>
                    ) : guides.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-block rounded-xl border border-slate-400/30 bg-slate-800/50 px-6 py-4 text-slate-400">
                                Belum ada guide yang tersedia.
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guides.map((guide, index) => {
                                const spesialisasi = parseSpecialization(
                                    guide.spesialisasi
                                )
                                const rating = guide.rating
                                    ? parseFloat(guide.rating).toFixed(1)
                                    : "0.0"

                                return (
                                    <div
                                        key={
                                            guide?.id ||
                                            guide?._id ||
                                            `guide-${index}`
                                        }
                                        className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] hover:-translate-y-1"
                                    >
                                        {/* Photo */}
                                        <div className="relative h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 overflow-hidden">
                                            {guide.foto ? (
                                                <img
                                                    src={guide.foto}
                                                    alt={guide.nama || "Guide"}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none"
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                                                        {guide.nama
                                                            ? guide.nama
                                                                  .charAt(0)
                                                                  .toUpperCase()
                                                            : "G"}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                                            <div className="absolute top-4 right-4 bg-gradient-to-tr from-cyan-400 to-blue-400 px-3 py-1.5 rounded-full shadow-lg">
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4 text-slate-900"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-slate-900 font-bold text-sm">
                                                        {rating}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-3">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1 text-white">
                                                    {guide.nama ||
                                                        "Guide Tanpa Nama"}
                                                </h3>
                                                {guide.pengalaman && (
                                                    <p className="text-slate-400 text-sm flex items-center gap-1">
                                                        <svg
                                                            className="w-4 h-4 text-cyan-400"
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
                                                        {guide.pengalaman}{" "}
                                                        Pengalaman
                                                    </p>
                                                )}
                                            </div>

                                            {guide.alamat && (
                                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                    <svg
                                                        className="w-4 h-4 text-cyan-400"
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
                                                    <span className="line-clamp-1">
                                                        {guide.alamat}
                                                    </span>
                                                </div>
                                            )}

                                            {spesialisasi.length > 0 && (
                                                <div className="pt-2 border-t border-slate-700/50">
                                                    <p className="text-slate-400 text-xs mb-2">
                                                        Spesialisasi:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {spesialisasi
                                                            .slice(0, 3)
                                                            .map(
                                                                (spec, idx) => (
                                                                    <span
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="px-2 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 text-xs border border-cyan-400/20"
                                                                    >
                                                                        {typeof spec ===
                                                                        "string"
                                                                            ? spec
                                                                            : spec.nama ||
                                                                              spec.name ||
                                                                              spec}
                                                                    </span>
                                                                )
                                                            )}
                                                        {spesialisasi.length >
                                                            3 && (
                                                            <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-400 text-xs">
                                                                +
                                                                {spesialisasi.length -
                                                                    3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {guide.deskripsi && (
                                                <p className="text-slate-300 text-sm line-clamp-2 pt-2 border-t border-slate-700/50">
                                                    {guide.deskripsi}
                                                </p>
                                            )}

                                            <Link
                                                to={`/guide/${
                                                    guide?.id ||
                                                    guide?._id ||
                                                    index
                                                }`}
                                                className="block w-full mt-4 py-2.5 px-4 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300 group-hover:scale-105 text-center"
                                            >
                                                Lihat Profil
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
