import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const notify = (type, message, duration = 3000) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}

            {/* 🔔 NOTIFICATION UI */}
            <div className="notification-container">
                {notifications.map((n) => (
                    <div key={n.id} className={`notification ${n.type}`}>
                        {n.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotify = () => useContext(NotificationContext);
