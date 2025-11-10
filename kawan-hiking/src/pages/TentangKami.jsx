import React from "react"

export default function TentangKami() {
    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-[95%] px-4">
                <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Tentang Kami
                </h1>
                <p className="text-center text-slate-400 mb-12">
                    Cerita singkat tentang komunitas Kawan Hiking
                </p>
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
                            Visi Kami
                        </h2>
                        <p className="text-slate-300 leading-relaxed">
                            Menjadi platform terpercaya yang menghubungkan para
                            pendaki dengan pengalaman pendakian yang aman,
                            nyaman, dan berkesan. Kami percaya bahwa mendaki
                            gunung bukan hanya sekadar hobi, tetapi sebuah
                            pengalaman spiritual yang mengajarkan kita tentang
                            ketangguhan, kerja sama, dan penghargaan terhadap
                            alam.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
                            Misi Kami
                        </h2>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-1">✓</span>
                                <span>
                                    Menyediakan layanan pendakian dengan standar
                                    keamanan tinggi
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-1">✓</span>
                                <span>
                                    Memberikan pengalaman terbaik dengan guide
                                    profesional dan berpengalaman
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-1">✓</span>
                                <span>
                                    Membangun komunitas pendaki yang solid dan
                                    saling mendukung
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-1">✓</span>
                                <span>
                                    Mendukung pelestarian alam melalui edukasi
                                    dan praktik ramah lingkungan
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">
                                2018
                            </div>
                            <div className="text-slate-400">Tahun Berdiri</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">
                                1000+
                            </div>
                            <div className="text-slate-400">
                                Pendaki Bergabung
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">
                                50+
                            </div>
                            <div className="text-slate-400">Trip Berhasil</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
