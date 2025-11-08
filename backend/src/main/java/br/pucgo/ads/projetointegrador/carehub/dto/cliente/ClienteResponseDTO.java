package br.pucgo.ads.projetointegrador.carehub.dto.cliente;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String necessidades;
    private String endereco;
    private String contatoEmergencia;
    private String tipoCliente;
    private Boolean ativo;
    private LocalDateTime criadoEm;
}
