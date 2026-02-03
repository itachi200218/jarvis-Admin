package com.jarvis.repository;

import com.jarvis.jarvisUser.model.Command;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CommandRepository extends MongoRepository<Command, String> {
    Optional<Command> findByIntent(String intent);
}
