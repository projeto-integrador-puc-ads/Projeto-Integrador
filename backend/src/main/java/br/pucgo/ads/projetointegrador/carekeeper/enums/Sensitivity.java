package com.example.carekeeper.enums;

/**
 * Níveis de sensibilidade expostos aos usuários. Cada nível é mapeado para um multiplicador
 * interno usado pelo detector de quedas para ajustar os limites — maior sensibilidade => multiplicador menor.
 */
public enum Sensitivity {
    LOW(1.15),
    MEDIUM(1.0),
    HIGH(0.85);

    private final double multiplier;

    Sensitivity(double multiplier) {
        this.multiplier = multiplier;
    }

    public double getMultiplier() {
        return multiplier;
    }

    public static Sensitivity fromString(String s) {
        if (s == null) return MEDIUM;
        try {
            return Sensitivity.valueOf(s.toUpperCase());
        } catch (IllegalArgumentException e) {
            return MEDIUM;
        }
    }
}
