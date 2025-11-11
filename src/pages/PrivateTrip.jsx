import React from 'react'

export default function PrivateTrip() {
  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Private Trip
        </h1>
        <p className="text-center text-slate-400 mb-12">
          Trip pribadi, bisa pilih guide dan jadwal sendiri
        </p>
        <div className="max-w-3xl mx-auto bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-semibold mb-4">Custom Trip Anda</h2>
          <p className="text-slate-400 mb-8">
            Rencanakan perjalanan pendakian yang sesuai dengan kebutuhan Anda. 
            Pilih destinasi, guide, dan waktu yang diinginkan.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Pilih Destinasi</label>
              <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400">
                <option>Gunung Bromo</option>
                <option>Gunung Rinjani</option>
                <option>Gunung Semeru</option>
                <option>Gunung Merapi</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Tanggal Trip</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
          <div className="mb-6 text-center">
            <a href="/status-private-trip" className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/60 px-4 py-2 text-cyan-300 hover:bg-cyan-400/10 transition-colors">
              Lihat Semua Status Permintaan
            </a>
          </div>
          <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300">
            Buat Permintaan Trip
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

