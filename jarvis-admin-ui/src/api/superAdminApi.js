import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:8080";

function authHeader() {
    const token = getToken();
    if (!token) throw new Error("NO_TOKEN");

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

/* ==========================
   👑 SUPER ADMIN – CREATE ADMIN
   ========================== */
export async function createAdmin(data) {
    const res = await fetch(`${API_BASE}/admin/users/create`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("CREATE_ADMIN_FAILED");
    }

    return res.json();
}

/* ==========================
   👀 SUPER ADMIN – LIST ADMINS
   ========================== */
export async function getAllAdmins() {
    const res = await fetch(`${API_BASE}/admin/users/all`, {
        headers: authHeader(),
    });

    if (!res.ok) {
        throw new Error("FETCH_ADMINS_FAILED");
    }

    return res.json();
}

/* ==========================
   ✏️ SUPER ADMIN – UPDATE ADMIN
   ========================== */
export async function updateAdmin(adminId, data) {
    const res = await fetch(
        `${API_BASE}/admin/users/admin/${adminId}`,
        {
            method: "PUT",
            headers: authHeader(),
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        throw new Error("UPDATE_ADMIN_FAILED");
    }

    return res.json();
}

/* ==========================
   🔑 SUPER ADMIN – RESET ADMIN PASSWORD
   ========================== */
export async function resetAdminPassword(adminId, newPassword) {
    const res = await fetch(
        `${API_BASE}/admin/users/admin/${adminId}/reset-password`,
        {
            method: "PUT",
            headers: authHeader(),
            body: JSON.stringify({
                password: newPassword,
            }),
        }
    );

    if (!res.ok) {
        throw new Error("RESET_PASSWORD_FAILED");
    }

    return res.json(); // { message: "Password reset successful" }
}

/* ==========================
   ❌ SUPER ADMIN – DELETE ADMIN
   ========================== */
export async function deleteAdmin(adminId) {
    const res = await fetch(
        `${API_BASE}/admin/users/admin/${adminId}`,
        {
            method: "DELETE",
            headers: authHeader(),
        }
    );

    if (!res.ok) {
        throw new Error("DELETE_ADMIN_FAILED");
    }

    return res.text(); // backend returns message
}
