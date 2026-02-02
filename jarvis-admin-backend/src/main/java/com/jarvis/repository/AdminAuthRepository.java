package com.jarvis.repository;

import java.util.Optional;

import com.jarvis.jarvisAdmin.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface AdminAuthRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
