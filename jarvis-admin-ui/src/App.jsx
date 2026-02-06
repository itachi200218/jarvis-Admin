import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AddUser from "./pages/AddUser";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminSecureCommands from "./pages/AdminSecureCommands";
import SupportTickets from "./pages/SupportTickets";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import SuperAdminRoute from "./auth/SuperAdminRoute";

// 🔔 Notification Provider
import { NotificationProvider } from "./context/NotificationContext";
// import ResetPassword from "./pages/ResetPassword";

// 🔔 Notification CSS (import once)
import "./styles/notifications.css";

function App() {
    return (
        <NotificationProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    {/*<Route path="/reset-password" element={<ResetPassword />} />*/}

                    {/* AUTH */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<AddUser />} />

                    {/* 🔐 PROTECTED ROUTES */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-users"
                        element={
                            <ProtectedRoute>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/secure-commands/:userId"
                        element={
                            <ProtectedRoute>
                                <AdminSecureCommands />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-support"
                        element={
                            <ProtectedRoute>
                                <SupportTickets />
                            </ProtectedRoute>
                        }
                    />

                    {/* 👑 SUPER ADMIN */}
                    <Route
                        path="/super-admin"
                        element={
                            <SuperAdminRoute>
                                <SuperAdminDashboard />
                            </SuperAdminRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </NotificationProvider>
    );
}

export default App;
