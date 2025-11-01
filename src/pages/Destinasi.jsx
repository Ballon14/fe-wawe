import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiGet } from "../lib/api"

export default function Destinasi() {
    const [destinations, setDestinations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchDestinations() {
            setLoading(true)
            setError("")
            try {
                console.log("Fetching destinations from /api/destinations")
                const data = await apiGet("/api/destinations")
                console.log("Raw data received from API:", data)
                console.log("Data type:", typeof data)
                console.log("Is array?", Array.isArray(data))

                // Handle different response formats
                let destList = []
                if (Array.isArray(data)) {
                    destList = data
                } else if (
                    data &&
                    data.destinations &&
                    Array.isArray(data.destinations)
                ) {
                    destList = data.destinations
                } else if (data && data.data && Array.isArray(data.data)) {
                    destList = data.data
                } else if (data && typeof data === "object") {
                    console.warn("Unexpected data format. Data object:", data)
                    destList = []
                } else {
                    console.warn("Data is not in expected format")
                    destList = []
                }

                console.log("Processed destinations:", destList)
                console.log("Number of destinations:", destList.length)
                setDestinations(destList)
            } catch (e) {
                console.error("Error fetching destinations:", e)
                console.error("Error message:", e.message)
                setError(`Gagal mengambil data destinations: ${e.message}`)
                setDestinations([])
            } finally {
                setLoading(false)
            }
        }
        fetchDestinations()
    }, [])

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-[95%] px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Gunung / Destinasi
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Daftar gunung dan jalur pendakian yang tersedia
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
                    ) : destinations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-block rounded-xl border border-slate-400/30 bg-slate-800/50 px-6 py-4 text-slate-400">
                                Belum ada destinasi yang tersedia.
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {destinations.map((dest, index) => (
                                <div
                                    key={
                                        dest?.id || dest?._id || `dest-${index}`
                                    }
                                    className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] hover:-translate-y-1"
                                >
                                    {/* Image placeholder */}
                                    <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="font-bold text-xl text-white mb-1 line-clamp-2">
                                                {dest?.nama_gunung ||
                                                    dest?.nama ||
                                                    dest?.name ||
                                                    dest?.nama_destinasi ||
                                                    "Destinasi Tanpa Nama"}
                                            </h3>
                                            {(dest?.lokasi ||
                                                dest?.location) && (
                                                <p className="text-cyan-300 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
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
                                                    {dest?.lokasi ||
                                                        dest?.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-3">
                                        {(dest?.ketinggian ||
                                            dest?.elevation ||
                                            dest?.tinggi) && (
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
                                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                    />
                                                </svg>
                                                <span>
                                                    Ketinggian:{" "}
                                                    {dest?.ketinggian ||
                                                        dest?.elevation ||
                                                        dest?.tinggi}{" "}
                                                    mdpl
                                                </span>
                                            </div>
                                        )}

                                        {(dest?.level_kesulitan ||
                                            dest?.difficulty ||
                                            dest?.kesulitan) && (
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
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                                <span>
                                                    Kesulitan:{" "}
                                                    {dest?.level_kesulitan ||
                                                        dest?.difficulty ||
                                                        dest?.kesulitan}
                                                </span>
                                            </div>
                                        )}

                                        {(dest?.durasi_normal ||
                                            dest?.duration ||
                                            dest?.estimasi_waktu) && (
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
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>
                                                    Durasi:{" "}
                                                    {dest?.durasi_normal ||
                                                        dest?.duration ||
                                                        dest?.estimasi_waktu}
                                                </span>
                                            </div>
                                        )}

                                        {(dest?.deskripsi ||
                                            dest?.description) && (
                                            <div className="text-slate-300 text-sm line-clamp-3 pt-2 border-t border-slate-700/50">
                                                {dest?.deskripsi ||
                                                    dest?.description}
                                            </div>
                                        )}

                                        <Link
                                            to={`/destinasi/${
                                                dest?.id || dest?._id || index
                                            }`}
                                            className="block w-full mt-4 py-2.5 px-4 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300 group-hover:scale-105 text-center"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
