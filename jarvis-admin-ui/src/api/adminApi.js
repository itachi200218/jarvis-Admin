const BASE_URL = "http://localhost:8080";

/* =======================
   🔐 AUTH HEADER
   ======================= */
function authHeader() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No JWT token found");
    }

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

/* =======================
   📊 ADMIN – JARVIS USERS
   ======================= */

// ✅ TOTAL USERS
export async function getUserCount() {
    const response = await fetch(
        `${BASE_URL}/api/admin/jarvis-users/count`,
        { headers: authHeader() }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user count");
    }

    return response.json();
}

// 🆕 USERS ADDED TODAY (FOR GRAPH)
export async function getTodayUserCount() {
    const response = await fetch(
        `${BASE_URL}/api/admin/jarvis-users/today-count`,
        { headers: authHeader() }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch today user count");
    }

    return response.json();
}

// ✅ ALL USERS
export async function getAllUsers() {
    const response = await fetch(
        `${BASE_URL}/api/admin/jarvis-users`,
        { headers: authHeader() }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}
