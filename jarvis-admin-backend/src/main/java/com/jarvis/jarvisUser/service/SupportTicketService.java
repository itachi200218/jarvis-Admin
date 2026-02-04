package com.jarvis.jarvisUser.service;

import com.jarvis.jarvisUser.model.Message;
import com.jarvis.jarvisUser.model.SupportTicket;
import com.jarvis.repository.SupportTicketRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class SupportTicketService {

    private final SupportTicketRepository repository;

    public SupportTicketService(SupportTicketRepository repository) {
        this.repository = repository;
    }

    /* =========================
       🔹 CREATE TICKET
       ========================= */
    public SupportTicket createTicket(String userId, String username, String message) {
        SupportTicket ticket = new SupportTicket();
        ticket.setUserId(userId);
        ticket.setUsername(username);
        ticket.setStatus("open");
        ticket.setCreatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        List<Message> messages = new ArrayList<>();
        messages.add(new Message("user", message));
        ticket.setMessages(messages);

        return repository.save(ticket);
    }

    /* =========================
       💬 ADMIN REPLY
       ========================= */
    public SupportTicket reply(String ticketId, String message) {
        SupportTicket ticket = repository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.getMessages().add(new Message("admin", message));
        ticket.setUpdatedAt(Instant.now());

        return repository.save(ticket);
    }

    /* =========================
       ❌ CLOSE TICKET
       ========================= */
    public SupportTicket close(String ticketId) {
        SupportTicket ticket = repository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus("closed");
        ticket.setUpdatedAt(Instant.now());

        return repository.save(ticket);
    }

    /* =========================
       🔁 REOPEN TICKET
       ========================= */
    public SupportTicket reopen(String ticketId) {
        SupportTicket ticket = repository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus("open");
        ticket.setUpdatedAt(Instant.now());

        return repository.save(ticket);
    }

    /* =========================
       📥 FETCH ALL TICKETS
       ========================= */
    public List<SupportTicket> getAll() {
        return repository.findAll();
    }
}
