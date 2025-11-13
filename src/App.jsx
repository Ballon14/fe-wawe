import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./layouts/AdminLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Destinasi from "./pages/Destinasi"
import DetailDestinasi from "./pages/DetailDestinasi"
import OpenTrip from "./pages/OpenTrip"
import DetailOpenTrip from "./pages/DetailOpenTrip"
import PrivateTrip from "./pages/PrivateTrip"
import OpenTripRegister from "./pages/OpenTripRegister"
import OpenTripPayment from "./pages/OpenTripPayment"
import Guide from "./pages/Guide"
import DetailGuide from "./pages/DetailGuide"
import Galeri from "./pages/Galeri"
import TentangKami from "./pages/TentangKami"
import Kontak from "./pages/Kontak"
import Profile from "./pages/Profile"
import MyPrivateTrips from "./pages/MyPrivateTrips"
import MyTrip from "./pages/MyTrip"
import Dashboard from "./pages/admin/Dashboard"
import ManageDestinasi from "./pages/admin/ManageDestinasi"
import DestinasiForm from "./pages/admin/DestinasiForm"
import ManageGuides from "./pages/admin/ManageGuides"
import GuideForm from "./pages/admin/GuideForm"
import ManageOpenTrips from "./pages/admin/ManageOpenTrips"
import OpenTripForm from "./pages/admin/OpenTripForm"
import ManagePrivateTrips from "./pages/admin/ManagePrivateTrips"
import ManageOpenTripRegistrations from "./pages/admin/ManageOpenTripRegistrations"
import ChatWidget from "./components/ChatWidget"

function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ChatWidget />
        </div>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PublicLayout>
                            <Home />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicLayout>
                            <Login />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicLayout>
                            <Register />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/destinasi"
                    element={
                        <PublicLayout>
                            <Destinasi />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/destinasi/:id"
                    element={
                        <PublicLayout>
                            <DetailDestinasi />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/open-trip"
                    element={
                        <PublicLayout>
                            <OpenTrip />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/open-trip/:id"
                    element={
                        <PublicLayout>
                            <DetailOpenTrip />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/open-trip/:id/daftar"
                    element={
                        <ProtectedRoute>
                            <PublicLayout>
                                <OpenTripRegister />
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/open-trip/:id/pembayaran"
                    element={
                        <ProtectedRoute>
                            <PublicLayout>
                                <OpenTripPayment />
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/private-trip"
                    element={
                        <PublicLayout>
                            <PrivateTrip />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/status-private-trip"
                    element={
                        <ProtectedRoute>
                            <PublicLayout>
                                <MyPrivateTrips />
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-trip"
                    element={
                        <ProtectedRoute>
                            <PublicLayout>
                                <MyTrip />
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/guide"
                    element={
                        <PublicLayout>
                            <Guide />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/guide/:id"
                    element={
                        <PublicLayout>
                            <DetailGuide />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/galeri"
                    element={
                        <PublicLayout>
                            <Galeri />
                        </PublicLayout>
                    }
                />
                
                <Route
                    path="/tentang-kami"
                    element={
                        <PublicLayout>
                            <TentangKami />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/kontak"
                    element={
                        <PublicLayout>
                            <Kontak />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <PublicLayout>
                                <Profile />
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <Navigate to="/admin/dashboard" replace />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <Dashboard />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/destinasi"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <ManageDestinasi />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/destinasi/tambah"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <DestinasiForm />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/destinasi/edit/:id"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <DestinasiForm />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/guides"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <ManageGuides />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/guides/tambah"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <GuideForm />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/guides/edit/:id"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <GuideForm />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/open-trips"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <ManageOpenTrips />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/open-trips/registrations"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <ManageOpenTripRegistrations />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/private-trips"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <ManagePrivateTrips />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/open-trips/tambah"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <OpenTripForm />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/open-trips/edit/:id"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout>
                                <OpenTripForm />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                
            </Routes>
        </AuthProvider>
    )
}
