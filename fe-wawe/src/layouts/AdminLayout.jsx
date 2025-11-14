import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ChatProvider } from "../contexts/ChatContext"
import ChatWidget from "../components/ChatWidget"

export default function AdminLayout({ children }) {
    const { user, token, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const menuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/admin/destinasi", label: "Destinasi", icon: "🗻" },
        { path: "/admin/guides", label: "Guide", icon: "👨‍🦯" },
        { path: "/admin/open-trips", label: "Open Trip", icon: "🎒" },
        {
            path: "/admin/open-trips/registrations",
            label: "Pendaftar Trip",
            icon: "🧾",
        },
        { path: "/admin/private-trips", label: "Private Trip", icon: "🔒" },
        { path: "/admin/chat", label: "Komunitas Chat", icon: "💬" },
    ]

    useEffect(() => {
        if (location.pathname === "/admin") {
            navigate("/admin/dashboard", { replace: true })
        }
    }, [location.pathname, navigate])

    function handleLogout() {
        logout()
        navigate("/login")
    }

    function isActive(path) {
        if (path === "/admin/dashboard") {
            return location.pathname === path
        }
        return location.pathname.startsWith(path)
    }

    const currentMenu = menuItems.find((item) => isActive(item.path))
    const sectionLabel = currentMenu?.label || "Dashboard"

    return (
        <ChatProvider>
            <div className="min-h-screen bg-slate-900 text-slate-100 flex">
                {/* Sidebar */}
                <aside
                    className={`${
                        sidebarOpen ? "w-64" : "w-20"
                    } sticky top-0 h-screen bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col`}
                >
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                        <Link
                            to="/admin/dashboard"
                            className={`font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ${
                                !sidebarOpen && "hidden"
                            }`}
                        >
                            Admin Panel
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            {sidebarOpen ? "←" : "→"}
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    isActive(item.path)
                                        ? "bg-gradient-to-r from-cyan-400/20 to-blue-400/20 border border-cyan-400/30 text-cyan-300"
                                        : "hover:bg-slate-700/50 text-slate-300"
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {sidebarOpen && (
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-700">
                        <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 ${
                                !sidebarOpen && "justify-center"
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold">
                                {user?.username?.charAt(0).toUpperCase() || "A"}
                            </div>
                            {sidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-200 truncate">
                                        {user?.username || "Admin"}
                                    </p>
                                    <p className="text-xs text-cyan-400 capitalize">
                                        {user?.role || "admin"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-3 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-colors"
                        >
                            {sidebarOpen ? "Keluar" : "🚪"}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="relative flex-1 overflow-hidden">
                    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-900/95 px-6 py-4 backdrop-blur md:px-8">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-500">
                                    Panel Admin
                                </p>
                                <h1 className="text-xl font-semibold text-slate-100 md:text-2xl">
                                    {sectionLabel}
                                </h1>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="hidden md:inline">
                                    {user?.username || "Admin"}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg border border-slate-600/60 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400/50 hover:text-red-200"
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="h-full overflow-y-auto px-4 py-6 md:px-8">
                        <div className="min-h-[calc(100vh-6rem)] pb-20">
                            {children}
                        </div>
                    </div>
                    {user && token ? <ChatWidget /> : null}
                </main>
            </div>
        </ChatProvider>
    )
}
