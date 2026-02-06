import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    updateUserName,
    updateUserEmail,
    resetUserPassword, // ✅ ADD THIS
} from "../api/adminApi";

import DeleteConfirm from "../components/DeleteConfirm";
import EditUserModal from "../components/EditUserModal";
import { useNotify } from "../context/NotificationContext";
import "../styles/adminUsers.css";

/* ------------------ helpers ------------------ */
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

/* ------------------ component ------------------ */
export default function AdminUsers() {
    const navigate = useNavigate();
    const { notify } = useNotify();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [secureFilter, setSecureFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("NAME");

    const [contextMenu, setContextMenu] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const [editModal, setEditModal] = useState(null);
    // { type: "name" | "email", user }

    /* -------- fetch users -------- */
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

    /* -------- auto refresh -------- */
    useEffect(() => {
        const interval = setInterval(() => {
            getAllUsers().then(setUsers).catch(() => {});
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    /* -------- close context menu -------- */
    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    /* -------- role update -------- */
    const handleRoleChange = async (userId, newRole) => {
        try {
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
            await updateUserRole(userId, newRole);
            notify("success", "Role updated");
        } catch {
            notify("error", "Failed to update role");
            getAllUsers().then(setUsers);
        }
    };

    /* -------- right click -------- */
    const handleRightClick = (e, user) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, user });
    };

    /* -------- context actions -------- */
    const handleEditName = (user) => {
        setEditModal({ type: "name", user });
        setContextMenu(null);
    };

    const handleEditEmail = (user) => {
        setEditModal({ type: "email", user });
        setContextMenu(null);
    };

    const handleResetPassword = async (user) => {
        try {
            notify("info", "Sending reset password email...");

            // ✅ THIS IS THE CORRECT ID
            await resetUserPassword(user.id);

            notify(
                "success",
                `Password reset email sent to ${user.email}`
            );
        } catch (err) {
            if (err.message === "UNAUTHORIZED") {
                notify("error", "Session expired. Please login again.");
                navigate("/login");
            } else {
                notify("error", "Failed to send reset password email");
            }
        } finally {
            setContextMenu(null);
        }
    };

    const handleDeleteClick = (user) => {
        setContextMenu(null);
        setUserToDelete(user);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            setUserToDelete(null);
            notify("success", "User deleted");
        } catch {
            notify("error", "Failed to delete user");
        }
    };

    /* -------- filtering -------- */
    const filteredUsers = useMemo(() => {
        let filtered = [...users];

        if (search.trim()) {
            filtered = filtered.filter(
                (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter !== "ALL")
            filtered = filtered.filter((u) => u.role === roleFilter);

        if (secureFilter !== "ALL")
            filtered = filtered.filter(
                (u) => u.secureMode === (secureFilter === "ON")
            );

        if (sortBy === "NAME")
            filtered.sort((a, b) => a.name.localeCompare(b.name));

        if (sortBy === "TIME")
            filtered.sort(
                (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );

        return filtered;
    }, [users, search, roleFilter, secureFilter, sortBy]);

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading users...</h2>;

    return (
        <div className="admin-users-container">
            {/* HEADER */}
            <div className="admin-users-header">
                <h2>Jarvis Users</h2>
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
            </div>

            {/* FILTER BAR */}
            <div className="users-filter-bar">
                <input
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

            {/* USERS TABLE */}
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
                {filteredUsers.map((user) => (
                    <tr
                        key={user.id}
                        onContextMenu={(e) => handleRightClick(e, user)}
                    >
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            <select
                                value={user.role}
                                onChange={(e) =>
                                    handleRoleChange(
                                        user.id,
                                        e.target.value
                                    )
                                }
                                className="role-dropdown"
                            >
                                <option value="user">User</option>
                                <option value="guest">Guest</option>
                            </select>
                        </td>
                        <td>{formatDateTime(user.createdAt)}</td>
                        <td>
                            {isUserReallyOnline(user)
                                ? "🟢 Online"
                                : `🔴 Offline (${getLastSeenText(
                                    user.lastSeenAt
                                )})`}
                        </td>
                        <td>
                            <button
                                className="secure-btn"
                                onClick={() =>
                                    navigate(
                                        `/admin/secure-commands/${user.id}`
                                    )
                                }
                            >
                                ⚙ Manage Commands
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* CONTEXT MENU */}
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button onClick={() => handleEditName(contextMenu.user)}>
                        ✏️ Edit Name
                    </button>
                    <button onClick={() => handleEditEmail(contextMenu.user)}>
                        ✉️ Edit Email
                    </button>
                    <button onClick={() => handleResetPassword(contextMenu.user)}>
                        🔐 Reset Password
                    </button>
                    <hr />
                    <button
                        className="danger"
                        onClick={() => handleDeleteClick(contextMenu.user)}
                    >
                        🗑 Delete User
                    </button>
                </div>
            )}

            {/* EDIT MODAL */}
            {editModal && (
                <EditUserModal
                    title={
                        editModal.type === "name"
                            ? "Edit Username"
                            : "Edit Email"
                    }
                    label={
                        editModal.type === "name"
                            ? "Username"
                            : "Email"
                    }
                    value={
                        editModal.type === "name"
                            ? editModal.user.name
                            : editModal.user.email
                    }
                    onClose={() => setEditModal(null)}
                    onSave={async (newValue) => {
                        try {
                            if (editModal.type === "name") {
                                await updateUserName(
                                    editModal.user.id,
                                    newValue
                                );
                            } else {
                                await updateUserEmail(
                                    editModal.user.id,
                                    newValue
                                );
                            }

                            setUsers((prev) =>
                                prev.map((u) =>
                                    u.id === editModal.user.id
                                        ? {
                                            ...u,
                                            ...(editModal.type === "name"
                                                ? { name: newValue }
                                                : { email: newValue }),
                                        }
                                        : u
                                )
                            );

                            notify(
                                "success",
                                `${
                                    editModal.type === "name"
                                        ? "Username"
                                        : "Email"
                                } updated successfully`
                            );
                            setEditModal(null);
                        } catch {
                            notify("error", "Update failed");
                        }
                    }}
                />
            )}

            {/* DELETE CONFIRM */}
            <DeleteConfirm
                user={userToDelete}
                onCancel={() => setUserToDelete(null)}
                onConfirm={() => handleDeleteUser(userToDelete.id)}
            />
        </div>
    );
}
