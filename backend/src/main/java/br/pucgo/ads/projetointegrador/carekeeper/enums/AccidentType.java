package com.example.carekeeper.enums;

import lombok.Getter;

@Getter
public enum AccidentType {
    FALL(
        "Queda detectada",
        "{{name}} sofreu uma possível queda. Verifique imediatamente se ele(a) está bem e, se necessário, acione ajuda."
    ),
    IMMOBILITY(
        "Imobilidade prolongada",
        "{{name}} está sem movimentação há um tempo considerável. Certifique-se de que está confortável e consciente."
    ),
    OUT_OF_SAFE_ZONE(
        "Saída da área segura",
        "{{name}} deixou a área segura definida. Entre em contato e verifique se está em um local seguro."
    ),
    MOVEMENT_ALONE(
        "Movimento independente detectado",
        "{{name}} se levantou sozinho(a). Observe para evitar quedas ou outros acidentes."
    );

    private final String title;
    private final String description;

    AccidentType(String title, String description) {
        this.title = title;
        this.description = description;
    }
}
