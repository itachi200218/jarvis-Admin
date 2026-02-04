import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserCount,
    getTodayUserCount
} from "../api/adminApi";
import ProfileModal from "../components/ProfileModal";
import "../styles/dashboard.css";

/* 🔓 Decode JWT */
function decodeJWT(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [totalUsers, setTotalUsers] = useState(0);
    const [todayUsers, setTodayUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    const [darkMode, setDarkMode] = useState(true);

    // ✅ NEW STATES (ONLY ADDITION)
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const token = localStorage.getItem("token");
    const user = token ? decodeJWT(token) : null;

    /* 🔐 AUTH + REAL-TIME DATA */
    useEffect(() => {
        if (!token || !user) {
            navigate("/login");
            return;
        }

        const fetchStats = async () => {
            try {
                const [total, today] = await Promise.all([
                    getUserCount(),
                    getTodayUserCount()
                ]);

                setTotalUsers(total);
                setTodayUsers(today);
                setLoading(false);
            } catch {
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, [navigate, token, user]);

    // ✅ LOGOUT HANDLER (ONLY ADDITION)
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // ✅ CLOSE PROFILE MENU ON OUTSIDE CLICK
    useEffect(() => {
        const closeMenu = () => setShowProfileMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    const maxValue = Math.max(totalUsers, todayUsers, 1);
    const growth =
        totalUsers > 0
            ? ((todayUsers / totalUsers) * 100).toFixed(1)
            : 0;

    return (
        <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>

            {/* 👤 TOP BAR */}
            <div className="dashboard-topbar">
                <button
                    className="support-btn"
                    onClick={() => navigate("/admin-support")}
                >
                    🎧 Support
                </button>

                <div
                    className="profile"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileMenu(prev => !prev);
                    }}
                >
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.sub}&background=0D8ABC&color=fff`}
                        alt="Admin"
                    />
                    <div className="profile-info">
                        <div className="profile-name">{user?.sub}</div>
                        <div className="profile-role">{user?.role}</div>
                    </div>
                </div>

                {/* ✅ PROFILE MENU */}
                {showProfileMenu && (
                    <div className="profile-menu">
                        <button
                            onClick={() => {
                                setShowProfileModal(true);
                                setShowProfileMenu(false);
                            }}
                        >
                            ✏️ Edit Profile
                        </button>

                        <button
                            className="danger"
                            onClick={handleLogout}
                        >
                            🚪 Logout
                        </button>
                    </div>
                )}

                <button
                    className="theme-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? "🌙 Dark" : "☀️ Light"}
                </button>
            </div>

            {/* 🧊 DASHBOARD CARD */}
            <div className="dashboard-card ai-fade">

                {/* 🧠 HEADER */}
                <div className="dashboard-header">
                    <div>
                        <h2>Admin Dashboard</h2>
                        <p className="subtitle">
                            Real-time user analytics & system overview
                        </p>
                    </div>
                    <div className="status-pill online">● Live</div>
                </div>

                {/* 📊 KPI CARDS */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Total Users</h4>
                        <span>{loading ? "…" : totalUsers}</span>
                        <small>All time</small>
                    </div>

                    <div className="stat-card highlight">
                        <h4>Users Today</h4>
                        <span>+{loading ? "…" : todayUsers}</span>
                        <small>{growth}% of total</small>
                    </div>
                </div>

                {/* 🧠 INSIGHTS */}
                <div className="insights-row">
                    <div className="insight positive">
                        ↑ Growth stable today
                    </div>
                    <div className="insight neutral">
                        Peak activity: Evening
                    </div>
                </div>

                <div className="section-divider" />

                {/* 📈 ANALYTICS */}
                <div className="chart-header">
                    <h3>User Activity</h3>
                    <span className="chart-sub">Today vs Total</span>
                </div>

                {/* 📊 BAR CHART */}
                <div className="adv-chart">
                    <div className="adv-bars">

                        <div className="adv-bar-wrapper">
                            <div
                                className="adv-bar today"
                                style={{ height: `${(todayUsers / maxValue) * 100}%` }}
                            />
                            <div className="bar-tooltip">
                                Today Users: {todayUsers}
                            </div>
                        </div>

                        <div className="adv-bar-wrapper">
                            <div
                                className="adv-bar total"
                                style={{ height: `${(totalUsers / maxValue) * 100}%` }}
                            />
                            <div className="bar-tooltip">
                                Total Users: {totalUsers}
                            </div>
                        </div>

                    </div>

                    <div className="adv-legend">
                        <span><i className="dot today"></i> Today</span>
                        <span><i className="dot total"></i> Total</span>
                    </div>
                </div>

                <div className="section-divider" />

                {/* ⚙️ ACTIONS */}
                <div className="action-row">
                    <button
                        className="primary-btn"
                        onClick={() => navigate("/admin-users")}
                    >
                        View All Users
                    </button>
                    <button className="secondary-btn">
                        Export Report
                    </button>
                </div>

            </div>

            {/* 👤 PROFILE MODAL */}
            {showProfileModal && (
                <ProfileModal
                    user={user}
                    onClose={() => setShowProfileModal(false)}
                />
            )}
        </div>
    );
}
