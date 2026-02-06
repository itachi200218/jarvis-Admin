import { useState } from "react";
import "../styles/editUserModal.css";

export default function EditUserModal({ title, label, value, onClose, onSave }) {
    const [input, setInput] = useState(value);

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h3>{title}</h3>

                <label>{label}</label>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <div className="modal-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn save"
                        onClick={() => onSave(input)}
                        disabled={!input.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
