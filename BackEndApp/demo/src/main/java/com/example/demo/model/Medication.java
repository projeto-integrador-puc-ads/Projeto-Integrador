package com.example.demo.model;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medication {

    private String id;


    private String name;


    private String imageUrl;


    private int pillsPerPack;


    private int currentPillsCount;


    private List<LocalTime> scheduleTimes;


    private boolean important;


    private String emergencyContact;


    private boolean alertedLowStock;


    private double lowStockThreshold;


    private int dosesPerDay;


    public Medication(String name,
                      String imageUrl,
                      int pillsPerPack,
                      List<LocalTime> scheduleTimes,
                      boolean important,
                      String emergencyContact,
                      double lowStockThreshold) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.imageUrl = imageUrl;
        this.pillsPerPack = pillsPerPack;
        this.currentPillsCount = pillsPerPack;
        this.scheduleTimes = scheduleTimes;
        this.important = important;
        this.emergencyContact = emergencyContact;
        this.lowStockThreshold = lowStockThreshold;
        this.alertedLowStock = false;
        this.dosesPerDay = scheduleTimes.size();
    }
}