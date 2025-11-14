import { io } from "socket.io-client"

function resolveSocketBaseUrl() {
    const explicitUrl =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_API_BASE_URL

    if (explicitUrl) {
        const sanitized = explicitUrl.replace(/\/$/, "")
        if (typeof window !== "undefined") {
            try {
                const parsed = new URL(sanitized)
                const windowHost = window.location.hostname
                const isLocalHost = [
                    "localhost",
                    "127.0.0.1",
                    "0.0.0.0",
                ].includes(parsed.hostname)
                if (
                    isLocalHost &&
                    windowHost &&
                    windowHost !== parsed.hostname
                ) {
                    parsed.hostname = windowHost
                    if (
                        !parsed.port ||
                        ["5173", "80", "443"].includes(parsed.port)
                    ) {
                        const currentPort = window.location.port
                        if (
                            currentPort &&
                            currentPort !== "5173" &&
                            currentPort !== "80" &&
                            currentPort !== "443"
                        ) {
                            parsed.port = currentPort
                        } else if (
                            parsed.port === "" ||
                            parsed.port === "80" ||
                            parsed.port === "443"
                        ) {
                            parsed.port =
                                parsed.protocol === "https:" ? "443" : "80"
                        }
                    }
                    return parsed.toString().replace(/\/$/, "")
                }
            } catch (error) {
                console.warn(
                    "Gagal mem-parse VITE_SOCKET_URL, fallback ke nilai apa adanya",
                    error
                )
            }
        }
        return sanitized
    }

    if (typeof window !== "undefined") {
        const { protocol, hostname, port } = window.location
        const preferredPort =
            import.meta.env.VITE_SOCKET_PORT ||
            (port && port !== "5173" && port !== "80" && port !== "443"
                ? port
                : protocol === "https:"
                ? "443"
                : "3000")

        const originPortSegment = preferredPort ? `:${preferredPort}` : ""

        return `${protocol}//${hostname}${originPortSegment}`.replace(/\/$/, "")
    }

    return "http://localhost:3000"
}

const SOCKET_BASE_URL = resolveSocketBaseUrl()

let socketInstance = null
let currentToken = null

export function connectSocket(token) {
    if (!token) return null

    // Reuse existing instance when possible
    if (socketInstance) {
        if (currentToken !== token) {
            currentToken = token
            socketInstance.auth = { token }
            if (socketInstance.connected) {
                socketInstance.disconnect()
            }
            socketInstance.connect()
        } else if (socketInstance.disconnected) {
            socketInstance.connect()
        }
        return socketInstance
    }

    socketInstance = io(SOCKET_BASE_URL, {
        transports: ["websocket"],
        auth: { token },
        autoConnect: true,
        withCredentials: true,
    })
    currentToken = token
    return socketInstance
}

export function disconnectSocket() {
    if (socketInstance) {
        socketInstance.removeAllListeners()
        socketInstance.disconnect()
        socketInstance = null
        currentToken = null
    }
}

export function getSocket() {
    return socketInstance
}
