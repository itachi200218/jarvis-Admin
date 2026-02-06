import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAllCommands,
    getUserCommandRules,
    toggleUserCommand,
} from "../api/adminApi";
import { useNotify } from "../context/NotificationContext";
import "../styles/secureCommands.css";

export default function AdminSecureCommands() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { notify } = useNotify();

    /* 👤 USER INFO (PERSISTENT + SAFE) */
    const storedUser = sessionStorage.getItem("secureUser");
    let parsedUser = null;

    try {
        parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        parsedUser = null;
    }

    // ✅ ensure stored user matches route user
    const userName =
        parsedUser?.id === userId ? parsedUser.name : "Unknown User";

    const userEmail =
        parsedUser?.id === userId ? parsedUser.email : null;

    const [commands, setCommands] = useState([]);
    const [loading, setLoading] = useState(true);

    /* 🔹 LOAD COMMANDS + USER RULES */
    useEffect(() => {
        async function load() {
            try {
                const [allCommands, userRules] = await Promise.all([
                    getAllCommands(),
                    getUserCommandRules(userId),
                ]);

                const disabledIntents =
                    userRules?.disabledIntents || [];

                const merged = allCommands.map((cmd) => ({
                    ...cmd,
                    disabled: disabledIntents.includes(cmd.intent),
                }));

                setCommands(merged);
            } catch (err) {
                console.error(err);
                notify("error", "Failed to load commands");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [userId, notify]);

    /* 🔁 TOGGLE HANDLER */
    const handleToggle = async (intent, disabled) => {
        try {
            await toggleUserCommand(userId, intent, !disabled);

            setCommands((prev) =>
                prev.map((c) =>
                    c.intent === intent
                        ? { ...c, disabled: !disabled }
                        : c
                )
            );

            notify(
                "success",
                `${intent} ${disabled ? "enabled" : "disabled"}`
            );
        } catch (err) {
            console.error(err);
            notify("error", "Failed to update command");
        }
    };

    return (
        <div className="secure-page">
            <div className="secure-header">
                <div>
                    <h2>🔐 Secure Mode – User Commands</h2>

                    {/* 👤 USER CONTEXT */}
                    <p className="secure-user-info">
                        👤 <strong>{userName}</strong>
                        {userEmail && (
                            <span className="secure-user-email">
                                {" "}({userEmail})
                            </span>
                        )}
                    </p>
                </div>

                <button
                    className="secure-back-btn"
                    onClick={() => navigate("/admin-users")}
                >
                    <span>←</span> Back
                </button>
            </div>

            {loading ? (
                <p>Loading commands...</p>
            ) : (
                <table className="secure-table">
                    <thead>
                    <tr>
                        <th>Command</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {commands.map((cmd) => (
                        <tr key={cmd.intent}>
                            <td>{cmd.intent}</td>
                            <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={!cmd.disabled}
                                        onChange={() =>
                                            handleToggle(
                                                cmd.intent,
                                                cmd.disabled
                                            )
                                        }
                                    />
                                    <span className="slider" />
                                </label>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
