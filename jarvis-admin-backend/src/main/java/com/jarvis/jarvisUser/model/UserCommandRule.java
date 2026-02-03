package com.jarvis.jarvisUser.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data   // 🔥 THIS FIXES EVERYTHING
@Document(collection = "user_command_rules")
public class UserCommandRule {

    @Id
    private String id;

    private String userId;
    private List<String> disabledIntents;

    private Instant createdAt;
    private Instant updatedAt;
}
