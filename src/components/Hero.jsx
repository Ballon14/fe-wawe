import React from 'react'

export default function Hero() {
  return (
    <section className="py-12">
      <div className="mx-auto w-[min(1140px,92%)] grid gap-7 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <h1 className="text-[clamp(28px,4.8vw,52px)] leading-tight mb-3 font-bold">Temukan Partner Mendaki & Rencanakan Pendakian Impianmu</h1>
          <p className="text-slate-400 text-lg mb-6">Kawan Hiking adalah komunitas pendaki untuk membuat trip, mencari teman satu tujuan, dan berbagi pengalaman. Semua dalam satu tempat.</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <button className="rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-2 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:brightness-105">Jelajahi Trip</button>
            <button className="rounded-xl border border-slate-400/30 bg-transparent px-4 py-2 font-bold text-slate-100">Pelajari Lebih Lanjut</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-400/20 bg-slate-900/70 p-4">
              <div className="text-2xl font-extrabold">12K+</div>
              <div className="text-slate-400 text-sm">Anggota</div>
            </div>
            <div className="rounded-xl border border-slate-400/20 bg-slate-900/70 p-4">
              <div className="text-2xl font-extrabold">800+</div>
              <div className="text-slate-400 text-sm">Trip Selesai</div>
            </div>
            <div className="rounded-xl border border-slate-400/20 bg-slate-900/70 p-4">
              <div className="text-2xl font-extrabold">4.9/5</div>
              <div className="text-slate-400 text-sm">Rating Komunitas</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-400/20 bg-slate-900/70 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <img className="w-full h-[300px] object-cover" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop" alt="Pegunungan Indonesia" />
        </div>
      </div>
    </section>
  )
}


