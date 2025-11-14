import React, { useMemo, useEffect, useState, useRef } from "react"
import {
    useParams,
    useNavigate,
    Link,
    useLocation,
    useSearchParams,
} from "react-router-dom"
import { apiGet, apiPost } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"

export default function OpenTripPayment() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const { user } = useAuth()
    const state = location.state || {}
    const { trip: stateTrip, formData: stateFormData, registrationId } = state
    const [trip, setTrip] = useState(stateTrip)
    const [formData, setFormData] = useState(stateFormData)
    const [loading, setLoading] = useState(!stateTrip || !stateFormData)
    const [error, setError] = useState("")
    const [paymentStatus, setPaymentStatus] = useState(null)
    const [processingPayment, setProcessingPayment] = useState(false)
    const [snapReady, setSnapReady] = useState(false)
    const snapScriptLoaded = useRef(false)
    const paymentProcessed = useRef(false)

    // Load Midtrans Snap script
    useEffect(() => {
        if (snapScriptLoaded.current) return

        // Check if script already exists
        const existingScript = document.querySelector(
            'script[src*="midtrans.com/snap"]'
        )
        if (existingScript) {
            snapScriptLoaded.current = true
            if (window.snap) {
                setSnapReady(true)
            }
            return
        }

        const script = document.createElement("script")
        const isProduction =
            import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === "true"
        script.src = isProduction
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
        script.setAttribute(
            "data-client-key",
            import.meta.env.VITE_MIDTRANS_CLIENT_KEY || ""
        )
        script.async = true
        script.onload = () => {
            snapScriptLoaded.current = true
            // Wait a bit for window.snap to be available
            const checkSnap = setInterval(() => {
                if (window.snap) {
                    setSnapReady(true)
                    clearInterval(checkSnap)
                }
            }, 100)
            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkSnap)
                if (!window.snap) {
                    console.error("Midtrans Snap script failed to load")
                    setError(
                        "Gagal memuat halaman pembayaran. Silakan refresh halaman."
                    )
                }
            }, 5000)
        }
        script.onerror = () => {
            console.error("Failed to load Midtrans Snap script")
            setError(
                "Gagal memuat halaman pembayaran. Silakan refresh halaman."
            )
        }
        document.body.appendChild(script)

        return () => {
            // Cleanup if needed
        }
    }, [])

    // Check payment status from URL params
    useEffect(() => {
        const status = searchParams.get("status")
        if (status) {
            if (status === "success") {
                setPaymentStatus("success")
                // Check payment status from backend
                if (registrationId) {
                    checkPaymentStatus()
                }
            } else if (status === "error") {
                setPaymentStatus("error")
                setError("Pembayaran gagal. Silakan coba lagi.")
            } else if (status === "pending") {
                setPaymentStatus("pending")
            }
        }
    }, [searchParams, registrationId])

    // Fetch data and check payment status
    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }
        if (!stateTrip || !stateFormData) {
            async function fetchData() {
                try {
                    setLoading(true)
                    const tripData = await apiGet(`/api/open-trips/${id}`)
                    setTrip(tripData)
                    setFormData({
                        namaLengkap: user.username || "",
                        email: user.email || "",
                        nomorHp: "",
                        jumlahPeserta: 1,
                        alamat: "",
                        kontakDarurat: "",
                        nomorDarurat: "",
                        riwayatPenyakit: "",
                        kondisiFit: false,
                        catatan: "",
                    })
                } catch (err) {
                    console.error("Error fetching payment data:", err)
                    setError(
                        "Gagal memuat data. Silakan kembali dan coba lagi."
                    )
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }

        // Check payment status if registrationId exists
        if (registrationId) {
            checkPaymentStatus()
        }
        // Don't auto-initialize payment, let user click the button
    }, [id, user, navigate, stateTrip, stateFormData, registrationId])

    async function checkPaymentStatus() {
        if (!registrationId) return
        try {
            const status = await apiGet(
                `/api/payment/open-trip/${registrationId}/status`
            )
            setPaymentStatus(status.payment_status)
            if (status.payment_status === "paid") {
                // Payment successful
                setTimeout(() => {
                    navigate("/open-trip", { replace: true })
                }, 2000)
            }
            // If pending or expired, allow user to retry payment
            // paymentStatus will be set to show appropriate UI
        } catch (err) {
            console.error("Error checking payment status:", err)
            // If error, assume pending so user can try to pay
            setPaymentStatus("pending")
        }
    }

    async function initializePayment() {
        // @ts-ignore - Midtrans Snap is loaded dynamically
        if (!registrationId) {
            setError("ID registrasi tidak ditemukan. Silakan daftar ulang.")
            return
        }

        // Allow retry if payment is pending or expired
        if (
            paymentProcessed.current &&
            paymentStatus !== "pending" &&
            paymentStatus !== "expired"
        ) {
            setError("Pembayaran sedang diproses. Silakan tunggu...")
            return
        }

        // Reset payment processed flag if retrying
        if (paymentStatus === "pending" || paymentStatus === "expired") {
            paymentProcessed.current = false
        }

        if (!window.snap) {
            setError(
                "Halaman pembayaran belum siap. Silakan tunggu sebentar atau refresh halaman."
            )
            // Try to wait for snap to load
            const checkSnap = setInterval(() => {
                if (window.snap) {
                    clearInterval(checkSnap)
                    initializePayment()
                }
            }, 500)
            setTimeout(() => {
                clearInterval(checkSnap)
                if (!window.snap) {
                    setError(
                        "Gagal memuat halaman pembayaran. Silakan refresh halaman."
                    )
                }
            }, 5000)
            return
        }

        try {
            setProcessingPayment(true)
            paymentProcessed.current = true

            // Create payment transaction
            const paymentData = await apiPost(
                `/api/payment/open-trip/${registrationId}`
            )

            if (!paymentData.token) {
                throw new Error("Gagal membuat transaksi pembayaran")
            }

            // Open Midtrans Snap popup
            // @ts-ignore - Midtrans Snap is loaded dynamically
            window.snap.pay(paymentData.token, {
                onSuccess: function (result) {
                    console.log("Payment success:", result)
                    setPaymentStatus("paid")
                    setProcessingPayment(false)
                    // Redirect after successful payment
                    setTimeout(() => {
                        navigate("/open-trip", { replace: true })
                    }, 2000)
                },
                onPending: function (result) {
                    console.log("Payment pending:", result)
                    setPaymentStatus("pending")
                    setProcessingPayment(false)
                },
                onError: function (result) {
                    console.error("Payment error:", result)
                    setPaymentStatus("error")
                    setError("Pembayaran gagal. Silakan coba lagi.")
                    setProcessingPayment(false)
                    paymentProcessed.current = false
                },
                onClose: function () {
                    console.log("Payment popup closed")
                    setProcessingPayment(false)
                    paymentProcessed.current = false
                },
            })
        } catch (err) {
            console.error("Error initializing payment:", err)
            let errorMessage = "Gagal memproses pembayaran. Silakan coba lagi."

            // Extract error message from response
            if (err.message) {
                errorMessage = err.message
                // If it's a 500 error, show more helpful message
                if (
                    err.message.includes("500") ||
                    err.message.includes("Internal Server Error")
                ) {
                    errorMessage =
                        "Terjadi kesalahan pada server. Silakan hubungi administrator atau coba lagi nanti."
                }
                // If it's a payment gateway error
                if (err.message.includes("Payment gateway not configured")) {
                    errorMessage =
                        "Sistem pembayaran belum dikonfigurasi. Silakan hubungi administrator."
                }
            }

            setError(errorMessage)
            setProcessingPayment(false)
            paymentProcessed.current = false
        }
    }

    function handlePayNow() {
        setError("") // Clear previous errors
        console.log("Pay now clicked", {
            registrationId,
            snapReady,
            windowSnap: !!window.snap,
            processingPayment,
        })

        if (!registrationId) {
            setError("ID registrasi tidak ditemukan. Silakan daftar ulang.")
            return
        }

        initializePayment()
    }

    const total = useMemo(() => {
        if (!trip?.harga_per_orang || !formData?.jumlahPeserta) return 0
        return parseInt(trip.harga_per_orang) * parseInt(formData.jumlahPeserta)
    }, [trip, formData])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Memuat data pembayaran...</p>
                </div>
            </div>
        )
    }

    if (error || !trip || !formData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-red-400">
                        {error || "Data tidak ditemukan"}
                    </p>
                    <Link
                        to={`/open-trip/${id || ""}`}
                        className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
                    >
                        Kembali ke Detail Trip
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-4xl px-4 space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Kembali
                </button>

                <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-900/60">
                        <h1 className="text-2xl font-bold text-white">
                            Pembayaran Open Trip
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {trip?.nama_trip || "Trip Tanpa Judul"}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <section className="bg-slate-900/40 rounded-xl border border-slate-700/40 p-5 space-y-4">
                            <h2 className="text-lg font-semibold text-cyan-300">
                                Ringkasan Pesanan
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                                <div>
                                    <p className="text-slate-400">
                                        Nama Peserta
                                    </p>
                                    <p className="font-semibold">
                                        {formData.namaLengkap}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400">Email</p>
                                    <p className="font-semibold">
                                        {formData.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400">Nomor HP</p>
                                    <p className="font-semibold">
                                        {formData.nomorHp}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400">
                                        Jumlah Peserta
                                    </p>
                                    <p className="font-semibold">
                                        {formData.jumlahPeserta} orang
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-slate-400">Alamat</p>
                                    <p className="font-semibold">
                                        {formData.alamat}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400">
                                        Kontak Darurat
                                    </p>
                                    <p className="font-semibold">
                                        {formData.kontakDarurat}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400">
                                        Nomor Darurat
                                    </p>
                                    <p className="font-semibold">
                                        {formData.nomorDarurat}
                                    </p>
                                </div>
                                {formData.riwayatPenyakit && (
                                    <div className="md:col-span-2">
                                        <p className="text-slate-400">
                                            Riwayat Penyakit / Alergi
                                        </p>
                                        <p className="font-semibold">
                                            {formData.riwayatPenyakit}
                                        </p>
                                    </div>
                                )}
                                {formData.catatan && (
                                    <div className="md:col-span-2">
                                        <p className="text-slate-400">
                                            Catatan
                                        </p>
                                        <p className="font-semibold">
                                            {formData.catatan}
                                        </p>
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <p className="text-slate-400">
                                        Konfirmasi Kesehatan
                                    </p>
                                    <p className="font-semibold text-green-400">
                                        {formData.kondisiFit
                                            ? "Peserta menyatakan dalam kondisi fit"
                                            : "Belum dikonfirmasi"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-slate-900/40 rounded-xl border border-slate-700/40 p-5 space-y-4">
                            <h2 className="text-lg font-semibold text-cyan-300">
                                Detail Pembayaran
                            </h2>
                            <div className="text-sm text-slate-300 space-y-2">
                                <div className="flex justify-between">
                                    <span>Harga per orang</span>
                                    <span>
                                        {trip?.harga_per_orang
                                            ? `Rp ${parseInt(
                                                  trip.harga_per_orang
                                              ).toLocaleString("id-ID")}`
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Jumlah peserta</span>
                                    <span>{formData.jumlahPeserta} orang</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-cyan-400 pt-2 border-t border-slate-700/40">
                                    <span>Total pembayaran</span>
                                    <span>
                                        {total
                                            ? `Rp ${total.toLocaleString(
                                                  "id-ID"
                                              )}`
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-slate-900/40 rounded-xl border border-slate-700/40 p-5 space-y-3 text-sm text-slate-300">
                            <h2 className="text-lg font-semibold text-cyan-300">
                                Metode Pembayaran
                            </h2>
                            {paymentStatus === "paid" ? (
                                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                    <p className="text-green-400 font-semibold">
                                        ✓ Pembayaran Berhasil
                                    </p>
                                    <p className="text-slate-300 text-xs mt-2">
                                        Pendaftaran Anda telah dikonfirmasi.
                                        Terima kasih!
                                    </p>
                                </div>
                            ) : paymentStatus === "pending" ||
                              paymentStatus === "expired" ? (
                                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 space-y-3">
                                    <div>
                                        <p className="text-yellow-400 font-semibold">
                                            {paymentStatus === "expired"
                                                ? "⏰ Pembayaran Kadaluarsa"
                                                : "⏳ Menunggu Pembayaran"}
                                        </p>
                                        <p className="text-slate-300 text-xs mt-2">
                                            {paymentStatus === "expired"
                                                ? "Pembayaran sebelumnya telah kadaluarsa. Silakan lakukan pembayaran ulang."
                                                : "Pembayaran Anda masih menunggu. Jika Anda belum menyelesaikan pembayaran, silakan klik tombol 'Ulangi Pembayaran' di bawah."}
                                        </p>
                                    </div>
                                </div>
                            ) : paymentStatus === "error" ? (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                    <p className="text-red-400 font-semibold">
                                        ✗ Pembayaran Gagal
                                    </p>
                                    <p className="text-slate-300 text-xs mt-2">
                                        Terjadi kesalahan saat memproses
                                        pembayaran. Silakan coba lagi.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-slate-300 mb-3">
                                        Klik tombol "Bayar Sekarang" untuk
                                        melanjutkan ke halaman pembayaran
                                        Midtrans.
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                        Anda akan diarahkan ke halaman
                                        pembayaran yang aman untuk menyelesaikan
                                        transaksi.
                                    </p>
                                </div>
                            )}
                        </section>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
                            <Link
                                to="/open-trip"
                                className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors text-center"
                            >
                                Kembali ke daftar trip
                            </Link>
                            {paymentStatus === "paid" ? (
                                <button
                                    onClick={() =>
                                        navigate("/open-trip", {
                                            replace: true,
                                        })
                                    }
                                    className="px-6 py-3 rounded-lg bg-gradient-to-tr from-green-400 to-emerald-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(74,222,128,0.35)] transition-all duration-300"
                                >
                                    Kembali ke Daftar Trip
                                </button>
                            ) : paymentStatus === "pending" ||
                              paymentStatus === "expired" ? (
                                <button
                                    onClick={handlePayNow}
                                    disabled={processingPayment}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(251,191,36,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={
                                        !registrationId
                                            ? "ID registrasi tidak ditemukan"
                                            : !snapReady && !window.snap
                                            ? "Menunggu halaman pembayaran siap..."
                                            : ""
                                    }
                                >
                                    {processingPayment
                                        ? "Memproses..."
                                        : "Ulangi Pembayaran"}
                                </button>
                            ) : (
                                <button
                                    onClick={handlePayNow}
                                    disabled={processingPayment}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-tr from-green-400 to-emerald-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(74,222,128,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={
                                        !registrationId
                                            ? "ID registrasi tidak ditemukan"
                                            : !snapReady && !window.snap
                                            ? "Menunggu halaman pembayaran siap..."
                                            : ""
                                    }
                                >
                                    {processingPayment
                                        ? "Memproses..."
                                        : "Bayar Sekarang"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
