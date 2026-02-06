package com.jarvis.jarvisUser.service;

import com.jarvis.jarvisUser.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class AdminUserService {

    @Autowired
    private MongoTemplate mongoTemplate;

    /* ==========================
       🔁 UPDATE USER ROLE
       ========================== */
    public void updateUserRole(String userId, String role) {
        Query query = new Query(Criteria.where("_id").is(userId));
        Update update = new Update().set("role", role);

        mongoTemplate.updateFirst(query, update, User.class);
    }

    /* ==========================
       ✏️ UPDATE USER NAME
       ========================== */
    public void updateUserName(String userId, String name) {
        Query query = new Query(Criteria.where("_id").is(userId));
        Update update = new Update().set("name", name);

        mongoTemplate.updateFirst(query, update, User.class);
    }

    /* ==========================
       ✉️ UPDATE USER EMAIL
       ========================== */
    public void updateUserEmail(String userId, String email) {
        Query query = new Query(Criteria.where("_id").is(userId));
        Update update = new Update().set("email", email);

        mongoTemplate.updateFirst(query, update, User.class);
    }

    /* ==========================
       🔐 RESET PASSWORD (EMAIL ONLY)
       ========================== */
    public void triggerPasswordReset(String userId) {
        Query query = new Query(Criteria.where("_id").is(userId));

        User user = mongoTemplate.findOne(query, User.class);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // 🔥 PLACEHOLDER FOR EMAIL SERVICE
        // emailService.sendPasswordResetLink(user.getEmail());

        // ❗ No password change here (security best practice)
    }
}
