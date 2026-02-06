package com.jarvis.config;

import com.jarvis.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth

                        // 🔥 ALLOW CORS PREFLIGHT
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🌍 PUBLIC – PASSWORD RESET (FIX)
                        .requestMatchers(
                                "/api/auth/reset-password"
                        ).permitAll()

                        // 🧪 MAIL TEST
                        .requestMatchers("/api/test-mail").permitAll()

                        // 🌍 PUBLIC
                        .requestMatchers(
                                "/admin/users/login",
                                "/admin/users/add",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // 🔐 ADMIN APIs
                        .requestMatchers("/api/admin/**")
                        .hasAnyRole("ADMIN", "SUPER_ADMIN")

                        // 🔐 ALL OTHER APIs REQUIRE AUTH
                        .requestMatchers("/api/**")
                        .authenticated()

                        // 🎨 FRONTEND ROUTES
                        .requestMatchers(
                                "/admin/**",
                                "/admin-users/**",
                                "/admin/secure-commands/**"
                        ).permitAll()

                        .anyRequest().permitAll()
                )


                .addFilterBefore(
                        new JwtFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
