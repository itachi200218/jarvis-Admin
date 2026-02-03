package com.jarvis.jarvisUser.service;

import com.jarvis.jarvisUser.model.UserCommandRule;
import com.jarvis.repository.UserCommandRuleRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;

@Service
public class UserCommandRuleService {

    private final UserCommandRuleRepository repo;

    public UserCommandRuleService(UserCommandRuleRepository repo) {
        this.repo = repo;
    }

    // 🔁 TOGGLE PER-USER COMMAND
    public UserCommandRule toggle(String userId, String intent, boolean disabled) {

        UserCommandRule rule = repo.findByUserId(userId)
                .orElseGet(() -> {
                    UserCommandRule r = new UserCommandRule();
                    r.setUserId(userId);
                    r.setDisabledIntents(new ArrayList<>());
                    r.setCreatedAt(Instant.now());
                    r.setUpdatedAt(Instant.now());
                    return r;
                });

        if (disabled) {
            if (!rule.getDisabledIntents().contains(intent)) {
                rule.getDisabledIntents().add(intent);
            }
        } else {
            rule.getDisabledIntents().remove(intent);
        }

        rule.setUpdatedAt(Instant.now());
        return repo.save(rule);
    }

    // ✅ IMPORTANT FIX HERE
    public UserCommandRule getByUser(String userId) {
        return repo.findByUserId(userId)
                .orElseGet(() -> {
                    UserCommandRule r = new UserCommandRule();
                    r.setUserId(userId);
                    r.setDisabledIntents(new ArrayList<>());
                    r.setCreatedAt(Instant.now());
                    r.setUpdatedAt(Instant.now());
                    return r;
                });
    }
}
