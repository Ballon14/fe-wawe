import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { apiGet } from "../../lib/api"

export default function Dashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        destinations: 0,
        guides: 0,
        openTrips: 0,
        testimonials: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const [dests, guides, trips] = await Promise.allSettled([
                    apiGet("/api/destinations").catch(() => []),
                    apiGet("/api/guides").catch(() => []),
                    apiGet("/api/open-trips").catch(() => []),
                ])

                setStats({
                    destinations: Array.isArray(dests.value)
                        ? dests.value.length
                        : 0,
                    guides: Array.isArray(guides.value)
                        ? guides.value.length
                        : 0,
                    openTrips: Array.isArray(trips.value)
                        ? trips.value.length
                        : 0,
                    testimonials: 0, // Placeholder
                })
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const statCards = [
        {
            title: "Destinasi",
            value: stats.destinations,
            icon: "🗻",
            link: "/admin/destinasi",
            color: "from-cyan-400 to-blue-500",
        },
        {
            title: "Guide",
            value: stats.guides,
            icon: "👨‍🦯",
            link: "/admin/guides",
            color: "from-purple-400 to-pink-500",
        },
        {
            title: "Open Trip",
            value: stats.openTrips,
            icon: "🎒",
            link: "/admin/open-trips",
            color: "from-green-400 to-emerald-500",
        },
        {
            title: "Testimoni",
            value: stats.testimonials,
            icon: "⭐",
            link: "/admin/testimonials",
            color: "from-yellow-400 to-orange-500",
        },
    ]

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">
                    Dashboard Admin
                </h1>
                <p className="text-slate-400">
                    Selamat datang, {user?.username || "Admin"}! Kelola konten
                    website Anda dari sini.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((card) => (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] hover:-translate-y-1"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-4xl">{card.icon}</div>
                                    <div
                                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                                    ></div>
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium mb-1">
                                    {card.title}
                                </h3>
                                <p className="text-3xl font-bold text-slate-100">
                                    {card.value}
                                </p>
                                <div className="mt-4 text-xs text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                                    Kelola →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 p-6">
                    <h2 className="text-xl font-bold text-slate-100 mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        <Link
                            to="/admin/destinasi/tambah"
                            className="block w-full py-3 px-4 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300 text-center"
                        >
                            + Tambah Destinasi Baru
                        </Link>
                        <Link
                            to="/admin/guides/tambah"
                            className="block w-full py-3 px-4 rounded-lg bg-gradient-to-tr from-purple-400 to-pink-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(168,85,247,0.35)] transition-all duration-300 text-center"
                        >
                            + Tambah Guide Baru
                        </Link>
                        <Link
                            to="/admin/open-trips/tambah"
                            className="block w-full py-3 px-4 rounded-lg bg-gradient-to-tr from-green-400 to-emerald-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(74,222,128,0.35)] transition-all duration-300 text-center"
                        >
                            + Tambah Open Trip Baru
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 p-6">
                    <h2 className="text-xl font-bold text-slate-100 mb-4">
                        Pengaturan
                    </h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <p className="text-sm text-slate-400 mb-1">
                                Status Sistem
                            </p>
                            <p className="text-slate-100 font-semibold">
                                Berjalan Normal
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <p className="text-sm text-slate-400 mb-1">
                                Akun Login
                            </p>
                            <p className="text-slate-100 font-semibold">
                                {user?.username || "Admin"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
