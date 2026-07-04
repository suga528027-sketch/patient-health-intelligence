package com.healthplatform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class QdrantConfig {

    @Value("${qdrant.url:http://localhost:6333}")
    private String qdrantUrl;

    @Value("${qdrant.api-key:}")
    private String apiKey;

    @Bean
    public RestClient qdrantRestClient() {
        RestClient.Builder builder = RestClient.builder().baseUrl(qdrantUrl);
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            builder.defaultHeader("api-key", apiKey);
        }
        return builder.build();
    }
}
