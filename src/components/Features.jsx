import React from 'react'

const items = [
  {
    title: 'Buat & Kelola Trip',
    desc: 'Rencanakan pendakian, atur kuota, jadwal, biaya patungan, hingga checklist perlengkapan.'
  },
  {
    title: 'Cari Kawan Satu Tujuan',
    desc: 'Temukan partner mendaki dengan level pengalaman, jadwal, dan lokasi yang cocok.'
  },
  {
    title: 'Aman & Terverifikasi',
    desc: 'Profil dan reputasi anggota membantu kamu memilih tim yang tepat dan terpercaya.'
  }
]

export default function Features() {
  return (
    <section id="fitur" className="py-6">
      <div className="mx-auto w-[min(1140px,92%)]">
        <h2 className="text-[clamp(22px,3.6vw,36px)] mb-1 font-bold">Dirancang untuk Pendaki Indonesia</h2>
        <p className="text-slate-400 -mt-2">Semua yang kamu butuhkan untuk naik gunung lebih terencana dan menyenangkan.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((f) => (
            <article key={f.title} className="rounded-xl border border-slate-400/20 bg-slate-800/70 p-5">
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-slate-400 m-0">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


