import "../../styles/superAdmin.css";
import CreateAdmin from "./CreateAdmin";
import AdminList from "./AdminList";

const SuperAdminDashboard = () => {
    return (
        <div className="super-admin-container">

            {/* 🧠 HEADER */}
            <div className="super-admin-header">
                <h2>👑 Super Admin Panel</h2>
                <p className="subtitle">
                    Manage admins, permissions & system access
                </p>
            </div>

            {/* ➕ CREATE ADMIN */}
            <section className="super-admin-section">
                <CreateAdmin />
            </section>

            {/* 📋 ADMIN LIST */}
            <section className="super-admin-section">
                <AdminList />
            </section>

        </div>
    );
};

export default SuperAdminDashboard;
