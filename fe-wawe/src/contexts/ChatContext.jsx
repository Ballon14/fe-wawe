import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { useAuth } from "./AuthContext"
import { apiGet, apiDelete } from "../lib/api"
import { connectSocket, disconnectSocket } from "../lib/socket"

const ChatContext = createContext({
    messages: [],
    loading: false,
    error: null,
    unreadCount: 0,
    connected: false,
    sendMessage: async () => {},
    markMessagesAsRead: async () => {},
    deleteMessage: async () => {},
})

const MAX_MESSAGES = 200

function sanitizeMessages(items = []) {
    return items
        .filter(Boolean)
        .map((msg) => ({
            ...msg,
            message: typeof msg.message === "string" ? msg.message : "",
        }))
        .sort((a, b) => (a.id || 0) - (b.id || 0))
}

function trimMessages(list) {
    if (list.length <= MAX_MESSAGES) return list
    return list.slice(list.length - MAX_MESSAGES)
}

export function ChatProvider({ children }) {
    const { token, user } = useAuth()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [connected, setConnected] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const socketRef = useRef(null)

    // Helper to merge single message
    const appendMessage = (message) => {
        if (!message) return
        setMessages((prev) => {
            const exists = prev.some((item) => item.id === message.id)
            const next = exists
                ? prev.map((item) =>
                      item.id === message.id ? { ...item, ...message } : item
                  )
                : [...prev, message]
            return trimMessages(
                next.sort((a, b) => {
                    if (!a.id || !b.id) {
                        return (
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                        )
                    }
                    return a.id - b.id
                })
            )
        })
    }

    useEffect(() => {
        if (!token || !user) {
            setMessages([])
            setUnreadCount(0)
            setConnected(false)
            setError(null)
            if (socketRef.current) {
                socketRef.current.removeAllListeners()
            }
            disconnectSocket()
            socketRef.current = null
            return
        }

        let cancelled = false
        setLoading(true)
        setError(null)

        // Fallback initial fetch via REST
        apiGet("/api/chat?limit=100")
            .then((data) => {
                if (!cancelled && Array.isArray(data)) {
                    setMessages(sanitizeMessages(data))
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error("Initial chat fetch failed:", err)
                    setError(err.message || "Gagal memuat pesan chat.")
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })

        if (user.role === "admin") {
            apiGet("/api/chat/unread-count")
                .then((data) => {
                    if (!cancelled && data && typeof data.count === "number") {
                        setUnreadCount(data.count)
                    }
                })
                .catch((err) => {
                    if (!cancelled) {
                        console.error("Fetch unread count failed:", err)
                    }
                })
        }

        const socket = connectSocket(token)
        socketRef.current = socket

        const handleConnect = () => {
            setConnected(true)
            setError(null)
        }

        const handleDisconnect = () => {
            setConnected(false)
        }

        const handleHistory = (history) => {
            if (!Array.isArray(history)) return
            setMessages(sanitizeMessages(history))
        }

        const handleMessage = (message) => {
            appendMessage(message)
        }

        const handleUnread = (count) => {
            if (typeof count === "number") {
                setUnreadCount(count)
            }
        }

        const handleErrorEvent = (msg) => {
            if (typeof msg === "string") {
                setError(msg)
            }
        }

        const handleDeleteEvent = (payload) => {
            if (!payload || typeof payload.id === "undefined") return
            setMessages((prev) =>
                prev.filter((message) => message.id !== payload.id)
            )
        }

        socket.on("connect", handleConnect)
        socket.on("disconnect", handleDisconnect)
        socket.on("chat:history", handleHistory)
        socket.on("chat:message", handleMessage)
        socket.on("chat:unread-count", handleUnread)
        socket.on("chat:error", handleErrorEvent)
        socket.on("chat:delete", handleDeleteEvent)

        return () => {
            cancelled = true
            socket.off("connect", handleConnect)
            socket.off("disconnect", handleDisconnect)
            socket.off("chat:history", handleHistory)
            socket.off("chat:message", handleMessage)
            socket.off("chat:unread-count", handleUnread)
            socket.off("chat:error", handleErrorEvent)
            socket.off("chat:delete", handleDeleteEvent)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user?.id])

    const sendMessage = async (content) => {
        const socket = socketRef.current
        if (!socket || !content || !content.trim()) {
            throw new Error("Pesan tidak boleh kosong.")
        }

        return new Promise((resolve, reject) => {
            socket.emit("chat:send", { message: content }, (response) => {
                if (response?.ok) {
                    resolve(response)
                } else {
                    const errMsg = response?.error || "Gagal mengirim pesan."
                    setError(errMsg)
                    reject(new Error(errMsg))
                }
            })
        })
    }

    const markMessagesAsRead = async () => {
        const socket = socketRef.current
        if (!socket) return Promise.resolve()

        return new Promise((resolve, reject) => {
            socket.emit("chat:mark-read", null, (response) => {
                if (response?.ok) {
                    setUnreadCount(0)
                    resolve(response)
                } else if (response?.error) {
                    reject(new Error(response.error))
                } else {
                    resolve(response)
                }
            })
        })
    }

    const deleteMessage = async (id) => {
        if (!id) return
        try {
            await apiDelete(`/api/chat/${id}`)
            setMessages((prev) => prev.filter((message) => message.id !== id))
        } catch (err) {
            console.error("Gagal menghapus pesan:", err)
            throw err
        }
    }

    const value = useMemo(
        () => ({
            messages,
            loading,
            error,
            unreadCount,
            connected,
            sendMessage,
            markMessagesAsRead,
            deleteMessage,
        }),
        [messages, loading, error, unreadCount, connected]
    )

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
    return useContext(ChatContext)
}
