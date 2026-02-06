import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/superAdmin.css";

import CreateAdmin from "./CreateAdmin";
import AdminList from "./AdminList";
import { getAllAdmins } from "../../api/superAdminApi";
import { useNotify } from "../../context/NotificationContext";

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const { notify } = useNotify(); // ✅ ADD THIS

    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        disabled: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const admins = await getAllAdmins();

            const total = admins.length;
            const active = admins.filter((a) => a.active).length;
            const disabled = admins.filter((a) => !a.active).length;

            setStats({ total, active, disabled });

            // ✅ optional success notify (comment if noisy)
            // notify("success", "Admin stats updated");
        } catch (err) {
            console.error("❌ Failed to load admin stats", err);
            notify("error", "Failed to load admin stats"); // ✅ HERE
        }
    };

    return (
        <div className="super-admin-container">
            {/* 🧠 HEADER */}
            <div className="super-admin-header">
                <div className="header-left">
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    <div>
                        <h2>👑 Super Admin Panel</h2>
                        <p className="subtitle">
                            Full control over admins, security & access
                        </p>
                    </div>
                </div>

                <span className="role-badge super">SUPER ADMIN</span>
            </div>

            {/* 📊 STATS */}
            <div className="super-admin-stats">
                <div className="stat-card">
                    <h4>Total Admins</h4>
                    <div className="stat-value">{stats.total}</div>
                </div>

                <div className="stat-card">
                    <h4>Active Admins</h4>
                    <div className="stat-value">{stats.active}</div>
                </div>

                <div className="stat-card danger">
                    <h4>Disabled Admins</h4>
                    <div className="stat-value">{stats.disabled}</div>
                </div>
            </div>

            {/* ➕ CREATE ADMIN */}
            <section className="super-admin-section">
                {/* ✅ pass refresh hook so child can notify + reload */}
                <CreateAdmin onSuccess={loadStats} />
            </section>

            {/* 📋 ADMIN LIST */}
            <section className="super-admin-section">
                {/* ✅ same here */}
                <AdminList onChange={loadStats} />
            </section>
        </div>
    );
};

export default SuperAdminDashboard;
