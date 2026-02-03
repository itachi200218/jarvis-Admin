// repository/UserCommandRuleRepository.java
package com.jarvis.repository;

import com.jarvis.jarvisUser.model.UserCommandRule;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserCommandRuleRepository
        extends MongoRepository<UserCommandRule, String> {

    Optional<UserCommandRule> findByUserId(String userId);

    void deleteByUserId(String userId);   // ✅ ADD THIS
}

