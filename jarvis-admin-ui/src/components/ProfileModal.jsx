import { useState } from "react";
import { updateProfile } from "../api/userApi";
import "../styles/profileModal.css";

export default function ProfileModal({ user, onClose }) {
    const [username, setUsername] = useState(user?.sub || "");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setMessage("");
        setLoading(true);

        try {
            await updateProfile({
                username,
                email,
                password,
            });

            setMessage("✅ Profile updated successfully");

            // close modal + refresh dashboard data
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 600);

        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to update profile");
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

                {message && (
                    <p className={message.startsWith("✅") ? "success" : "error"}>
                        {message}
                    </p>
                )}

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
