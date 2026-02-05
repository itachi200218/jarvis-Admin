package com.jarvis.jarvisAdmin.service;

import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.dto.AuthResponse;
import com.jarvis.jarvisAdmin.dto.UpdateProfileRequest;

public interface UserService {

    // ✅ REGISTER
    User save(User user);

    // ✅ LOGIN (password check)
    boolean login(String input, String password);

    // 🔐 JWT LOGIN
    AuthResponse loginWithJwt(String input, String password);

    // 👤 PROFILE UPDATE
    AuthResponse updateProfile(String currentUsername, UpdateProfileRequest request);

    // 👑 SUPER ADMIN
    User createAdmin(User user); // ✅ FIXED
}
