package com.jarvis.jarvisUser.service;

import com.jarvis.jarvisUser.model.Command;
import com.jarvis.repository.CommandRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CommandService {

    private final CommandRepository repo;

    public CommandService(CommandRepository repo) {
        this.repo = repo;
    }

    // ✅ REQUIRED BY ADMIN UI
    public List<Command> getAllCommands() {
        return repo.findAll();
    }

    // ✅ TOGGLE ENABLE / DISABLE
    public Command setDisabled(String intent, boolean disabled) {
        Command cmd = repo.findByIntent(intent)
                .orElseThrow(() -> new RuntimeException("Command not found: " + intent));

        cmd.setDisabled(disabled);
        cmd.setUpdatedAt(Instant.now()); // 🔥 correct

        return repo.save(cmd);
    }
}
