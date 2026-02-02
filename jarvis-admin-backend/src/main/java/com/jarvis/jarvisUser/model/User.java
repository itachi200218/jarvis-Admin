package com.jarvis.jarvisUser.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

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

    // ✅ MAP Mongo created_at → Java createdAt
    @Field("created_at")
    private LocalDateTime createdAt;
}
