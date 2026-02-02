package com.jarvis.repository;

import com.jarvis.jarvisUser.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JarvisUserRepository extends MongoRepository<User, String> {
}
