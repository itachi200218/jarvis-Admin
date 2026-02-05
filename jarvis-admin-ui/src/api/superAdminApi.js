import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:8080";

function authHeader() {
    const token = getToken();
    if (!token) throw new Error("NO_TOKEN");

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

// 👑 CREATE ADMIN
export async function createAdmin(data) {
    const res = await fetch(`${API_BASE}/admin/users/create`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("CREATE_FAILED");
    return res.json();
}

// 👀 LIST ADMINS
export async function getAllAdmins() {
    const res = await fetch(`${API_BASE}/admin/users/all`, {
        headers: authHeader(),
    });

    if (!res.ok) throw new Error("FETCH_FAILED");
    return res.json();
}
