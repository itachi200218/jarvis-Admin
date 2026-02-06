package com.jarvis.jarvisUser.controller;

import com.jarvis.jarvisAdmin.dto.AdminUserDTO;
import com.jarvis.jarvisAdmin.service.UserService;
import com.jarvis.jarvisUser.model.User;
import com.jarvis.jarvisUser.service.AdminUserService;
import com.jarvis.repository.JarvisUserRepository;
import com.jarvis.repository.UserCommandRuleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/jarvis-users")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')") // 🔥 REQUIRED
public class AdminJarvisUserController {

    @Autowired
    private JarvisUserRepository jarvisUserRepo;
    @Autowired
    private UserCommandRuleRepository userCommandRuleRepo;
    @Autowired
    private UserService userService; // ✅ inject bean

    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");
    private static final ZoneId UTC = ZoneId.of("UTC");

    /* ==========================
       👥 TOTAL USERS
       ========================== */
    @GetMapping("/count")
    public long countJarvisUsers() {
        return jarvisUserRepo.count();
    }

    /* ==========================
       🆕 USERS ADDED TODAY (IST)
       ========================== */
    @GetMapping("/today-count")
    public long countUsersAddedToday() {

        LocalDate today = LocalDate.now(IST);

        return jarvisUserRepo.findAll()
                .stream()
                .filter(user -> user.getCreatedAt() != null)
                .filter(user ->
                        user.getCreatedAt()
                                .atZone(ZoneId.of("UTC"))
                                .withZoneSameInstant(IST)
                                .toLocalDate()
                                .equals(today)
                )
                .count();
    }

    /* ==========================
       📊 USERS PER DAY (LAST 7 DAYS – IST)
       ========================== */
    @GetMapping("/stats/last-7-days")
    public List<Map<String, Object>> usersLast7Days() {

        LocalDate todayIST = LocalDate.now(IST);

        // group users by IST date
        Map<LocalDate, Long> grouped =
                jarvisUserRepo.findAll()
                        .stream()
                        .filter(user -> user.getCreatedAt() != null)
                        .collect(Collectors.groupingBy(
                                user -> user.getCreatedAt()
                                        .atZone(UTC)
                                        .withZoneSameInstant(IST)
                                        .toLocalDate(),
                                Collectors.counting()
                        ));

        List<Map<String, Object>> result = new ArrayList<>();

        // ensure last 7 days always exist
        for (int i = 6; i >= 0; i--) {
            LocalDate date = todayIST.minusDays(i);

            result.add(Map.of(
                    "date", date.toString(),
                    "count", grouped.getOrDefault(date, 0L)
            ));
        }

        return result;
    }

    /* ==========================
       📋 ALL USERS (ADMIN VIEW)
       ========================== */
    @GetMapping
    public List<AdminUserDTO> getAllJarvisUsers() {

        return jarvisUserRepo.findAll()
                .stream()
                .map(user -> new AdminUserDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.isSecureMode(),
                        user.getAvatar(),
                        user.getCreatedAt(),
                        user.getLastLoginAt(),
                        user.isOnline(),
                        user.getLastSeenAt()     // 🔥 THIS IS THE KEY
                ))



                .collect(Collectors.toList());
    }
    /* ==========================
   🔁 UPDATE USER ROLE (ADMIN)
   ========================== */
    @Autowired
    private AdminUserService adminUserService;

    @PutMapping("/{id}/role")
    public void updateUserRole(
            @PathVariable String id,
            @RequestParam String role
    ) {
        if (!role.equalsIgnoreCase("user") && !role.equalsIgnoreCase("guest")) {
            throw new IllegalArgumentException("Invalid role");
        }

        adminUserService.updateUserRole(id, role.toLowerCase());
    }
    /* ==========================
       ❌ DELETE USER (ADMIN)
       ========================== */
    @DeleteMapping("/{id}")
    public Map<String, String> deleteJarvisUser(@PathVariable String id) {

        // ❌ delete user command rules first
        userCommandRuleRepo.deleteByUserId(id);

        // ❌ delete user
        jarvisUserRepo.deleteById(id);

        return Map.of(
                "status", "success",
                "message", "User and command rules deleted",
                "userId", id
        );
    }
    /* ==========================
       ✏️ UPDATE USER NAME (ADMIN)
       ========================== */
    @PutMapping("/{id}/name")
    public Map<String, String> updateUserName(
            @PathVariable String id,
            @RequestParam String name
    ) {
        adminUserService.updateUserName(id, name);

        return Map.of(
                "status", "success",
                "message", "Username updated",
                "userId", id
        );
    }

    /* ==========================
       ✉️ UPDATE USER EMAIL (ADMIN)
       ========================== */
    @PutMapping("/{id}/email")
    public Map<String, String> updateUserEmail(
            @PathVariable String id,
            @RequestParam String email
    ) {
        adminUserService.updateUserEmail(id, email);

        return Map.of(
                "status", "success",
                "message", "Email updated",
                "userId", id
        );
    }

    /* ==========================
        🔐 RESET PASSWORD (EMAIL)
        ========================== */
    @PostMapping("/{id}/reset-password")
    public Map<String, String> resetPassword(@PathVariable String id) {

        userService.triggerPasswordResetEmail(id); // ✅ CORRECT

        return Map.of(
                "status", "success",
                "message", "Password reset email sent successfully",
                "userId", id
        );
    }

}
