package br.pucgo.ads.projetointegrador.sabordafamilia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- IMPORT
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "sabordafamilia_midia_receita")
public class Midia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_midia")
    private Long id;

    @Column(name = "caminho_arquivo")
    private String caminhoArquivo;
    
    @Column(name = "tipo_midia")
    private String tipoMidia;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_receita")
    private Receita receita;
}