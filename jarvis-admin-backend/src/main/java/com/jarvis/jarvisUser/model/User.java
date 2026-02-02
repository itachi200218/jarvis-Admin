package com.jarvis.jarvisUser.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String role;

    private boolean secureMode;
    private String avatar;

    // 🟢 ONLINE STATUS (FROM FASTAPI)
    private boolean online; // ✅ THIS WAS MISSING

    // ✅ AUTO CREATED TIME (UTC)
    @CreatedDate
    @Field("created_at")
    private Instant createdAt;

    // ✅ LAST LOGIN TIME
    @Field("last_login_at")
    private Instant lastLoginAt;
}
