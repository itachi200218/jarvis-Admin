export function getToken() {
    return localStorage.getItem("token");
}

export function getRole() {
    return localStorage.getItem("role");
}

export function isSuperAdmin() {
    return getRole() === "SUPER_ADMIN";
}
