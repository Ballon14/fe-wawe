import React, { useEffect, useState } from "react"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Testimonials from "../components/Testimonials"
import CTA from "../components/CTA"
import { apiGet } from "../lib/api"

export default function Home() {
    const [openTrips, setOpenTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchTrips() {
            setLoading(true)
            setError("")
            try {
                const data = await apiGet("/api/open-trips")
                console.log("Data received from API:", data)
                console.log("First trip object:", data[0]) // Log first trip to see structure
                // Handle different response formats
                if (Array.isArray(data)) {
                    setOpenTrips(data)
                } else if (data.trips) {
                    setOpenTrips(data.trips)
                } else if (data.data) {
                    setOpenTrips(data.data)
                } else {
                    setOpenTrips([])
                }
            } catch (e) {
                console.error("Error fetching trips:", e)
                setError("Gagal mengambil data open-trips")
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
                        {openTrips.map((trip) => (
                            <div
                                key={trip.id}
                                className="border rounded-xl bg-slate-800/70 p-4"
                            >
                                <h3 className="font-semibold text-lg mb-2">
                                    {trip.title || "Trip Tanpa Judul"}
                                </h3>
                                <div className="text-slate-400 text-sm mb-1">
                                    {trip.location}
                                </div>
                                <div className="text-slate-400 text-sm mb-2">
                                    {trip.date}
                                </div>
                                <div className="text-slate-300">
                                    {trip.description}
                                </div>
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
