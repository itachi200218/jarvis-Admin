package com.jarvis.jarvisUser.controller;

import com.jarvis.jarvisUser.model.Command;
import com.jarvis.jarvisUser.service.CommandService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/commands") // ✅ FIX PATH
@PreAuthorize("hasRole('ADMIN')")      // ✅ ADMIN ONLY
public class CommandAdminController {

    private final CommandService service;

    public CommandAdminController(CommandService service) {
        this.service = service;
    }

    // ✅ GET ALL COMMANDS (FRONTEND NEEDS THIS)
    @GetMapping
    public List<Command> getAllCommands() {
        return service.getAllCommands();
    }

    // ✅ ENABLE / DISABLE COMMAND
    @PatchMapping("/{intent}/disable")
    public Command disable(
            @PathVariable String intent,
            @RequestParam boolean disabled
    ) {
        return service.setDisabled(intent, disabled);
    }
}
