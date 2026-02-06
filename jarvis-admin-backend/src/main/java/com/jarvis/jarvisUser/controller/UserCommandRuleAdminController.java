//package com.jarvis.jarvisUser.controller;
//
//import com.jarvis.jarvisUser.model.UserCommandRule;
//import com.jarvis.jarvisUser.service.UserCommandRuleService;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/admin/users")
//@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
//public class UserCommandRuleAdminController {
//
//    private final UserCommandRuleService service;
//
//    public UserCommandRuleAdminController(UserCommandRuleService service) {
//        this.service = service;
//    }
//
//    // 📄 GET USER COMMAND RULES
//    @GetMapping("/{userId}/commands")
//    public UserCommandRule getUserRules(@PathVariable String userId) {
//        return service.getByUser(userId);
//    }
//
//    // 🔁 TOGGLE USER-SPECIFIC COMMAND
//    @PatchMapping("/{userId}/commands/{intent}")
//    public UserCommandRule toggleUserCommand(
//            @PathVariable String userId,
//            @PathVariable String intent,
//            @RequestParam boolean disabled
//    ) {
//        return service.toggle(userId, intent, disabled);
//    }
//}
