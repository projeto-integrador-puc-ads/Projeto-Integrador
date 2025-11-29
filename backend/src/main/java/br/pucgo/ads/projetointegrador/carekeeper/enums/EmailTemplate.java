package com.example.carekeeper.enums;

public enum EmailTemplate {
    PANIC_ALERT("templates/panic_alert_template.html"),
    EMERGENCY_ALERT_TEMPLATE("templates/emergency_alert_template.html");

    private final String path;

    EmailTemplate(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }
}
