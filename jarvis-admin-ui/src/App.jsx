import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AddUser from "./pages/AddUser";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSecureCommands from "./pages/AdminSecureCommands";
import SupportTickets from "./pages/SupportTickets"; // ✅ ADD THIS

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
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

                {/* 🎧 SUPPORT TICKETS (PROTECTED) */}
                <Route
                    path="/admin-support"
                    element={
                        <ProtectedRoute>
                            <SupportTickets />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
