const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "localhost:3000"
const isDev = import.meta.env.DEV

function getTokenHeader() {
    const token = localStorage.getItem("token")
    return token ? { Authorization: "Bearer " + token } : {}
}

export async function apiGet(path, options = {}) {
    let url
    if (path.startsWith("http")) {
        url = path
    } else if (isDev && path.startsWith("/api")) {
        url = path // Vite proxy
    } else {
        url = `${API_BASE_URL}${path}`
    }
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getTokenHeader(), // tambahkan otomatis JWT
                ...(options.headers || {}),
            },
            credentials: options.credentials ?? "include",
        })
        if (!response.ok) {
            const message = await safeErrorMessage(response)
            throw new Error(message)
        }
        return response.json()
    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(
                `Tidak dapat terhubung ke server. Pastikan server API berjalan di ${
                    isDev && path.startsWith("/api")
                        ? "proxy target"
                        : API_BASE_URL
                }`
            )
        }
        throw error
    }
}

export async function apiPost(path, body, options = {}) {
    let url
    if (path.startsWith("http")) {
        url = path
    } else if (isDev && path.startsWith("/api")) {
        url = path
    } else {
        url = `${API_BASE_URL}${path}`
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getTokenHeader(), // tambahkan otomatis JWT
                ...(options.headers || {}),
            },
            body: JSON.stringify(body),
            credentials: options.credentials ?? "include",
        })
        if (!response.ok) {
            const message = await safeErrorMessage(response)
            throw new Error(message)
        }
        try {
            return await response.json()
        } catch (error) {
            console.warn("Response tidak valid JSON:", error)
            return {}
        }
    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(
                `Tidak dapat terhubung ke server. Pastikan server API berjalan di ${
                    isDev && path.startsWith("/api")
                        ? "proxy target"
                        : API_BASE_URL
                }`
            )
        }
        throw error
    }
}

export async function apiPut(path, body, options = {}) {
    let url
    if (path.startsWith("http")) {
        url = path
    } else if (isDev && path.startsWith("/api")) {
        url = path
    } else {
        url = `${API_BASE_URL}${path}`
    }
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getTokenHeader(),
                ...(options.headers || {}),
            },
            body: JSON.stringify(body),
            credentials: options.credentials ?? "include",
        })
        if (!response.ok) {
            const message = await safeErrorMessage(response)
            throw new Error(message)
        }
        try {
            return await response.json()
        } catch (error) {
            console.warn("Response tidak valid JSON:", error)
            return {}
        }
    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(
                `Tidak dapat terhubung ke server. Pastikan server API berjalan di ${
                    isDev && path.startsWith("/api")
                        ? "proxy target"
                        : API_BASE_URL
                }`
            )
        }
        throw error
    }
}

export async function apiDelete(path, options = {}) {
    let url
    if (path.startsWith("http")) {
        url = path
    } else if (isDev && path.startsWith("/api")) {
        url = path
    } else {
        url = `${API_BASE_URL}${path}`
    }
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...getTokenHeader(),
                ...(options.headers || {}),
            },
            credentials: options.credentials ?? "include",
        })
        if (!response.ok) {
            const message = await safeErrorMessage(response)
            throw new Error(message)
        }
        try {
            return await response.json()
        } catch (error) {
            console.warn("Response tidak valid JSON:", error)
            return {}
        }
    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(
                `Tidak dapat terhubung ke server. Pastikan server API berjalan di ${
                    isDev && path.startsWith("/api")
                        ? "proxy target"
                        : API_BASE_URL
                }`
            )
        }
        throw error
    }
}

async function safeErrorMessage(response) {
    try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            // Prioritaskan pesan error yang lebih detail dari backend
            const errorMsg = data?.message || data?.error || data?.errorMessage || data?.detail
            if (errorMsg) {
                return `${response.status} ${response.statusText}: ${errorMsg}`
            }
            return `${response.status} ${response.statusText}`
        } else {
            const text = await response.text()
            return text || `${response.status} ${response.statusText}`
        }
    } catch (error) {
        return `Internal Server Error (${response.status})`
    }
}
