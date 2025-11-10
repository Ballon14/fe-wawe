import React from 'react'

export default function OpenTrip() {
  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Open Trip
        </h1>
        <p className="text-center text-slate-400 mb-12">
          Trip gabungan, cocok untuk solo hiker
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-cyan-400/20 to-blue-400/20" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Open Trip {i}</h3>
                <p className="text-slate-400 mb-4">
                  Join bersama pendaki lainnya dan nikmati perjalanan seru
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">Rp 500.000</span>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300">
                    Daftar Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

