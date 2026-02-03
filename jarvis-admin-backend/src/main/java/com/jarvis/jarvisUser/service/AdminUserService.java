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

    public void updateUserRole(String userId, String role) {
        Query query = new Query(Criteria.where("_id").is(userId));
        Update update = new Update().set("role", role);

        mongoTemplate.updateFirst(query, update, User.class);
    }
}
