package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
    
    @Query("SELECT m FROM Mensagem m WHERE " +
           "m.remetente.id = :usuarioId OR m.destinatario.id = :usuarioId " +
           "ORDER BY m.dataEnvio DESC")
    List<Mensagem> findByRemetenteIdOrDestinatarioIdOrderByDataEnvioDesc(@Param("usuarioId") Long remetenteId, 
                                                                           @Param("usuarioId") Long destinatarioId);
    
    List<Mensagem> findByDestinatarioAndLidaFalseOrderByDataEnvioDesc(Usuario destinatario);
    
    // Contar mensagens não lidas
    @Query("SELECT COUNT(m) FROM Mensagem m WHERE m.destinatario.id = :usuarioId AND m.lida = false")
    long countMensagensNaoLidas(@Param("usuarioId") Long usuarioId);
    
    // Contar mensagens não lidas de um remetente específico
    @Query("SELECT COUNT(m) FROM Mensagem m WHERE m.destinatario.id = :usuarioId " +
           "AND m.remetente.id = :remetenteId AND m.lida = false")
    long countMensagensNaoLidasDeRemetente(@Param("usuarioId") Long usuarioId, 
                                           @Param("remetenteId") Long remetenteId);
    
    // Buscar última mensagem entre dois usuários
    @Query("SELECT m FROM Mensagem m WHERE " +
           "(m.remetente.id = :usuario1Id AND m.destinatario.id = :usuario2Id) OR " +
           "(m.remetente.id = :usuario2Id AND m.destinatario.id = :usuario1Id) " +
           "ORDER BY m.dataEnvio DESC LIMIT 1")
    Mensagem findUltimaMensagemEntre(@Param("usuario1Id") Long usuario1Id, 
                                     @Param("usuario2Id") Long usuario2Id);
    
    // Buscar IDs de contatos (usuários com quem trocou mensagens)
    @Query(value = "SELECT DISTINCT CASE " +
           "  WHEN m.remetente_id = :usuarioId THEN m.destinatario_id " +
           "  ELSE m.remetente_id " +
           "END " +
           "FROM ch_mensagem m " +
           "WHERE m.remetente_id = :usuarioId OR m.destinatario_id = :usuarioId", 
           nativeQuery = true)
    List<Long> findContatoIds(@Param("usuarioId") Long usuarioId);
    
    // Marcar mensagens como lidas
    @Modifying
    @Query("UPDATE Mensagem m SET m.lida = true " +
           "WHERE m.destinatario.id = :usuarioId " +
           "AND m.remetente.id = :remetenteId " +
           "AND m.lida = false")
    int marcarComoLidas(@Param("usuarioId") Long usuarioId, @Param("remetenteId") Long remetenteId);
}
