import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllTickets,
    replyToTicket,
    closeTicket,
    reopenTicket, // ✅ ADD THIS in supportApi.js
} from "../api/supportApi";
import "../styles/supportTickets.css";

export default function SupportTickets() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 🔍 Search & Filter
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | open | closed

    const loadTickets = async () => {
        try {
            const res = await getAllTickets();
            const data = res?.data || [];
            setTickets(data);

            if (!selectedTicket && data.length > 0) {
                setSelectedTicket(data[0]);
            }
        } catch (err) {
            console.error("Support tickets error:", err);
            setError("Failed to load support tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    // ⌨️ Keyboard shortcuts
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setReplyText("");
            return;
        }

        if (
            (e.key === "Enter" && !e.shiftKey) ||
            (e.key === "Enter" && e.ctrlKey)
        ) {
            e.preventDefault();
            sendReply();
        }
    };

    const sendReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;
        try {
            await replyToTicket(
                selectedTicket.id || selectedTicket._id,
                replyText
            );
            setReplyText("");
            loadTickets();
        } catch (err) {
            console.error("Reply failed", err);
        }
    };

    const close = async () => {
        if (!selectedTicket) return;
        try {
            await closeTicket(selectedTicket.id || selectedTicket._id);
            loadTickets();
        } catch (err) {
            console.error("Close failed", err);
        }
    };

    const reopen = async () => {
        if (!selectedTicket) return;
        try {
            await reopenTicket(selectedTicket.id || selectedTicket._id);
            loadTickets();
        } catch (err) {
            console.error("Reopen failed", err);
        }
    };

    if (loading) {
        return <p style={{ color: "white", padding: 20 }}>Loading tickets…</p>;
    }

    if (error) {
        return <p style={{ color: "red", padding: 20 }}>{error}</p>;
    }

    // 🔍 Apply search + filter
    const filteredTickets = tickets.filter((t) => {
        const id = t.id || t._id;
        const textMatch =
            t.username.toLowerCase().includes(search.toLowerCase()) ||
            id.includes(search) ||
            t.messages.some((m) =>
                m.text.toLowerCase().includes(search.toLowerCase())
            );

        const statusMatch =
            filter === "all" ||
            t.status.toLowerCase() === filter;

        return textMatch && statusMatch;
    });

    const activeTickets = filteredTickets.filter(
        (t) => t.status.toLowerCase() === "open"
    );

    const closedTickets = filteredTickets.filter(
        (t) => t.status.toLowerCase() === "closed"
    );

    return (
        <div className="support-layout">
            {/* LEFT SIDEBAR */}
            <div className="ticket-sidebar">
                <div className="sidebar-header">
                    <h3>🎫 Tickets</h3>
                    <button className="back-btn" onClick={() => navigate("/dashboard")}>
                        ← Back
                    </button>
                </div>

                {/* 🔍 SEARCH & FILTER */}
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="ticket-section">
                    <h4>🟢 Active</h4>
                    {activeTickets.map((t) => {
                        const id = t.id || t._id;
                        return (
                            <div
                                key={id}
                                className={`ticket-item ${
                                    selectedTicket?._id === id ? "active" : ""
                                }`}
                                onClick={() => setSelectedTicket(t)}
                            >
                                <div>#{id.slice(-6)}</div>
                                <small>
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        );
                    })}
                </div>

                <div className="ticket-section">
                    <h4>✅ Closed</h4>
                    {closedTickets.map((t) => {
                        const id = t.id || t._id;
                        return (
                            <div
                                key={id}
                                className={`ticket-item ${
                                    selectedTicket?._id === id ? "active" : ""
                                }`}
                                onClick={() => setSelectedTicket(t)}
                            >
                                <div>#{id.slice(-6)}</div>
                                <small>
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT DETAILS PANEL */}
            <div className="ticket-details">
                {selectedTicket ? (
                    <>
                        <div className="details-header">
                            <h3>
                                Ticket #
                                {(selectedTicket.id || selectedTicket._id).slice(-6)}
                            </h3>
                            <span className={`status ${selectedTicket.status}`}>
                                {selectedTicket.status}
                            </span>
                        </div>

                        <p className="ticket-user">
                            <b>User:</b> {selectedTicket.username}
                        </p>

                        <div className="messages">
                            {selectedTicket.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.sender}`}
                                >
                                    <b>{msg.sender === "user" ? "User" : "Admin"}:</b>{" "}
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* ACTIONS */}
                        {selectedTicket.status.toLowerCase() === "open" && (
                            <div className="actions">
                                <textarea
                                    placeholder="Type reply..."
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                />
                                <button className="reply-btn" onClick={sendReply}>
                                    Send Reply
                                </button>
                                <button className="close-btn" onClick={close}>
                                    Close Ticket
                                </button>
                            </div>
                        )}

                        {selectedTicket.status.toLowerCase() === "closed" && (
                            <div className="actions">
                                <button className="reply-btn" onClick={reopen}>
                                    Re-open Ticket
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Select a ticket to view details</p>
                )}
            </div>
        </div>
    );
}
