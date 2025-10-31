import React, { useEffect, useState } from "react"
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
            <section className="mx-auto w-[min(1140px,92%)] my-8">
                <h2 className="text-2xl font-bold mb-2">Open Trips</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="text-red-400">{error}</div>
                ) : openTrips.length === 0 ? (
                    <div className="text-slate-400">
                        Belum ada open-trip yang tersedia.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {openTrips.map((trip, index) => (
                            <div
                                key={trip?.id || trip?._id || `trip-${index}`}
                                className="border rounded-xl bg-slate-800/70 p-4"
                            >
                                <h3 className="font-semibold text-lg mb-2">
                                    {trip?.nama_trip || trip?.title || trip?.name || "Trip Tanpa Judul"}
                                </h3>
                                {(trip?.lokasi || trip?.location) && (
                                    <div className="text-slate-400 text-sm mb-1">
                                        📍 {trip?.lokasi || trip?.location}
                                    </div>
                                )}
                                {(() => {
                                    const dateValue = trip?.tanggal_berangkat || trip?.tanggal_keberangkatan || trip?.date_departure || trip?.tanggal || trip?.date
                                    if (!dateValue) return null
                                    const formattedDate = formatDate(dateValue)
                                    return (
                                        <div className="text-slate-400 text-sm mb-1">
                                            📅 Tanggal Berangkat: {formattedDate}
                                        </div>
                                    )
                                })()}
                                <div className="flex gap-4 text-slate-400 text-sm mb-2 flex-wrap">
                                    {((trip?.kuota !== undefined && trip?.kuota !== null) || 
                                      (trip?.quota !== undefined && trip?.quota !== null) || 
                                      (trip?.max_participants !== undefined && trip?.max_participants !== null) || 
                                      (trip?.max_peserta !== undefined && trip?.max_peserta !== null)) && (
                                        <span>
                                            👥 Kuota: {trip?.kuota ?? trip?.quota ?? trip?.max_participants ?? trip?.max_peserta}
                                        </span>
                                    )}
                                    {((trip?.durasi_hari !== undefined && trip?.durasi_hari !== null) || 
                                      (trip?.durasi !== undefined && trip?.durasi !== null) || 
                                      (trip?.duration !== undefined && trip?.duration !== null) || 
                                      (trip?.days !== undefined && trip?.days !== null) || 
                                      (trip?.hari !== undefined && trip?.hari !== null)) && (
                                        <span>
                                            ⏱️ Durasi: {trip?.durasi_hari ?? trip?.durasi ?? trip?.duration ?? trip?.days ?? trip?.hari} hari
                                        </span>
                                    )}
                                </div>
                                {(trip?.deskripsi || trip?.description) && (
                                    <div className="text-slate-300 text-sm mt-2">
                                        {trip?.deskripsi || trip?.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <Features />
            <Testimonials />
            <CTA />
        </>
    )
}
