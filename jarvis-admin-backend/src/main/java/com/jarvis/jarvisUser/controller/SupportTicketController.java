package com.jarvis.jarvisUser.controller;

import com.jarvis.jarvisUser.model.SupportTicket;
import com.jarvis.jarvisUser.service.SupportTicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/support")
@CrossOrigin(origins = "http://localhost:5173") // optional, safe for Vite
public class SupportTicketController {

    private final SupportTicketService service;

    public SupportTicketController(SupportTicketService service) {
        this.service = service;
    }

    /* =========================
       🔥 CREATE TEST TICKET
       ========================= */
    @PostMapping("/create-test")
    public SupportTicket createTestTicket() {
        return service.createTicket(
                "test_user_1",
                "Test User",
                "Hello admin, need help"
        );
    }

    /* =========================
       ✅ GET ALL TICKETS (ADMIN)
       ========================= */
    @GetMapping
    public List<SupportTicket> getAllTickets() {
        return service.getAll();
    }

    /* =========================
       💬 ADMIN REPLY
       ========================= */
    @PostMapping("/{id}/reply")
    public SupportTicket reply(
            @PathVariable String id,
            @RequestBody String message
    ) {
        return service.reply(id, message);
    }

    /* =========================
       ❌ CLOSE TICKET
       ========================= */
    @PatchMapping("/{id}/close")
    public SupportTicket close(@PathVariable String id) {
        return service.close(id);
    }

    /* =========================
       🔁 REOPEN TICKET
       ========================= */
    @PatchMapping("/{id}/reopen")
    public SupportTicket reopen(@PathVariable String id) {
        return service.reopen(id);
    }
}
