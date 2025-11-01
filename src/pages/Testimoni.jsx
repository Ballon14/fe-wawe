import React from 'react'

export default function Testimoni() {
  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Testimoni
        </h1>
        <p className="text-center text-slate-400 mb-12">
          Review dari pendaki yang sudah ikut trip
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Rudi Hartono', trip: 'Open Trip Bromo', rating: 5 },
            { name: 'Sarah Putri', trip: 'Private Trip Rinjani', rating: 5 },
            { name: 'Bambang Wijaya', trip: 'Open Trip Semeru', rating: 5 },
            { name: 'Lisa Sari', trip: 'Private Trip Merapi', rating: 5 },
            { name: 'Andi Prasetya', trip: 'Open Trip Ijen', rating: 5 },
            { name: 'Maya Dewi', trip: 'Private Trip Pangrango', rating: 5 },
          ].map((testi, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-slate-900">
                  {testi.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{testi.name}</h4>
                  <p className="text-sm text-slate-400">{testi.trip}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testi.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300">
                "Perjalanan yang sangat berkesan! Guide profesional dan tim sangat ramah. 
                Pemandangan sunrise di Bromo luar biasa indah. Recommended!"
              </p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

