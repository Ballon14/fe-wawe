import React from "react"

const items = [
    {
        title: "Buat & Kelola Trip",
        desc: "Rencanakan pendakian, atur kuota, jadwal, biaya patungan, hingga checklist perlengkapan.",
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
            </svg>
        ),
    },
    {
        title: "Cari Kawan Satu Tujuan",
        desc: "Temukan partner mendaki dengan level pengalaman, jadwal, dan lokasi yang cocok.",
        icon: (
            <svg
                className="w-6 h-6"
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
        ),
    },
    {
        title: "Aman & Terverifikasi",
        desc: "Profil dan reputasi anggota membantu kamu memilih tim yang tepat dan terpercaya.",
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            </svg>
        ),
    },
]

export default function Features() {
    return (
        <section id="fitur" className="py-16 relative">
            <div className="mx-auto w-full max-w-[95%] px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Dirancang untuk Pendaki Indonesia
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Semua yang kamu butuhkan untuk naik gunung lebih
                            terencana dan menyenangkan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {items.map((f) => (
                            <article
                                key={f.title}
                                className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 p-6 hover:border-cyan-400/50 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="mb-2 font-semibold text-lg text-white">
                                    {f.title}
                                </h3>
                                <p className="text-slate-400 m-0 leading-relaxed">
                                    {f.desc}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
