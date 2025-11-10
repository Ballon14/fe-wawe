import React from 'react'

export default function Galeri() {
  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Galeri
        </h1>
        <p className="text-center text-slate-400 mb-12">
          Foto-foto trip sebelumnya
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer">
              <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

