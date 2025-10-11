package br.pucgo.ads.projetointegrador.carehub.dto.cliente;

import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequestDTO {
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String necessidades;
    private String endereco;
    private String telefoneEmergencia;
    private String contatoEmergencia;
    private Cliente.TipoCliente tipoCliente;
}
