package br.pucgo.ads.projetointegrador.sabordafamilia.service;

import br.pucgo.ads.projetointegrador.sabordafamilia.dto.ConversaSummaryDTO;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Mensagem;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.MensagemRepository;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.UsuarioRepository; // <-- NECESSÁRIO
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final UsuarioRepository usuarioRepository; // <-- INJETAR

    // Atualizar construtor
    public MensagemService(MensagemRepository mensagemRepository, UsuarioRepository usuarioRepository) {
        this.mensagemRepository = mensagemRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Método 1: Para a ChatListPage (lista de resumos)
    @Transactional(readOnly = true)
    public List<ConversaSummaryDTO> listarConversas(Long userId) {
        
        List<Mensagem> todasMensagens = mensagemRepository.findAllByUsuarioIdWithRemetenteAndDestinatario(userId);

        Map<Long, Mensagem> conversasRecentes = new LinkedHashMap<>();

        for (Mensagem msg : todasMensagens) {
            Usuario remetente = msg.getRemetente();
            Usuario destinatario = msg.getDestinatario();
            
            if (remetente.getId().equals(destinatario.getId())) continue;

            Long idOutraPessoa = remetente.getId().equals(userId) ? destinatario.getId() : remetente.getId();

            if (!conversasRecentes.containsKey(idOutraPessoa) || 
                 msg.getEnviadoEm().isAfter(conversasRecentes.get(idOutraPessoa).getEnviadoEm())) {
                conversasRecentes.put(idOutraPessoa, msg);
            }
        }

        return conversasRecentes.values().stream()
            .map(msg -> {
                Usuario contato = msg.getRemetente().getId().equals(userId) ? msg.getDestinatario() : msg.getRemetente();
                
                return new ConversaSummaryDTO(
                    contato,
                    msg.getTexto(),
                    msg.getEnviadoEm()
                );
            })
            .sorted(Comparator.comparing(ConversaSummaryDTO::getDataUltimaMensagem).reversed())
            .collect(Collectors.toList());
    }

    // Método 2: Para a ChatDetailPage (buscar histórico)
    @Transactional(readOnly = true)
    public List<Mensagem> getConversa(Long userId1, Long userId2) {
        return mensagemRepository.findConversaEntreUsuarios(userId1, userId2);
    }

    // Método 3: Para a ChatDetailPage (enviar mensagem)
    @Transactional
    public Mensagem enviarMensagem(Long remetenteId, Long destinatarioId, String conteudo) {
        Usuario remetente = usuarioRepository.findById(remetenteId)
                .orElseThrow(() -> new RuntimeException("Remetente não encontrado"));
        Usuario destinatario = usuarioRepository.findById(destinatarioId)
                .orElseThrow(() -> new RuntimeException("Destinatário não encontrado"));

        Mensagem msg = new Mensagem();
        msg.setRemetente(remetente);
        msg.setDestinatario(destinatario);
        msg.setTexto(conteudo);
        msg.setTipo("texto"); // Define o tipo como "texto"
        // dataEnvio é definida pelo @PrePersist
        
        return mensagemRepository.save(msg);
    }
}