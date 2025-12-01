package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Mensagem;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;

import java.util.List;
import java.util.Optional;

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
    List<Mensagem> findByRemetenteIdOrDestinatarioIdOrderByDataEnvioDesc(@Param("usuarioId") Long usuarioId);
    
    List<Mensagem> findByDestinatarioAndLidaFalseOrderByDataEnvioDesc(User destinatario);
    
    // Contar mensagens não lidas
    @Query("SELECT COUNT(m) FROM Mensagem m WHERE m.destinatario.id = :usuarioId AND m.lida = false")
    long countMensagensNaoLidas(@Param("usuarioId") Long usuarioId);
    
    // Contar mensagens não lidas de um remetente específico
    @Query("SELECT COUNT(m) FROM Mensagem m WHERE m.destinatario.id = :usuarioId " +
           "AND m.remetente.id = :remetenteId AND m.lida = false")
    long countMensagensNaoLidasDeRemetente(@Param("usuarioId") Long usuarioId, 
                                           @Param("remetenteId") Long remetenteId);
    
    // Buscar mensagens entre dois usuários ordenadas por data desc
    @Query("SELECT m FROM Mensagem m WHERE " +
           "(m.remetente.id = :usuario1Id AND m.destinatario.id = :usuario2Id) OR " +
           "(m.remetente.id = :usuario2Id AND m.destinatario.id = :usuario1Id) " +
           "ORDER BY m.dataEnvio DESC")
    List<Mensagem> findMensagensEntreOrderByDataEnvioDesc(@Param("usuario1Id") Long usuario1Id, 
                                                         @Param("usuario2Id") Long usuario2Id);

    // Retorna a última mensagem entre dois usuários (ou null se não existir)
    default Mensagem findUltimaMensagemEntre(Long usuario1Id, Long usuario2Id) {
        List<Mensagem> msgs = findMensagensEntreOrderByDataEnvioDesc(usuario1Id, usuario2Id);
        return (msgs == null || msgs.isEmpty()) ? null : msgs.get(0);
    }
    
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

       Optional<Mensagem> findByMediaUrl(String mediaUrl);
}
