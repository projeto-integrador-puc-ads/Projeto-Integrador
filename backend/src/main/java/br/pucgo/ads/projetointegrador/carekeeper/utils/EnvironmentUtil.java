package com.example.carekeeper.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EnvironmentUtil {

    private final boolean isDev;

    public EnvironmentUtil(@Value("${spring.profiles.active:prod}") String activeProfile) {
        this.isDev = "dev".equalsIgnoreCase(activeProfile);
    }

    public boolean isDev() {
        return isDev;
    }
}
