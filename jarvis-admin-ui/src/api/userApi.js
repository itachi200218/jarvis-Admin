const BASE_URL = "http://localhost:8080";

/* =========================
   ✅ REGISTER (PUBLIC)
   ========================= */
export async function addUser(user) {
    const response = await fetch(`${BASE_URL}/admin/users/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Registration failed");
    }

    return response.json();
}

/* =========================
   🔐 LOGIN (RETURNS JWT)
   ========================= */
export async function loginUser(username, password) {
    const response = await fetch(`${BASE_URL}/admin/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Invalid credentials");
    }

    const data = await response.json();
    // expected: { success: true, token: "JWT_TOKEN" }

    // 🔑 STORE JWT (ONE KEY ONLY)
    if (data.token) {
        localStorage.setItem("token", data.token);
    }

    return data;
}

/* =========================
   👤 UPDATE PROFILE (JWT)
   ========================= */
export async function updateProfile(profileData) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No JWT token found");
    }

    const response = await fetch(
        `${BASE_URL}/admin/users/profile`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        }
    );

    if (!response.ok) {
        throw new Error("Profile update failed");
    }

    const data = await response.json();
    // expected: { token: "NEW_JWT_TOKEN" }

    // 🔁 REPLACE OLD TOKEN
    if (data.token) {
        localStorage.setItem("token", data.token);
    }

    return data;
}
