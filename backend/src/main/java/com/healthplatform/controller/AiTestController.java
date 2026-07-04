package com.healthplatform.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiTestController {

    private final ChatClient chatClient;

    public AiTestController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @GetMapping("/test")
    public String test() {
        return chatClient.prompt()
                .user("Explain what hemoglobin means in simple terms.")
                .call()
                .content();
    }
}
