package com.jarvis.jarvisUser.controller;

import com.jarvis.jarvisUser.model.UserCommandRule;
import com.jarvis.jarvisUser.service.UserCommandRuleService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users/{userId}/commands")
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')") // 🔥 THIS IS MANDATORY
public class UserCommandRuleController {

    private final UserCommandRuleService service;

    public UserCommandRuleController(UserCommandRuleService service) {
        this.service = service;
    }

    @PatchMapping("/{intent}")
    public UserCommandRule toggleCommand(
            @PathVariable String userId,
            @PathVariable String intent,
            @RequestParam boolean disabled
    ) {
        return service.toggle(userId, intent, disabled);
    }

    @GetMapping
    public UserCommandRule getRules(@PathVariable String userId) {
        return service.getByUser(userId);
    }
}
