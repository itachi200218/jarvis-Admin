package com.jarvis.config;

import com.jarvis.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ❌ No CSRF for APIs
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS (frontend → backend)
                .cors(cors -> {})

                // 🔐 AUTH RULES
                .authorizeHttpRequests(auth -> auth

                        // 🔓 PUBLIC (NO TOKEN)
                        .requestMatchers(
                                "/admin/users/login",
                                "/admin/users/add",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // 🔒 ADMIN APIs (JWT REQUIRED)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🔒 EVERYTHING ELSE NEEDS JWT
                        .anyRequest().authenticated()
                )

                // 🔑 JWT FILTER
                .addFilterBefore(
                        new JwtFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
