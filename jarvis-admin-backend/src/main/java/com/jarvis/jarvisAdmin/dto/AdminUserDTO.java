package com.jarvis.jarvisAdmin.dto;

public class AdminUserDTO {

    private String id;
    private String name;
    private String email;
    private String role;
    private boolean secureMode;
    private String avatar;

    public AdminUserDTO(
            String id,
            String name,
            String email,
            String role,
            boolean secureMode,
            String avatar
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.secureMode = secureMode;
        this.avatar = avatar;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isSecureMode() { return secureMode; }
    public String getAvatar() { return avatar; }
}
