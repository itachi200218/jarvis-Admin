package com.jarvis.jarvisAdmin.dto;

public class LoginResponse {

    private boolean success;
    private String token;

    public LoginResponse(boolean success, String token) {
        this.success = success;
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getToken() {
        return token;
    }
}
