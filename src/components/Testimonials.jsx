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
    <section id="testimoni" className="py-6">
      <div className="mx-auto w-[min(1140px,92%)]">
        <h2 className="text-[clamp(22px,3.6vw,36px)] mb-1 font-bold">Apa Kata Mereka</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {quotes.map((q, i) => (
            <figure className="rounded-xl border border-slate-400/20 bg-gradient-to-b from-slate-800/70 to-slate-800/50 p-5" key={i}>
              <blockquote className="m-0">“{q.text}”</blockquote>
              <figcaption className="text-slate-400 text-sm mt-2">{q.who}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}


