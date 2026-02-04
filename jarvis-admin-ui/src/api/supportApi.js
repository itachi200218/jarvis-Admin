import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/admin/support",
});

/* 🔐 FORCE JWT ON EVERY REQUEST */
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("Sending JWT:", token); // 🔍 DEBUG

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* =====================
   GET ALL TICKETS
   ===================== */
export const getAllTickets = () => API.get("");

/* =====================
   ADMIN REPLY
   ===================== */
export const replyToTicket = (id, message) =>
    API.post(`/${id}/reply`, message, {
        headers: { "Content-Type": "text/plain" },
    });

/* =====================
   CLOSE TICKET
   ===================== */
export const closeTicket = (id) =>
    API.patch(`/${id}/close`);

/* =====================
   🔁 RE-OPEN TICKET
   ===================== */
export const reopenTicket = (id) =>
    API.patch(`/${id}/reopen`);
