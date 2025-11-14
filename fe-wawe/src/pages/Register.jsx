import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiPost } from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [nomor_hp, setNomor_hp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [step, setStep] = useState('form') // 'form' | 'otp'
  const [otpCode, setOtpCode] = useState('')
  const [waitSeconds, setWaitSeconds] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)
  const [regPayload, setRegPayload] = useState(null)

  function validatePassword(password) {
    if (password.length < 8) {
      return 'Password harus minimal 8 karakter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password harus mengandung huruf kecil'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password harus mengandung huruf besar'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password harus mengandung angka'
    }
    return null
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Validasi password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }
    
    // Validasi username
    if (username.length < 3 || username.length > 50) {
      setError('Username harus antara 3-50 karakter')
      setLoading(false)
      return
    }
    
    // Validasi email format (jika diisi)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format email tidak valid')
      setLoading(false)
      return
    }
    
    try {
      // Simpan payload sementara, kirim OTP ke email, lalu tunjukkan layar input OTP
      const payload = { username, password, email, nomor_hp, alamat }
      setRegPayload(payload)

      const resp = await apiPost('/api/otp/send', { email })
      // resp may contain waitSeconds or expires_at
      setWaitSeconds(resp.waitSeconds || 30)
      setSuccess(`Kode OTP berhasil dikirim ke ${email}. Cek email Anda.`)
      setError('')
      setStep('otp')
    } catch (err) {
      setError(err.message || 'Gagal mengirim OTP. Coba lagi.')
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!waitSeconds) return
    let timer = waitSeconds
    setWaitSeconds(timer)
    const id = setInterval(() => {
      timer -= 1
      setWaitSeconds(Math.max(0, timer))
      if (timer <= 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [waitSeconds])

  // Show toast when success is set
  useEffect(() => {
    if (!success) {
      setShowToast(false)
      return
    }
    setShowToast(true)
    const id = setTimeout(() => {
      setShowToast(false)
      // keep success message available in case code relies on it, but clear after toast hidden
      setTimeout(() => setSuccess(''), 300)
    }, 3000)
    return () => clearTimeout(id)
  }, [success])

  async function resendOtp() {
    if (!regPayload?.email) return
    setResendLoading(true)
    try {
      const resp = await apiPost('/api/otp/resend', { email: regPayload.email })
      setWaitSeconds(resp.waitSeconds || 30)
    } catch (err) {
      setError(err.message || 'Gagal resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  async function verifyAndRegister(e) {
    e?.preventDefault?.()
    setError('')
    setSuccess('')
    if (!otpCode || otpCode.length !== 6) {
      setError('Masukkan kode OTP 6 digit')
      return
    }
    setLoading(true)
    try {
      await apiPost('/api/otp/verify', { email: regPayload.email, otp_code: otpCode })
      // OTP valid, lanjut register
      const result = await register(
        regPayload.username,
        regPayload.password,
        regPayload.email,
        regPayload.nomor_hp,
        regPayload.alamat
      )
      if (result.success) {
        setSuccess('Verifikasi berhasil — akun dibuat. Mengarahkan ke login...')
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setError(result.error || 'Gagal mendaftar')
      }
    } catch (err) {
      setError(err.message || 'Verifikasi OTP gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-900">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Daftar</h2>
        {error && (
          <div className="rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}
        {/* Toast popup for success messages */}
        {showToast && success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto max-w-lg w-full mx-4 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-500/40">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Berhasil</div>
                  <div className="text-sm mt-1 opacity-95">{success}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="register-username" className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="register-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="masukkan username"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-300">
                Kata sandi *
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter, huruf besar, huruf kecil, dan angka"
                required
                minLength={8}
                disabled={loading}
                className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-slate-400">
                Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="masukkan email"
                disabled={loading}
                className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="register-nomor-hp" className="block text-sm font-medium text-slate-300">
                Nomor HP
              </label>
              <input
                id="register-nomor-hp"
                type="tel"
                value={nomor_hp}
                onChange={e => setNomor_hp(e.target.value)}
                placeholder="masukkan nomor HP (contoh: 081234567890)"
                disabled={loading}
                className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="register-alamat" className="block text-sm font-medium text-slate-300">
                Alamat
              </label>
              <textarea
                id="register-alamat"
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                placeholder="masukkan alamat lengkap"
                rows="3"
                disabled={loading}
                className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-3 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Memproses...' : 'Daftar & Kirim OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyAndRegister} className="space-y-6">
            <p className="text-slate-300 text-sm mb-2">Kode OTP telah dikirim ke <strong className="text-white">{regPayload?.email}</strong>. Masukkan kode 6 digit di bawah.</p>
            <div className="space-y-2">
              <label htmlFor="otp-code" className="block text-sm font-medium text-slate-300">Kode OTP</label>
              <input
                id="otp-code"
                type="text"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0,6))}
                placeholder="123456"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-3 font-bold text-slate-900 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Memproses...' : 'Verifikasi & Daftar'}
              </button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={waitSeconds > 0 || resendLoading}
                className="w-36 rounded-xl border border-slate-600 px-3 py-3 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {waitSeconds > 0 ? `Resend (${waitSeconds}s)` : (resendLoading ? 'Mengirim...' : 'Kirim Ulang')}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-400">Sudah menerima kode? <button type="button" onClick={() => { setStep('form') }} className="text-cyan-400">Kembali</button></p>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

