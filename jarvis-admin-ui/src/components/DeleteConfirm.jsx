import "../styles/deleteConfirm.css";

export default function DeleteConfirm({
    user,
    onCancel,
    onConfirm,
}) {
    if (!user) return null;

    return (
        <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
                <h3>⚠️ Delete User</h3>

                <p>
                    Are you sure you want to delete
                    <strong> {user.name}</strong>?
                </p>

                <p className="warn-text">
                    This action cannot be undone.
                </p>

                <div className="delete-confirm-actions">
                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="confirm-btn"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
