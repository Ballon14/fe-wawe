import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Testimonials from "../components/Testimonials"
import CTA from "../components/CTA"
import { apiGet } from "../lib/api"

// Fungsi untuk format tanggal ke format Indonesia (DD MMMM YYYY)
function formatDate(dateString) {
    if (!dateString) return ""
    
    try {
        const date = new Date(dateString)
        
        // Cek jika date valid
        if (isNaN(date.getTime())) {
            return dateString // Return as-is jika tidak valid
        }
        
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ]
        
        const day = date.getDate()
        const month = months[date.getMonth()]
        const year = date.getFullYear()
        
        return `${day} ${month} ${year}`
    } catch (error) {
        console.warn("Error formatting date:", dateString, error)
        return dateString // Return as-is jika error
    }
}

export default function Home() {
    const [openTrips, setOpenTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchTrips() {
            setLoading(true)
            setError("")
            try {
                console.log("Fetching open-trips from /api/open-trips")
                const data = await apiGet("/api/open-trips")
                console.log("Raw data received from API:", data)
                console.log("Data type:", typeof data)
                console.log("Is array?", Array.isArray(data))
                console.log("Data keys:", data && typeof data === 'object' ? Object.keys(data) : 'N/A')
                
                // Handle different response formats
                let trips = []
                if (Array.isArray(data)) {
                    trips = data
                } else if (data && data.trips && Array.isArray(data.trips)) {
                    trips = data.trips
                } else if (data && data.data && Array.isArray(data.data)) {
                    trips = data.data
                } else if (data && typeof data === 'object') {
                    console.warn("Unexpected data format. Data object:", data)
                    trips = []
                } else {
                    console.warn("Data is not in expected format")
                    trips = []
                }
                
                console.log("Processed trips:", trips)
                console.log("Number of trips:", trips.length)
                setOpenTrips(trips)
            } catch (e) {
                console.error("Error fetching trips:", e)
                console.error("Error message:", e.message)
                console.error("Error stack:", e.stack)
                setError(`Gagal mengambil data open-trips: ${e.message}`)
                setOpenTrips([])
            } finally {
                setLoading(false)
            }
        }
        fetchTrips()
    }, [])

    return (
        <>
            <Hero />
            <section className="mx-auto w-full max-w-[95%] px-4 my-16">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Open Trips
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Pilih perjalanan pendakian yang sesuai dengan jadwalmu
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
                    ) : openTrips.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-block rounded-xl border border-slate-400/30 bg-slate-800/50 px-6 py-4 text-slate-400">
                                Belum ada open-trip yang tersedia.
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {openTrips.map((trip, index) => (
                                <div
                                    key={trip?.id || trip?._id || `trip-${index}`}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] hover:-translate-y-1"
                                >
                                    {/* Image placeholder */}
                                    <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="font-bold text-xl text-white mb-1 line-clamp-2">
                                                {trip?.nama_trip || trip?.title || trip?.name || "Trip Tanpa Judul"}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 space-y-3">
                                        {(trip?.lokasi || trip?.location) && (
                                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="line-clamp-1">{trip?.lokasi || trip?.location}</span>
                                            </div>
                                        )}
                                        
                                        {(() => {
                                            const dateValue = trip?.tanggal_berangkat || trip?.tanggal_keberangkatan || trip?.date_departure || trip?.tanggal || trip?.date
                                            if (!dateValue) return null
                                            const formattedDate = formatDate(dateValue)
                                            return (
                                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{formattedDate}</span>
                                                </div>
                                            )
                                        })()}
                                        
                                        <div className="flex gap-4 text-slate-400 text-sm flex-wrap">
                                            {((trip?.kuota !== undefined && trip?.kuota !== null) || 
                                              (trip?.quota !== undefined && trip?.quota !== null) || 
                                              (trip?.max_participants !== undefined && trip?.max_participants !== null) || 
                                              (trip?.max_peserta !== undefined && trip?.max_peserta !== null)) && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>{trip?.kuota ?? trip?.quota ?? trip?.max_participants ?? trip?.max_peserta} peserta</span>
                                                </div>
                                            )}
                                            {((trip?.durasi_hari !== undefined && trip?.durasi_hari !== null) || 
                                              (trip?.durasi !== undefined && trip?.durasi !== null) || 
                                              (trip?.duration !== undefined && trip?.duration !== null) || 
                                              (trip?.days !== undefined && trip?.days !== null) || 
                                              (trip?.hari !== undefined && trip?.hari !== null)) && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{trip?.durasi_hari ?? trip?.durasi ?? trip?.duration ?? trip?.days ?? trip?.hari} hari</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {(trip?.deskripsi || trip?.description) && (
                                            <div className="text-slate-300 text-sm line-clamp-2 pt-2 border-t border-slate-700/50">
                                                {trip?.deskripsi || trip?.description}
                                            </div>
                                        )}
                                        
                                        <Link
                                            to={`/open-trip/${trip?.id || trip?._id || index}`}
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
            </section>
            <Features />
            <Testimonials />
            <CTA />
        </>
    )
}
