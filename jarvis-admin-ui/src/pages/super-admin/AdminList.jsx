import { useEffect, useState } from "react";
import { getAllAdmins } from "../../api/superAdminApi";
import "../../styles/superAdmin.css";

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await getAllAdmins();
                setAdmins(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load admins");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <div className="admin-list-card">
            <h3 className="section-title">👥 Admin Accounts</h3>

            {loading && (
                <div className="table-state">Loading admins…</div>
            )}

            {error && (
                <div className="table-state error">{error}</div>
            )}

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
                        <tr key={a.id}>
                            <td>{a.username}</td>
                            <td>{a.email}</td>
                            <td>
                                    <span className={`role-pill ${a.role}`}>
                                        {a.role}
                                    </span>
                            </td>
                            <td>
                                    <span
                                        className={`status-pill ${
                                            a.active ? "active" : "disabled"
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
        </div>
    );
};

export default AdminList;
