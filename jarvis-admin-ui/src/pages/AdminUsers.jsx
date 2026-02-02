import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../api/adminApi";
import "../styles/adminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllUsers()
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch users", err);

                // 🔐 JWT missing / expired / invalid
                if (
                    err.message === "UNAUTHORIZED" ||
                    err.message === "No JWT token found"
                ) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }

                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return <h2 style={{ textAlign: "center" }}>Loading users...</h2>;
    }

    return (
        <div className="admin-users-container">
            {/* 🔙 HEADER BAR */}
            <div className="admin-users-header">
                <h2>Jarvis Users</h2>

                <button
                    className="back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <table className="users-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Secure Mode</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                                <span className="role-badge">
                                    {user.role}
                                </span>
                        </td>
                        <td
                            className={
                                user.secureMode
                                    ? "secure-on"
                                    : "secure-off"
                            }
                        >
                            {user.secureMode ? "ON" : "OFF"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
