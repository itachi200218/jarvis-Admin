import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, updateUserRole, deleteUser } from "../api/adminApi";
import DeleteConfirm from "../components/DeleteConfirm";
import "../styles/adminUsers.css";

function formatDateTime(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function getLastSeenText(lastSeenAt) {
    if (!lastSeenAt) return "never";
    const diffMs = Date.now() - new Date(lastSeenAt).getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 2) return "just now";
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hrs ago`;
    return `${days} days ago`;
}

function isUserReallyOnline(user) {
    if (!user.online || !user.lastSeenAt) return false;
    const diffMs = Date.now() - new Date(user.lastSeenAt).getTime();
    return diffMs / 60000 <= 2;
}

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [secureFilter, setSecureFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("NAME");
    const [userToDelete, setUserToDelete] = useState(null);  // Add this state
    const navigate = useNavigate();

    useEffect(() => {
        getAllUsers()
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            getAllUsers().then(setUsers).catch(() => {});
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, role: newRole } : u
                )
            );
            await updateUserRole(userId, newRole);
        } catch (err) {
            alert("Failed to update role");
            getAllUsers().then(setUsers);
        }
    };

    const filteredUsers = useMemo(() => {
        let filtered = [...users];
        if (search.trim()) {
            filtered = filtered.filter(
                (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (roleFilter !== "ALL") filtered = filtered.filter((u) => u.role === roleFilter);
        if (secureFilter !== "ALL") filtered = filtered.filter((u) => u.secureMode === (secureFilter === "ON"));
        if (sortBy === "NAME") filtered.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "TIME") filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return filtered;
    }, [users, search, roleFilter, secureFilter, sortBy]);

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            setUserToDelete(null);  // Close modal
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    const handleRightClick = (e, user) => {
        e.preventDefault();  // Prevent default right-click menu
        setUserToDelete(user);  // Set user to be deleted
    };

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading users...</h2>;

    return (
        <div className="admin-users-container">
            <div className="admin-users-header">
                <h2>Jarvis Users</h2>
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
            </div>

            <div className="users-filter-bar">
                <input
                    type="text"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="ALL">All Roles</option>
                    <option value="user">User</option>
                    <option value="guest">Guest</option>
                </select>
                <select onChange={(e) => setSecureFilter(e.target.value)}>
                    <option value="ALL">All Secure Modes</option>
                    <option value="ON">Secure ON</option>
                    <option value="OFF">Secure OFF</option>
                </select>
                <select onChange={(e) => setSortBy(e.target.value)}>
                    <option value="NAME">Sort by Name</option>
                    <option value="TIME">Sort by Joined Time</option>
                </select>
            </div>

            <table className="users-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined On</th>
                    <th>Status</th>
                    <th>Secure Mode</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                            No users found
                        </td>
                    </tr>
                ) : (
                    filteredUsers.map((user) => (
                        <tr key={user.id} onContextMenu={(e) => handleRightClick(e, user)}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="role-dropdown"
                                >
                                    <option value="user">User</option>
                                    <option value="guest">Guest</option>
                                </select>
                            </td>
                            <td>{formatDateTime(user.createdAt)}</td>
                            <td>
                                {isUserReallyOnline(user) ? (
                                    <span className="status-online">🟢 Online</span>
                                ) : (
                                    <span className="status-offline">
                                            🔴 Offline (last seen {getLastSeenText(user.lastSeenAt)})
                                        </span>
                                )}
                            </td>
                            <td>
                                <button
                                    className="secure-btn"
                                    onClick={() => {
                                        sessionStorage.setItem("secureUser", JSON.stringify({ id: user.id, name: user.name, email: user.email }));
                                        navigate(`/admin/secure-commands/${user.id}`);
                                    }}
                                >
                                    ⚙ Manage Commands
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* Add Delete Confirmation Modal */}
            <DeleteConfirm
                user={userToDelete}
                onCancel={() => setUserToDelete(null)}  // Cancel action
                onConfirm={() => handleDeleteUser(userToDelete.id)}  // Confirm deletion
            />
        </div>
    );
}
