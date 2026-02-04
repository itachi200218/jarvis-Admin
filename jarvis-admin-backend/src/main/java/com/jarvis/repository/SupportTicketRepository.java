package com.jarvis.repository;
import com.jarvis.jarvisUser.model.SupportTicket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SupportTicketRepository extends MongoRepository<SupportTicket, String> {

    List<SupportTicket> findByStatus(String status);
    List<SupportTicket> findByUserId(String userId);
}