import React from 'react'

export default function Kontak() {

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Kontak / Bantuan
        </h1>
        <p className="text-center text-slate-400 mb-12">
          Hubungi kami untuk pertanyaan atau bantuan. Gunakan Live Chat untuk komunikasi langsung.
        </p>
        <div className="max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <p className="text-slate-400">+62 851-9860-7913</p>
                  <a href="https://wa.me/6285198607913" target="_blank" rel="noopener noreferrer" 
                     className="text-cyan-400 hover:text-cyan-300 text-sm">
                    Chat Sekarang →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-slate-400">infomuncak@gmail.com</p>
                  <a href="mailto:infomuncak@gmail.com" className="text-cyan-400 hover:text-cyan-300 text-sm">
                    Kirim Email →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Alamat</h3>
                  <p className="text-slate-400">RT 04/Rw01 Bulus gebang Purworejo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info untuk Live Chat */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-2">
              Atau gunakan fitur <span className="text-cyan-400 font-semibold">Live Chat</span> di pojok kanan bawah untuk chat langsung dengan kami
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

