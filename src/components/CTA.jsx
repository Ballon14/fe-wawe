import React from 'react'

export default function CTA() {
  return (
    <section id="gabung" className="py-6">
      <div className="mx-auto w-[min(1140px,92%)]">
        <div className="rounded-2xl border border-slate-400/20 bg-gradient-to-b from-slate-800/60 to-slate-800/60 text-center p-7 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <h3 className="text-2xl font-semibold mb-2">Siap Menaklukkan Puncak Berikutnya?</h3>
          <p className="text-slate-400 mb-4">Gabung gratis, buat trip pertamamu, dan temukan kawan seperjalanan.</p>
          <div className="flex gap-2 justify-center">
            <button className="rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-2 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:brightness-105">Daftar Sekarang</button>
            <button className="rounded-xl border border-slate-400/30 bg-transparent px-4 py-2 font-bold text-slate-100">Lihat Komunitas</button>
          </div>
        </div>
      </div>
    </section>
  )
}


