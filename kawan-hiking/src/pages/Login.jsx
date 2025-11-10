import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (!username || !password) {
            setError("Username dan password harus diisi")
            setLoading(false)
            return
        }

        const result = await login(username, password)

        if (result.success) {
            // Cek role dari response atau dari user context
            const userRole =
                result.data?.role ||
                JSON.parse(localStorage.getItem("user") || "{}")?.role
            if (userRole === "admin") {
                navigate("/admin/dashboard")
            } else {
                navigate("/")
            }
        } else {
            setError(
                result.error || "Login gagal. Periksa email dan password Anda."
            )
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">
                        Masuk ke Kawan Hiking
                    </h1>
                    <p className="text-slate-400">Selamat datang kembali!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-slate-300"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="masukkan username"
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-slate-400/30 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-3 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-400">
                        Belum punya akun?{" "}
                        <Link
                            to="/register"
                            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
