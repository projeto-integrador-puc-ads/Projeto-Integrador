package com.example.carekeeper.dto;

import com.example.carekeeper.enums.AccidentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccidentTypeCountDTO {
    private String tipo;
    private Long quantidade;
}
