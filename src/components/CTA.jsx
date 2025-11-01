import React from 'react'
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section id="gabung" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20 pointer-events-none" />
      
      <div className="mx-auto w-full max-w-[95%] px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-sm text-center p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Siap Menaklukkan Puncak Berikutnya?
              </h3>
              <p className="text-slate-300 mb-8 text-lg">
                Gabung gratis, buat trip pertamamu, dan temukan kawan seperjalanan.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register">
                  <button className="group relative overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-8 py-3 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_24px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">Daftar Sekarang</span>
                    <span className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
                <Link to="/tentang-kami">
                  <button className="rounded-xl border-2 border-cyan-400/70 bg-transparent px-8 py-3 font-bold text-slate-100 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300">
                    Lihat Komunitas
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


