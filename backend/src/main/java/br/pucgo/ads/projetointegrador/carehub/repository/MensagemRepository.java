package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Mensagem;
import br.pucgo.ads.projetointegrador.carehub.entity.Usuario;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    
    @Query("SELECT m FROM Mensagem m WHERE " +
           "(m.remetente.id = :usuario1Id AND m.destinatario.id = :usuario2Id) OR " +
           "(m.remetente.id = :usuario2Id AND m.destinatario.id = :usuario1Id) " +
           "ORDER BY m.dataEnvio ASC")
    List<Mensagem> findConversaBetween(@Param("usuario1Id") Long usuario1Id, 
                                       @Param("usuario2Id") Long usuario2Id);
    
    List<Mensagem> findByDestinatarioAndLidaFalseOrderByDataEnvioDesc(Usuario destinatario);
}
