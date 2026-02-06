import { useEffect, useState } from "react";
import {
    getAllAdmins,
    deleteAdmin,
    updateAdmin,
    resetAdminPassword,
} from "../../api/superAdminApi";
import "../../styles/superAdmin.css";
import { useNotify } from "../../context/NotificationContext";

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { notify } = useNotify();

    // context menu
    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        admin: null,
    });

    // update modal
    const [editAdmin, setEditAdmin] = useState(null);

    // delete confirmation modal
    const [confirmDelete, setConfirmDelete] = useState(null);

    // 🔑 reset password modal
    const [resetTarget, setResetTarget] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        fetchAdmins();

        const closeMenu = () =>
            setMenu({ visible: false, x: 0, y: 0, admin: null });

        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    const fetchAdmins = async () => {
        try {
            const data = await getAllAdmins();
            setAdmins(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load admins");
            notify("error", "Failed to load admins"); // ✅ ADDED
        } finally {
            setLoading(false);
        }
    };

    // 🖱️ right click
    const handleRightClick = (e, admin) => {
        e.preventDefault();

        // 🔒 protect SUPER_ADMIN
        if (admin.role === "SUPER_ADMIN") return;

        setMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            admin,
        });
    };

    // ✏️ open update modal
    const handleUpdate = () => {
        setEditAdmin(menu.admin);
        setMenu({ visible: false, x: 0, y: 0, admin: null });
    };

    // 🔑 open reset password modal
    const handleResetPassword = () => {
        setResetTarget(menu.admin);
        setNewPassword("");
        setMenu({ visible: false, x: 0, y: 0, admin: null });
    };

    // 🔑 confirm reset password
    const handleConfirmResetPassword = async () => {
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            notify("error", "Password must be at least 6 characters"); // ✅ ADDED
            return;
        }

        try {
            await resetAdminPassword(resetTarget.id, newPassword);
            notify("success", "Password reset successfully"); // ✅ ADDED
            setResetTarget(null);
            setNewPassword("");
        } catch (err) {
            alert("Failed to reset password");
            notify("error", "Failed to reset password"); // ✅ ADDED
        }
    };

    // ❌ open delete confirmation
    const handleDelete = () => {
        setConfirmDelete(menu.admin);
        setMenu({ visible: false, x: 0, y: 0, admin: null });
    };

    // ❌ confirm delete
    const confirmDeleteAdmin = async () => {
        try {
            await deleteAdmin(confirmDelete.id);
            setAdmins((prev) =>
                prev.filter((a) => a.id !== confirmDelete.id)
            );
            notify("success", "Admin deleted successfully"); // ✅ ADDED
            setConfirmDelete(null);
        } catch (err) {
            alert("Failed to delete admin");
            notify("error", "Failed to delete admin"); // ✅ ADDED
        }
    };

    // 💾 save update
    const handleSaveUpdate = async () => {
        try {
            await updateAdmin(editAdmin.id, {
                username: editAdmin.username,
                email: editAdmin.email,
            });
            notify("success", "Admin updated successfully"); // ✅ ADDED
            setEditAdmin(null);
            fetchAdmins();
        } catch (err) {
            alert("Failed to update admin");
            notify("error", "Failed to update admin"); // ✅ ADDED
        }
    };

    return (
        <div className="admin-list-card">
            <h3 className="section-title">👥 Admin Accounts</h3>

            {loading && <div className="table-state">Loading admins…</div>}
            {error && <div className="table-state error">{error}</div>}

            {!loading && !error && admins.length === 0 && (
                <div className="table-state">No admins found</div>
            )}

            {!loading && !error && admins.length > 0 && (
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {admins.map((a) => (
                        <tr
                            key={a.id}
                            onContextMenu={(e) =>
                                handleRightClick(e, a)
                            }
                            className="admin-row"
                        >
                            <td>{a.username}</td>
                            <td>{a.email}</td>
                            <td>
                                    <span
                                        className={`role-pill ${a.role}`}
                                    >
                                        {a.role}
                                    </span>
                            </td>
                            <td>
                                    <span
                                        className={`status-pill ${
                                            a.active
                                                ? "active"
                                                : "disabled"
                                        }`}
                                    >
                                        {a.active ? "Active" : "Disabled"}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* 🖱️ CONTEXT MENU */}
            {menu.visible && (
                <div
                    className="context-menu"
                    style={{ top: menu.y, left: menu.x }}
                >
                    <div className="context-item" onClick={handleUpdate}>
                        ✏️ Update Info
                    </div>
                    <div
                        className="context-item"
                        onClick={handleResetPassword}
                    >
                        🔑 Reset Password
                    </div>
                    <div
                        className="context-item danger"
                        onClick={handleDelete}
                    >
                        ❌ Delete Admin
                    </div>
                </div>
            )}

            {/* ✏️ UPDATE MODAL */}
            {editAdmin && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>✏️ Update Admin</h3>

                        <input
                            value={editAdmin.username}
                            onChange={(e) =>
                                setEditAdmin({
                                    ...editAdmin,
                                    username: e.target.value,
                                })
                            }
                            placeholder="Username"
                        />

                        <input
                            value={editAdmin.email}
                            onChange={(e) =>
                                setEditAdmin({
                                    ...editAdmin,
                                    email: e.target.value,
                                })
                            }
                            placeholder="Email"
                        />

                        <div className="modal-actions">
                            <button onClick={() => setEditAdmin(null)}>
                                Cancel
                            </button>
                            <button
                                className="primary"
                                onClick={handleSaveUpdate}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ❌ DELETE CONFIRM MODAL */}
            {confirmDelete && (
                <div className="modal-backdrop">
                    <div className="modal danger">
                        <h3>❌ Delete Admin</h3>
                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{confirmDelete.username}</strong>?
                        </p>

                        <div className="modal-actions">
                            <button
                                onClick={() =>
                                    setConfirmDelete(null)
                                }
                            >
                                Cancel
                            </button>
                            <button
                                className="danger-btn"
                                onClick={confirmDeleteAdmin}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔑 RESET PASSWORD MODAL */}
            {resetTarget && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>🔑 Reset Password</h3>

                        <p>
                            Reset password for{" "}
                            <strong>{resetTarget.username}</strong>
                        </p>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="New Password"
                        />

                        <div className="modal-actions">
                            <button
                                onClick={() => setResetTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="primary"
                                onClick={
                                    handleConfirmResetPassword
                                }
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminList;
