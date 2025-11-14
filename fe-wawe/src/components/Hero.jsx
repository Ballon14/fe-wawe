import React from "react"
import { Link } from "react-router-dom"

export default function Hero() {
    return (
        <section className="relative py-16 overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-blue-900/10 pointer-events-none" />

            <div className="mx-auto w-full max-w-[95%] px-4 relative z-10">
                <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-[clamp(32px,5vw,56px)] leading-tight mb-4 font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                Temukan Partner Mendaki & Rencanakan Pendakian
                                Impianmu
                            </h1>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                Kawan Hiking adalah komunitas pendaki untuk
                                membuat trip, mencari teman satu tujuan, dan
                                berbagi pengalaman. Semua dalam satu tempat.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <Link to="/open-trip">
                                <button className="group relative overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-6 py-3 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_24px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105">
                                    <span className="relative z-10">
                                        Jelajahi Trip
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </Link>
                            <Link to="/tentang-kami">
                                <button className="rounded-xl border-2 border-cyan-400/70 bg-transparent px-6 py-3 font-bold text-slate-100 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300">
                                    Pelajari Lebih Lanjut
                                </button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="group rounded-xl border border-cyan-400/20 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-4 backdrop-blur-sm hover:border-cyan-400/40 hover:shadow-[0_4px_16px_rgba(34,211,238,0.2)] transition-all duration-300">
                                <div className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    12K+
                                </div>
                                <div className="text-slate-400 text-sm mt-1">
                                    Anggota
                                </div>
                            </div>
                            <div className="group rounded-xl border border-cyan-400/20 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-4 backdrop-blur-sm hover:border-cyan-400/40 hover:shadow-[0_4px_16px_rgba(34,211,238,0.2)] transition-all duration-300">
                                <div className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    800+
                                </div>
                                <div className="text-slate-400 text-sm mt-1">
                                    Trip Selesai
                                </div>
                            </div>
                            <div className="group rounded-xl border border-cyan-400/20 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-4 backdrop-blur-sm hover:border-cyan-400/40 hover:shadow-[0_4px_16px_rgba(34,211,238,0.2)] transition-all duration-300">
                                <div className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    4.9/5
                                </div>
                                <div className="text-slate-400 text-sm mt-1">
                                    Rating Komunitas
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                        <div className="relative rounded-2xl border border-slate-400/20 bg-slate-900/70 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                            <img
                                className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop"
                                alt="Pegunungan Indonesia"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
