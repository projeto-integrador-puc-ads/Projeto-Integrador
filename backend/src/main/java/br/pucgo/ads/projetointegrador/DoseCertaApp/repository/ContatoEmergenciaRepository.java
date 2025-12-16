package br.pucgo.ads.projetointegrador.DoseCertaApp.repository;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.ContatoEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContatoEmergenciaRepository extends JpaRepository<ContatoEmergencia, Long> {

    // Lista todos os contatos de um usuário
    List<ContatoEmergencia> findByUsuarioId(Long usuarioId);

    // Verifica se já existe contato com mesmo telefone para o mesmo usuário
    boolean existsByUsuarioIdAndTelefone(Long usuarioId, String telefone);
}
