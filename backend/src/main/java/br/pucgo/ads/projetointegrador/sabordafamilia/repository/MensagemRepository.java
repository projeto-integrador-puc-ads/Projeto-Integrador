package br.pucgo.ads.projetointegrador.sabordafamilia.repository;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    // Query 1: Para a ChatListPage (lista de resumos de conversa)
    // Busca todas as mensagens E JÁ CARREGA (FETCH) os dados do remetente e destinatário
    @Query("SELECT m FROM Mensagem m " +
           "JOIN FETCH m.remetente " +
           "JOIN FETCH m.destinatario " +
           "WHERE m.remetente.id = :userId OR m.destinatario.id = :userId " +
           "ORDER BY m.enviadoEm DESC")
    List<Mensagem> findAllByUsuarioIdWithRemetenteAndDestinatario(@Param("userId") Long userId);

    // Query 2: Para a ChatDetailPage (histórico da conversa)
    // Busca o histórico de conversa entre dois usuários específicos
    @Query("SELECT m FROM Mensagem m " +
           "JOIN FETCH m.remetente " +
           "JOIN FETCH m.destinatario " +
           "WHERE (m.remetente.id = :userId1 AND m.destinatario.id = :userId2) " +
           "   OR (m.remetente.id = :userId2 AND m.destinatario.id = :userId1) " +
           "ORDER BY m.enviadoEm ASC") // ASC para ordem cronológica
    List<Mensagem> findConversaEntreUsuarios(
            @Param("userId1") Long userId1,
            @Param("userId2") Long userId2
    );
}