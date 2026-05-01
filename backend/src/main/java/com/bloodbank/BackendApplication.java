package com.bloodbank;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

    public static void main(String[] args) {
        // Load .env from multiple potential locations for robustness
        String[] locations = {"./", "../", "./backend/"};
        for (String location : locations) {
            Dotenv dotenv = Dotenv.configure()
                    .directory(location)
                    .ignoreIfMissing()
                    .load();
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
        }

        SpringApplication.run(BackendApplication.class, args);
    }

}
