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
        "/api/admin/jarvis-users/count",
        { headers: authHeader() }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch user count");
    }

    return response.json();
}

// 🆕 USERS ADDED TODAY
export async function getTodayUserCount() {
    const response = await fetch(
        "/api/admin/jarvis-users/today-count",
        { headers: authHeader() }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch today user count");
    }

    return response.json();
}

// ✅ ALL USERS
export async function getAllUsers() {
    const response = await fetch(
        "/api/admin/jarvis-users",
        { headers: authHeader() }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}

// 👤 GET USER BY ID
export async function getUserById(userId) {
    const response = await fetch(
        `/api/admin/jarvis-users/${userId}`,
        { headers: authHeader() }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return response.json();
}

// 🔁 UPDATE USER ROLE
export async function updateUserRole(userId, role) {
    const response = await fetch(
        `/api/admin/jarvis-users/${userId}/role?role=${role}`,
        {
            method: "PUT",
            headers: authHeader(),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update role");
    }
}

/* =======================
   ⚙️ ADMIN – JARVIS COMMANDS
   ======================= */

// 📄 GET ALL COMMANDS
export async function getAllCommands() {
    const response = await fetch(
        "/api/admin/commands",
        { headers: authHeader() }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch commands");
    }

    return response.json();
}

// 🔒 ENABLE / DISABLE GLOBAL COMMAND
export async function toggleCommand(intent, disabled) {
    const response = await fetch(
        `/api/admin/commands/${intent}/disable?disabled=${disabled}`,
        {
            method: "PATCH",
            headers: authHeader(),
        }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to update command");
    }

    return response.json();
}

// 🧑 USER-SPECIFIC COMMAND RULES
export async function getUserCommandRules(userId) {
    const response = await fetch(
        `/api/admin/users/${userId}/commands`,
        { headers: authHeader() }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user rules");
    }

    return response.json();
}

// 🔁 TOGGLE USER-SPECIFIC COMMAND
export async function toggleUserCommand(userId, intent, disabled) {
    const response = await fetch(
        `/api/admin/users/${userId}/commands/${intent}?disabled=${disabled}`,
        {
            method: "PATCH",
            headers: authHeader(),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update user command");
    }

    return response.json();
}
/* =======================
   ❌ ADMIN – DELETE USER
   ======================= */
export async function deleteUser(userId) {
    const response = await fetch(
        `/api/admin/jarvis-users/${userId}`,
        {
            method: "DELETE",
            headers: authHeader(),
        }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    return response.json();
}
/* =======================
   ✏️ ADMIN – EDIT USER NAME
   ======================= */
export async function updateUserName(userId, name) {
    const response = await fetch(
        `/api/admin/jarvis-users/${userId}/name?name=${encodeURIComponent(name)}`,
        {
            method: "PUT",
            headers: authHeader(),
        }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to update username");
    }

    return response.json();
}

/* =======================
   ✉️ ADMIN – EDIT USER EMAIL
   ======================= */
export async function updateUserEmail(userId, email) {
    const response = await fetch(
        `/api/admin/jarvis-users/${userId}/email?email=${encodeURIComponent(email)}`,
        {
            method: "PUT",
            headers: authHeader(),
        }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to update email");
    }

    return response.json();
}
/* =======================
   🔐 ADMIN – RESET USER PASSWORD (EMAIL)
   ======================= */
export async function resetUserPassword(userId) {
    const response = await fetch(
        `/api/admin/jarvis-users/${userId}/reset-password`,
        {
            method: "POST",
            headers: authHeader(),
        }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("Failed to send reset password email");
    }

    return response.json();
}
