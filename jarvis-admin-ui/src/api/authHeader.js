export function authHeader() {
    const token = localStorage.getItem("token"); // ✅ FIXED

    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}
