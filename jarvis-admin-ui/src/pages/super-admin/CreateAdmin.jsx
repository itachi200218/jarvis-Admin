import { useState } from "react";
import { createAdmin } from "../../api/superAdminApi";
import "../../styles/superAdmin.css";

const CreateAdmin = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        setMessage("");

        // 🔐 Basic validation
        if (!form.username || !form.email || !form.password) {
            setMessage("❌ All fields are required");
            return;
        }

        setLoading(true);

        try {
            await createAdmin(form);

            setMessage("✅ Admin created successfully");

            // reset form
            setForm({
                username: "",
                email: "",
                password: "",
            });

        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to create admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-admin-card">
            <h3>➕ Create Admin</h3>

            <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />

            {message && (
                <p style={{
                    marginBottom: "10px",
                    color: message.startsWith("✅") ? "#2ecc71" : "#ff5c5c"
                }}>
                    {message}
                </p>
            )}

            <button onClick={submit} disabled={loading}>
                {loading ? "Creating..." : "Create Admin"}
            </button>
        </div>
    );
};

export default CreateAdmin;
