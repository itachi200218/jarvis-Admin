package com.jarvis.jarvisAdmin.service;

import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.dto.AuthResponse;
import com.jarvis.jarvisAdmin.dto.UpdateProfileRequest;

public interface UserService {

    User save(User user);

    boolean login(String input, String password); // 👈 KEEP (NO CHANGE)

    // 🔐 NEW (JWT LOGIN)
    AuthResponse loginWithJwt(String input, String password);

    // 👤 PROFILE UPDATE
    AuthResponse updateProfile(String currentUsername, UpdateProfileRequest request);
}
