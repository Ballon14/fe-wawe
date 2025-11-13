import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useChat } from "../contexts/ChatContext"

const COMMUNITY_STATS = [
    { value: "2018", label: "Tahun Berdiri" },
    { value: "1000+", label: "Pendaki Bergabung" },
    { value: "50+", label: "Trip Berhasil" },
]

const COMMUNITY_HIGHLIGHTS = [
    "🧭 Topik harian dari admin & komunitas",
    "🤝 Atur pendakian bareng anggota",
    "📸 Bagikan foto dan pengalaman trip",
]

const ETIQUETTE_RULES = [
    "Hormati sesama anggota, hindari SARA dan kata-kata kasar.",
    "Gunakan chat untuk diskusi pendakian, berbagi tips, atau tanya rute.",
    "Laporkan konten yang tidak pantas kepada admin komunitas.",
    "Jangan bagikan informasi pribadi tanpa izin.",
]

const PARTNER_TIPS = [
    "• Sebutkan rencana gunung, tanggal, dan level pengalaman.",
    "• Cantumkan kontak yang nyaman atau ajak DM melalui admin.",
    "• Pastikan verifikasi anggota sebelum transaksi biaya.",
]

export default function ChatKomunitas() {
    const { user } = useAuth()
    const {
        messages,
        loading,
        error,
        connected,
        sendMessage,
        markMessagesAsRead,
    } = useChat()
    const [newMessage, setNewMessage] = useState("")
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)
    const lastUserMessageIdRef = useRef(null)

    const isAdmin = user?.role === "admin"

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior })
    }

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom("auto")
        }
    }, [messages])

    useEffect(() => {
        if (!isAdmin) return
        markMessagesAsRead().catch((err) => {
            console.error("Failed to mark messages as read:", err)
        })
    }, [isAdmin, markMessagesAsRead])

    useEffect(() => {
        if (!isAdmin || messages.length === 0) return
        const lastUserMessage = [...messages]
            .reverse()
            .find((msg) => msg.role === "user")
        if (!lastUserMessage) return
        if (lastUserMessage.id !== lastUserMessageIdRef.current) {
            lastUserMessageIdRef.current = lastUserMessage.id
            markMessagesAsRead().catch((err) => {
                console.error("Failed to mark messages as read:", err)
            })
        }
    }, [messages, isAdmin, markMessagesAsRead])

    const handleSendMessage = async (event) => {
        event.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            await sendMessage(newMessage.trim())
            setNewMessage("")
            setTimeout(() => scrollToBottom(), 120)
        } catch (err) {
            console.error("Gagal mengirim pesan:", err)
            alert(err.message || "Gagal mengirim pesan.")
        } finally {
            setSending(false)
        }
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now - date

        if (diff < 60000) return "Baru saja"
        if (diff < 3600000) return `${Math.floor(diff / 60000)} menit lalu`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam lalu`

        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const renderMessageBubble = (message) => {
        const isOwnMessage = message.username === user?.username
        const isAdminMessage = message.role === "admin"

        return (
            <div
                key={message.id}
                className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                }`}
            >
                <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                        isOwnMessage
                            ? "bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900"
                            : isAdminMessage
                            ? "bg-gradient-to-r from-purple-400 to-pink-400 text-slate-900"
                            : "bg-slate-800 text-slate-100 border border-slate-700/60"
                    }`}
                >
                    {!isOwnMessage && (
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
                            {message.username}
                            {isAdminMessage && " • Admin"}
                        </div>
                    )}
                    <p className="break-words text-sm leading-relaxed">
                        {message.message}
                    </p>
                    <div className="mt-2 text-xs opacity-70">
                        {formatTime(message.created_at)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-20">
            <div className="mx-auto w-full max-w-[1100px] px-4 space-y-10">
                <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/60 p-10 shadow-xl shadow-cyan-500/10">
                    <div className="flex flex-col gap-6 text-center">
                        <div>
                            <span className="inline-flex items-center rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                                Komunitas Kawan Hiking
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
                            Ruang Diskusi & Chat Komunitas
                        </h1>
                        <p className="text-lg text-slate-300 md:text-xl">
                            Terhubung dengan sesama pendaki, berbagi pengalaman,
                            tanya jawab, dan temukan partner pendakian baru.
                            Tetap santun, saling menghormati, dan jaga semangat
                            kebersamaan.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {COMMUNITY_HIGHLIGHTS.map((highlight) => (
                                <div
                                    key={highlight}
                                    className="rounded-2xl border border-slate-700/60 bg-slate-800/60 px-6 py-3 text-sm text-slate-300"
                                >
                                    {highlight}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Status koneksi:{" "}
                            <span
                                className={`ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                                    connected
                                        ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                                        : "border border-amber-400/40 bg-amber-400/10 text-amber-200"
                                }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        connected
                                            ? "bg-emerald-400"
                                            : "bg-amber-300 animate-pulse"
                                    }`}
                                />
                                {connected ? "Terhubung" : "Menghubungkan..."}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <section className="flex flex-col overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900 shadow-2xl shadow-slate-900/40">
                        <div className="border-b border-slate-700/50 px-8 py-6">
                            <h2 className="text-2xl font-semibold text-slate-100">
                                Chat Langsung
                            </h2>
                            <p className="text-sm text-slate-400">
                                Kamu terhubung sebagai{" "}
                                <span className="font-semibold text-cyan-300">
                                    {user?.name ||
                                        user?.username ||
                                        user?.email}
                                </span>
                            </p>
                        </div>

                        <div className="relative flex-1 bg-slate-900/40">
                            {loading ? (
                                <div className="flex h-80 items-center justify-center text-slate-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-cyan-400" />
                                        <p>Memuat percakapan komunitas...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-[460px] flex-col gap-4 overflow-y-auto px-6 py-6">
                                    {error && (
                                        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                            {error}
                                        </div>
                                    )}

                                    {messages.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-400">
                                            <span className="text-4xl">🌄</span>
                                            <div>
                                                <p className="text-lg font-semibold text-slate-200">
                                                    Obrolan masih sepi.
                                                </p>
                                                <p className="text-sm text-slate-400">
                                                    Jadilah yang pertama menyapa
                                                    teman-teman komunitas!
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message) =>
                                            renderMessageBubble(message)
                                        )
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        <form
                            onSubmit={handleSendMessage}
                            className="border-t border-slate-700/50 bg-slate-900/80 px-6 py-5"
                        >
                            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(event) =>
                                        setNewMessage(event.target.value)
                                    }
                                    placeholder="Ketik pesan komunitas..."
                                    className="flex-1 rounded-xl border border-slate-600/50 bg-slate-800 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:opacity-60"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-6 py-3 font-semibold text-slate-900 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {sending ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-t border-slate-900 opacity-80" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                />
                                            </svg>
                                            Kirim Pesan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className="flex flex-col gap-6">
                        <div className="rounded-3xl border border-slate-700/40 bg-slate-900/70 p-8">
                            <h3 className="text-xl font-semibold text-slate-100">
                                Etika Komunitas
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                                Mari ciptakan ruang yang aman, inklusif, dan
                                suportif untuk semua pendaki.
                            </p>
                            <ul className="mt-5 space-y-3 text-sm text-slate-300">
                                {ETIQUETTE_RULES.map((rule) => (
                                    <li key={rule} className="flex gap-3">
                                        <span className="text-cyan-400">•</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
                            <h3 className="text-xl font-semibold text-cyan-200">
                                Tips Mendapat Partner Pendakian
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-cyan-100/90">
                                {PARTNER_TIPS.map((tip) => (
                                    <li key={tip}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
