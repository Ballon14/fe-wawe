import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiGet, apiDelete } from "../../lib/api"

export default function ManageDestinasi() {
    const [destinations, setDestinations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteLoading, setDeleteLoading] = useState(null)

    useEffect(() => {
        fetchDestinations()
    }, [])

    async function fetchDestinations() {
        setLoading(true)
        setError("")
        try {
            const data = await apiGet("/api/destinations")
            let destList = []
            if (Array.isArray(data)) {
                destList = data
            } else if (data?.destinations) {
                destList = data.destinations
            } else if (data?.data) {
                destList = data.data
            }
            setDestinations(destList)
        } catch (e) {
            setError(`Gagal mengambil data: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id, index) {
        if (!confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) {
            return
        }

        setDeleteLoading(index)
        try {
            await apiDelete(`/api/destinations/${id}`)
            setDestinations(destinations.filter((d) => (d.id || d._id) !== id))
        } catch (e) {
            alert(`Gagal menghapus: ${e.message}`)
        } finally {
            setDeleteLoading(null)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">
                        Kelola Destinasi
                    </h1>
                    <p className="text-slate-400">
                        Tambah, edit, atau hapus destinasi gunung
                    </p>
                </div>
                <Link
                    to="/admin/destinasi/tambah"
                    className="px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold hover:shadow-[0_6px_16px_rgba(34,211,238,0.35)] transition-all duration-300"
                >
                    + Tambah Destinasi
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-400/50 bg-red-900/20 text-red-300 px-6 py-4">
                    {error}
                </div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-slate-700/50 bg-slate-800/50">
                    <p className="text-slate-400 mb-4">Belum ada destinasi</p>
                    <Link
                        to="/admin/destinasi/tambah"
                        className="inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-400 text-slate-900 font-bold"
                    >
                        Tambah Destinasi Pertama
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/50">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="text-left p-4 text-slate-300 font-semibold">
                                    Nama
                                </th>
                                <th className="text-left p-4 text-slate-300 font-semibold">
                                    Lokasi
                                </th>
                                <th className="text-left p-4 text-slate-300 font-semibold">
                                    Ketinggian
                                </th>
                                <th className="text-left p-4 text-slate-300 font-semibold">
                                    Kesulitan
                                </th>
                                <th className="text-right p-4 text-slate-300 font-semibold">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {destinations.map((dest, index) => (
                                <tr
                                    key={dest?.id || dest?._id || index}
                                    className="border-b border-slate-700/30 hover:bg-slate-800/70 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-100">
                                            {dest?.nama_destinasi ||
                                                dest?.nama_gunung ||
                                                dest?.nama ||
                                                dest?.name ||
                                                "Tanpa Nama"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300">
                                        {dest?.lokasi || dest?.location || "-"}
                                    </td>
                                    <td className="p-4 text-slate-300">
                                        {dest?.ketinggian ||
                                            dest?.elevation ||
                                            "-"}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 text-sm border border-cyan-400/20">
                                            {dest?.kesulitan ||
                                                dest?.level_kesulitan ||
                                                dest?.difficulty ||
                                                "-"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/destinasi/edit/${
                                                    dest?.id || dest?._id
                                                }`}
                                                className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        dest?.id || dest?._id,
                                                        index
                                                    )
                                                }
                                                disabled={
                                                    deleteLoading === index
                                                }
                                                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-colors disabled:opacity-50"
                                            >
                                                {deleteLoading === index
                                                    ? "..."
                                                    : "Hapus"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
