package com.example.carekeeper.interfaces;

import com.example.carekeeper.enums.AccidentType;
import com.example.carekeeper.dto.SensorDTO;

public interface AccidentDetector {
    /**
     * Detecta um acidente com base nas leituras atuais e anteriores do sensor.
     *
     * @param current leitura atual do sensor
     * @param previous leitura anterior do sensor
     * @return true se um acidente for detectado
     */
    boolean detect(SensorDTO current, SensorDTO previous);

    /**
     * Retorna o tipo de acidente que este detector identifica.
     *
     * @return AccidentType associado a este detector
     */
    AccidentType getType();
}
