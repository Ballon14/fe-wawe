import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)

    function handleLogout() {
        logout()
        navigate("/")
        setMobileMenuOpen(false)
    }

    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    function closeMobileMenu() {
        setMobileMenuOpen(false)
        setActiveDropdown(null)
    }

    function toggleDropdown(dropdown) {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
    }

    // Desktop navigation with dropdown
    const tripLinks = [
        { href: "/open-trip", label: "Open Trip" },
        { href: "/private-trip", label: "Private Trip" },
    ]

    const desktopLinks = [
        { href: "/", label: "Beranda" },
        { href: "/destinasi", label: "Destinasi" },
        { href: "/guide", label: "Guide" },
        { href: "/tentang-kami", label: "Tentang" },
        { href: "/kontak", label: "Kontak" },
    ]

    // Mobile navigation (all links)
    const mobileLinks = [
        { href: "/", label: "Beranda" },
        { href: "/destinasi", label: "Gunung / Destinasi" },
        { href: "/open-trip", label: "Open Trip" },
        { href: "/private-trip", label: "Private Trip" },
        { href: "/guide", label: "Pemandu / Guide" },
        { href: "/tentang-kami", label: "Tentang Kami" },
        { href: "/kontak", label: "Kontak / Bantuan" },
    ]

    function isActive(href) {
        return location.pathname === href
    }

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-400/10 shadow-lg shadow-slate-900/20">
            <div className="mx-auto w-full max-w-[95%] flex items-center justify-between py-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 no-underline text-inherit group transition-transform duration-300 hover:scale-105"
                    onClick={closeMobileMenu}
                >
                    <span className="w-7 h-7 rounded-lg shadow-[0_0_0_4px_rgba(34,211,238,0.08)] bg-gradient-to-br from-cyan-400 to-cyan-700 inline-block group-hover:shadow-[0_0_0_4px_rgba(34,211,238,0.15)] transition-all duration-300" />
                    <span className="font-bold tracking-wide text-lg">
                        Kawan Hiking
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                    {desktopLinks.slice(0, 4).map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                                isActive(link.href)
                                    ? "text-cyan-400 bg-slate-800/50"
                                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30"
                            }`}
                        >
                            {link.label}
                            <span
                                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${
                                    isActive(link.href)
                                        ? "w-3/4"
                                        : "w-0 group-hover:w-3/4"
                                }`}
                            />
                        </Link>
                    ))}

                    {/* Trip Dropdown */}
                    <div className="relative">
                        <button
                            className="relative px-4 py-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 transition-all duration-300 group flex items-center gap-1"
                            onClick={() => toggleDropdown("trip")}
                        >
                            Trip
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${
                                    activeDropdown === "trip"
                                        ? "rotate-180"
                                        : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 w-0 group-hover:w-3/4 transition-all duration-300" />
                        </button>

                        {activeDropdown === "trip" && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
                                {tripLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`block px-4 py-3 text-sm transition-colors duration-300 ${
                                            isActive(link.href)
                                                ? "text-cyan-400 bg-slate-700/50"
                                                : "text-slate-300 hover:text-cyan-400 hover:bg-slate-700/30"
                                        }`}
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {desktopLinks.slice(4).map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                                isActive(link.href)
                                    ? "text-cyan-400 bg-slate-800/50"
                                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30"
                            }`}
                        >
                            {link.label}
                            <span
                                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${
                                    isActive(link.href)
                                        ? "w-3/4"
                                        : "w-0 group-hover:w-3/4"
                                }`}
                            />
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                                    {user.name
                                        ? user.name.charAt(0).toUpperCase()
                                        : user.username
                                        ? user.username.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                                <span className="text-sm text-slate-300 font-medium">
                                    {user.name || user.username || user.email}
                                </span>
                            </Link>
                            <button
                                className="relative overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-5 py-2.5 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_20px_rgba(34,211,238,0.45)] transition-all duration-300 group"
                                onClick={handleLogout}
                            >
                                <span className="relative z-10">Keluar</span>
                                <span className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="rounded-xl border border-cyan-400/70 bg-transparent px-5 py-2.5 font-bold text-slate-100 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300">
                                    Masuk
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="relative overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-5 py-2.5 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_20px_rgba(34,211,238,0.45)] transition-all duration-300 group">
                                    <span className="relative z-10">
                                        Daftar
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {mobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? "max-h-[800px]" : "max-h-0"
                }`}
            >
                <nav className="px-6 pb-6 pt-2 space-y-1 border-t border-slate-400/10">
                    {mobileLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`block py-3 px-4 rounded-lg transition-all duration-300 font-medium ${
                                isActive(link.href)
                                    ? "text-cyan-400 bg-slate-800/50 border border-cyan-400/20"
                                    : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50"
                            }`}
                            onClick={closeMobileMenu}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user ? (
                        <div className="space-y-3 pt-2">
                            <Link
                                to={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold">
                                    {user.name
                                        ? user.name.charAt(0).toUpperCase()
                                        : user.username
                                        ? user.username.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-200">
                                        {user.name ||
                                            user.username ||
                                            user.email}
                                    </div>
                                    {user.role && (
                                        <div className="text-xs text-cyan-400 capitalize">
                                            {user.role}
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <button
                                className="w-full rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-5 py-3 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_20px_rgba(34,211,238,0.45)] transition-all duration-300"
                                onClick={handleLogout}
                            >
                                Keluar
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link to="/login" onClick={closeMobileMenu}>
                                <button className="w-full rounded-xl border border-cyan-400/70 bg-transparent px-5 py-3 font-bold text-slate-100 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300">
                                    Masuk
                                </button>
                            </Link>
                            <Link to="/register" onClick={closeMobileMenu}>
                                <button className="w-full rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-400 px-5 py-2.5 font-bold text-slate-900 shadow-[0_6px_16px_rgba(34,211,238,0.35)] hover:shadow-[0_8px_20px_rgba(34,211,238,0.45)] transition-all duration-300">
                                    Daftar
                                </button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveDropdown(null)}
                />
            )}
        </header>
    )
}
