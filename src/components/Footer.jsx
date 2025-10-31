import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="pt-6 pb-20 text-slate-400 border-t border-slate-400/20">
      <div className="mx-auto w-[min(1140px,92%)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg shadow-[0_0_0_4px_rgba(34,211,238,0.08)] bg-gradient-to-br from-cyan-400 to-cyan-700 inline-block" />
          <strong className="text-slate-100">Kawan Hiking</strong>
        </div>
        <small>© {year} Kawan Hiking. All rights reserved.</small>
      </div>
    </footer>
  )
}


