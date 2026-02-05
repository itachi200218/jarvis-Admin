package com.jarvis.jarvisAdmin.dto;

public class LoginResponse {

    private boolean success;
    private String token;
    private String role;   // ✅ NEW

    public LoginResponse(boolean success, String token, String role) {
        this.success = success;
        this.token = token;
        this.role = role;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
}
