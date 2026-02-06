import { useState } from "react";
import { updateProfile } from "../api/userApi";
import { useNotify } from "../context/NotificationContext";
import "../styles/profileModal.css";

export default function ProfileModal({ user, onClose }) {
    const { notify } = useNotify(); // 🔔 ADD
    const [username, setUsername] = useState(user?.sub || "");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);

        try {
            await updateProfile({
                username,
                email,
                password,
            });

            // ✅ SUCCESS NOTIFY
            notify("success", "Profile updated successfully.");

            // close modal + refresh dashboard
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 600);

        } catch (err) {
            console.error(err);

            // ❌ ERROR NOTIFY
            notify(
                "error",
                err?.message || "Failed to update profile."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal ai-fade">
                <h2>Profile Settings</h2>

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="modal-actions">
                    <button
                        className="primary-btn"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        className="logout-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
