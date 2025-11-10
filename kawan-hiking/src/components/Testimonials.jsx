import React from 'react'

const quotes = [
  {
    text: 'Lewat Kawan Hiking, aku nemu tim yang satu frekuensi. Pendakian jadi jauh lebih aman dan seru!',
    who: 'Rina — Pendaki Pemula'
  },
  {
    text: 'Fiturnya lengkap buat bikin trip bareng. Pembagian tugas dan checklist-nya membantu banget.',
    who: 'Bima — Organisator Trip'
  },
  {
    text: 'Komunitasnya positif. Review dan reputasi bikin nyaman cari partner naik gunung.',
    who: 'Siska — Pecinta Alam'
  }
]

export default function Testimonials() {
  return (
    <section id="testimoni" className="py-16 relative">
      <div className="mx-auto w-full max-w-[95%] px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Apa Kata Mereka
            </h2>
            <p className="text-slate-400 text-lg">
              Testimoni dari pendaki yang sudah bergabung
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quotes.map((q, i) => (
              <figure 
                key={i}
                className="group rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/60 p-6 hover:border-cyan-400/50 hover:shadow-[0_8px_24px_rgba(34,211,238,0.2)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {q.who.charAt(0)}
                  </div>
                  <div>
                    <figcaption className="text-white font-semibold">{q.who.split(' — ')[0]}</figcaption>
                    <p className="text-cyan-400 text-xs">{q.who.split(' — ')[1]}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="m-0 text-slate-300 leading-relaxed">"{q.text}"</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


