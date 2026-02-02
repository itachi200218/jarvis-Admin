package com.jarvis.jarvisAdmin.dto;

import java.time.Instant;

public class AdminUserDTO {

    private String id;
    private String name;
    private String email;
    private String role;
    private boolean secureMode;
    private String avatar;
    private Instant createdAt;
    private Instant lastLoginAt;
    private boolean online; // ✅ ADD THIS

    public AdminUserDTO(
            String id,
            String name,
            String email,
            String role,
            boolean secureMode,
            String avatar,
            Instant createdAt,
            Instant lastLoginAt,
            boolean online              // ✅ ADD THIS
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.secureMode = secureMode;
        this.avatar = avatar;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this.online = online;          // ✅ ADD THIS
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isSecureMode() { return secureMode; }
    public String getAvatar() { return avatar; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastLoginAt() { return lastLoginAt; }
    public boolean isOnline() { return online; } // ✅ ADD THIS
}
