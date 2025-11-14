import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useChat } from "../contexts/ChatContext"

export default function ChatWidget() {
    const { user, token } = useAuth()
    const {
        messages,
        loading,
        error,
        unreadCount,
        sendMessage,
        markMessagesAsRead,
    } = useChat()
    const [isOpen, setIsOpen] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)
    const lastUserMessageIdRef = useRef(null)
    const isAdmin = user?.role === "admin"

    if (!user || !token) {
        return null
    }

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    useEffect(() => {
        if (!isAdmin) return
        if (isOpen) {
            markMessagesAsRead().catch((err) => {
                console.error("Failed to mark messages as read:", err)
            })
        }
    }, [isAdmin, isOpen, markMessagesAsRead])

    useEffect(() => {
        if (!isAdmin || !isOpen || messages.length === 0) return
        const lastMessage = messages[messages.length - 1]
        if (
            lastMessage?.role === "user" &&
            lastMessage.id !== lastUserMessageIdRef.current
        ) {
            lastUserMessageIdRef.current = lastMessage.id
            markMessagesAsRead().catch((err) => {
                console.error("Failed to mark messages as read:", err)
            })
        }
    }, [messages, isAdmin, isOpen, markMessagesAsRead])

    const handleSendMessage = async (event) => {
        event.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            await sendMessage(newMessage.trim())
            setNewMessage("")
            setTimeout(() => scrollToBottom(), 120)
        } catch (err) {
            console.error("Error sending message:", err)
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

    return (
        <>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-blue-400 shadow-lg transition-all duration-300 hover:shadow-xl"
                aria-label="Buka Chat"
            >
                <svg
                    className="h-6 w-6 text-slate-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                {isAdmin && unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl">
                    <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Live Chat
                            </h3>
                            <p className="text-sm text-slate-900/80">
                                {isAdmin ? "Admin Support" : "Customer Support"}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-900 transition-colors hover:text-slate-700"
                            aria-label="Tutup Chat"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto bg-slate-800/50 p-4">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-cyan-400" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="py-8 text-center text-slate-400">
                                <p>Belum ada pesan</p>
                                <p className="mt-2 text-sm">
                                    Mulai percakapan dengan mengirim pesan!
                                </p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isOwnMessage =
                                    msg.username === user.username
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${
                                            isOwnMessage
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                                isOwnMessage
                                                    ? "bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900"
                                                    : msg.role === "admin"
                                                    ? "bg-gradient-to-tr from-purple-400 to-pink-400 text-slate-900"
                                                    : "bg-slate-700 text-slate-100"
                                            }`}
                                        >
                                            {!isOwnMessage && (
                                                <div className="mb-1 text-xs font-semibold opacity-80">
                                                    {msg.username}{" "}
                                                    {msg.role === "admin" &&
                                                        "👑"}
                                                </div>
                                            )}
                                            <p className="break-words text-sm">
                                                {msg.message}
                                            </p>
                                            <p className="mt-1 text-xs opacity-70">
                                                {formatTime(msg.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        {error && (
                            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                                {error}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-slate-700/50 bg-slate-800 px-4 py-4"
                    >
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(event) =>
                                    setNewMessage(event.target.value)
                                }
                                placeholder="Ketik pesan..."
                                disabled={sending}
                                className="flex-1 rounded-lg border border-slate-400/30 bg-slate-700/70 px-4 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="flex items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 px-4 py-2 font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {sending ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-slate-900" />
                                ) : (
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
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}
