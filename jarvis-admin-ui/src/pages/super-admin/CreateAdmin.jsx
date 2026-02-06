import { useState } from "react";
import { createAdmin } from "../../api/superAdminApi";
import { useNotify } from "../../context/NotificationContext";
import "../../styles/superAdmin.css";

const CreateAdmin = () => {
    const { notify } = useNotify(); // ✅ ADD THIS

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.username.trim()) newErrors.username = "Username required";

        if (!form.email) {
            newErrors.email = "Email required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.password) {
            newErrors.password = "Password required";
        } else if (form.password.length < 8) {
            newErrors.password = "Min 8 characters required";
        }

        if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPasswordStrength = () => {
        const p = form.password;
        if (p.length < 6) return "Weak";
        if (/[A-Z]/.test(p) && /\d/.test(p) && /[@$!%*?&]/.test(p))
            return "Strong";
        return "Medium";
    };

    const submit = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            await createAdmin({
                username: form.username,
                email: form.email,
                password: form.password,
            });

            notify("success", "Admin created successfully ✅");

            setForm({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error(err);
            notify("error", "Failed to create admin ❌");
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
            {errors.username && <small className="error">{errors.username}</small>}

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}

            <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />
            {errors.password && <small className="error">{errors.password}</small>}

            {form.password && (
                <small className={`strength ${getPasswordStrength().toLowerCase()}`}>
                    Strength: {getPasswordStrength()}
                </small>
            )}

            <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
            />
            {errors.confirmPassword && (
                <small className="error">{errors.confirmPassword}</small>
            )}

            <div
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
            >
                <div className={`toggle-switch ${showPassword ? "on" : ""}`}>
                    <span className="toggle-knob" />
                </div>
                <span className="toggle-label">
                    {showPassword ? "Hide password" : "Show password"}
                </span>
            </div>

            <button onClick={submit} disabled={loading}>
                {loading ? "Creating..." : "Create Admin"}
            </button>
        </div>
    );
};

export default CreateAdmin;
