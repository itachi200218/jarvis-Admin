package com.jarvis.jarvisUser.model;

import java.time.Instant;

public class Message {

    private String sender; // user | admin
    private String text;
    private Instant timestamp;

    public Message() {}

    public Message(String sender, String text) {
        this.sender = sender;
        this.text = text;
        this.timestamp = Instant.now();
    }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
