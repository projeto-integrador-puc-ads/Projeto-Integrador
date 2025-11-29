package com.example.carekeeper.dto;

import com.example.carekeeper.enums.AccidentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccidentLocationDTO {
    private Double latitude;
    private Double longitude;
    private String tipo;
    private Long timestamp;
}
