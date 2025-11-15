import React, { useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "../../contexts/ChatContext"
import { apiDelete } from "../../lib/api"

const QUICK_REPLIES = [
    "Halo! Terima kasih sudah menghubungi admin, kami akan bantu segera ya.",
    "Informasi lengkap mengenai jadwal trip terbaru bisa dicek di menu Open Trip.",
    "Silakan kirimkan detail rencana pendakianmu supaya kami bisa rekomendasikan trip yang cocok.",
]

function formatTime(timestamp) {
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

function highlightSearch(text, query) {
    if (!query.trim()) return text
    const regex = new RegExp(
        `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
    )
    return text.split(regex).map((part, index) =>
        regex.test(part) ? (
            <mark
                key={`${part}-${index}`}
                className="rounded bg-cyan-400/20 px-1 text-cyan-200"
            >
                {part}
            </mark>
        ) : (
            <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        )
    )
}

export default function ManageChat() {
    const {
        messages,
        loading,
        error,
        sendMessage,
        markMessagesAsRead,
        deleteMessage,
        connected,
    } = useChat()
    const [searchQuery, setSearchQuery] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [deletingMessage, setDeletingMessage] = useState(null)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        markMessagesAsRead().catch(() => {})
    }, [markMessagesAsRead])

    useEffect(() => {
        if (messages.length === 0) return
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

        const last = messages[messages.length - 1]
        if (last?.role === "user") {
            markMessagesAsRead().catch(() => {})
        }
    }, [messages, markMessagesAsRead])

    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return messages
        const normalized = searchQuery.trim().toLowerCase()
        return messages.filter((message) => {
            return (
                message.message?.toLowerCase().includes(normalized) ||
                message.username?.toLowerCase().includes(normalized)
            )
        })
    }, [messages, searchQuery])

    const stats = useMemo(() => {
        const userMessages = messages.filter(
            (msg) => msg.role === "user"
        ).length
        const adminMessages = messages.filter(
            (msg) => msg.role === "admin"
        ).length
        return {
            total: messages.length,
            user: userMessages,
            admin: adminMessages,
        }
    }, [messages])

    const handleSend = async (event) => {
        event.preventDefault()
        if (!newMessage.trim() || sending) return
        setSending(true)
        try {
            await sendMessage(newMessage.trim())
            setNewMessage("")
            setTimeout(
                () =>
                    messagesEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                    }),
                120
            )
        } catch (err) {
            console.error("Gagal mengirim pesan:", err)
            alert(err.message || "Gagal mengirim pesan.")
        } finally {
            setSending(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingMessage) return
        try {
            await deleteMessage(deletingMessage.id)
            setDeletingMessage(null)
        } catch (err) {
            alert(err.message || "Gagal menghapus pesan.")
        }
    }

    const applyQuickReply = (template) => {
        setNewMessage((prev) => {
            if (!prev) return template
            return `${prev}\n${template}`
        })
    }

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200">
                            Admin • Komunitas Chat
                        </span>
                        <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                                connected
                                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                                    : "border-amber-400/40 bg-amber-400/10 text-amber-200"
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
                    <h1 className="text-3xl font-bold text-slate-100">
                        Kelola Pesan Komunitas
                    </h1>
                    <p className="max-w-3xl text-sm text-cyan-100/90">
                        Pantau percakapan komunitas secara real-time, balas
                        pertanyaan anggota, dan kelola pesan yang tidak sesuai.
                    </p>
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="relative flex flex-col rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-xl shadow-slate-900/30">
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <input
                            type="text"
                            placeholder="Cari pesan atau username..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            className="w-full rounded-xl border border-slate-600/50 bg-slate-800 px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setSearchQuery("")
                                    markMessagesAsRead().catch(() => {})
                                }}
                                className="rounded-xl border border-slate-700/60 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-200"
                            >
                                Bersihkan & Tandai Baca
                            </button>
                            <button
                                onClick={async () => {
                                    if (window.confirm("Apakah Anda yakin ingin menghapus semua pesan chat? Tindakan ini tidak dapat dibatalkan.")) {
                                        try {
                                            await apiDelete("/api/chat")
                                            // Refresh messages
                                            window.location.reload()
                                        } catch (err) {
                                            alert("Gagal menghapus semua pesan: " + err.message)
                                        }
                                    }
                                }}
                                className="rounded-xl border border-red-500/60 px-4 py-2 text-sm text-red-300 transition hover:border-red-400/60 hover:text-red-200"
                            >
                                Bersihkan Semua Chat
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/60">
                        <div className="h-[520px] space-y-4 overflow-y-auto p-6">
                            {loading ? (
                                <div className="flex h-full items-center justify-center text-slate-400">
                                    Memuat percakapan...
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                                    <span className="text-4xl">💬</span>
                                    <p>
                                        Tidak ada pesan yang cocok dengan
                                        pencarian.
                                    </p>
                                </div>
                            ) : (
                                filteredMessages.map((message) => {
                                    const isAdminMessage =
                                        message.role === "admin"
                                    const highlighted = highlightSearch(
                                        message.message || "",
                                        searchQuery
                                    )
                                    return (
                                        <div
                                            key={message.id}
                                            className={`group flex ${
                                                isAdminMessage
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`relative max-w-[75%] rounded-2xl px-5 py-4 shadow-lg shadow-slate-900/30 ${
                                                    isAdminMessage
                                                        ? "bg-gradient-to-tr from-purple-400 to-pink-400 text-slate-900"
                                                        : "bg-slate-800 text-slate-100 border border-slate-700/60"
                                                }`}
                                            >
                                                <div className="mb-2 flex items-start justify-between gap-3 text-xs uppercase tracking-widest">
                                                    <span className="font-semibold">
                                                        {message.username ||
                                                            "Pengguna"}
                                                        {isAdminMessage &&
                                                            " • Admin"}
                                                    </span>
                                                    <span className="text-slate-200/70">
                                                        {formatTime(
                                                            message.created_at
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                                    {highlighted}
                                                </p>
                                                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setNewMessage(
                                                                (prev) =>
                                                                    `${
                                                                        prev
                                                                            ? `${prev}\n`
                                                                            : ""
                                                                    }@${
                                                                        message.username
                                                                    } `
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-600/40 px-3 py-1 transition hover:border-cyan-300/60 hover:text-cyan-200"
                                                    >
                                                        Balas cepat
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeletingMessage(
                                                                message
                                                            )
                                                        }
                                                        className="hidden rounded-lg border border-red-400/40 px-3 py-1 text-red-200 transition hover:border-red-300/60 hover:text-red-100 group-hover:inline-flex"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSend}
                        className="mt-4 space-y-4 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4"
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            {QUICK_REPLIES.map((template) => (
                                <button
                                    key={template}
                                    type="button"
                                    onClick={() => applyQuickReply(template)}
                                    className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs font-medium text-cyan-200 transition hover:border-cyan-300/60"
                                >
                                    {template.slice(0, 34)}...
                                </button>
                            ))}
                        </div>
                        <label className="block text-sm font-semibold text-slate-300">
                            Kirim Pesan / Pengumuman
                        </label>
                        <div className="flex flex-col gap-3 md:flex-row">
                            <textarea
                                rows={3}
                                value={newMessage}
                                onChange={(event) =>
                                    setNewMessage(event.target.value)
                                }
                                placeholder="Tulis pesan untuk komunitas..."
                                className="flex-1 rounded-xl border border-slate-600/50 bg-slate-800 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-6 py-3 font-semibold text-slate-900 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {sending ? "Mengirim..." : "Kirim"}
                            </button>
                        </div>
                    </form>

                    {deletingMessage && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                            <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900 p-6 shadow-xl">
                                <h3 className="text-lg font-semibold text-slate-100">
                                    Hapus Pesan?
                                </h3>
                                <p className="mt-2 text-sm text-slate-300">
                                    Pesan dari{" "}
                                    <span className="font-semibold text-cyan-300">
                                        {deletingMessage.username}
                                    </span>{" "}
                                    akan dihapus permanen dan tidak dapat
                                    dikembalikan.
                                </p>
                                <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-800/60 p-4 text-sm text-slate-200">
                                    {deletingMessage.message}
                                </div>
                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setDeletingMessage(null)}
                                        className="rounded-lg border border-slate-600/50 px-4 py-2 text-sm text-slate-300 hover:border-slate-400/60"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="flex flex-col gap-4 self-start rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6">
                    <h2 className="text-lg font-semibold text-slate-200">
                        Statistik
                    </h2>
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-center">
                            <div className="text-3xl font-bold text-cyan-200">
                                {stats.total}
                            </div>
                            <div className="text-xs uppercase tracking-wider text-cyan-100/80">
                                Total Pesan
                            </div>
                        </div>
                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center">
                            <div className="text-3xl font-bold text-emerald-200">
                                {stats.user}
                            </div>
                            <div className="text-xs uppercase tracking-wider text-emerald-100/80">
                                Pesan Anggota
                            </div>
                        </div>
                        <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4 text-center">
                            <div className="text-3xl font-bold text-purple-200">
                                {stats.admin}
                            </div>
                            <div className="text-xs uppercase tracking-wider text-purple-100/80">
                                Pesan Admin
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 text-sm text-slate-400">
                        <h3 className="text-sm font-semibold text-slate-200">
                            Tips Moderasi
                        </h3>
                        <ul className="mt-2 list-disc space-y-2 pl-5">
                            <li>
                                Gunakan quick reply untuk respons cepat yang
                                konsisten.
                            </li>
                            <li>
                                Hapus pesan yang tidak sesuai dan berikan
                                pengumuman resmi bila diperlukan.
                            </li>
                            <li>
                                Catat pertanyaan umum untuk disiapkan ke FAQ
                                atau konten komunitas.
                            </li>
                        </ul>
                    </div>
                </aside>
            </section>
        </div>
    )
}
