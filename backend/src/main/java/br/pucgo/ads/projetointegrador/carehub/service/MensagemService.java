package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.ContatoDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Mensagem;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.carehub.repository.MensagemRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.UsuarioRepository;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository agendamentoRepository;

    @Transactional
    public MensagemResponseDTO enviarMensagem(Long remetenteId, MensagemRequestDTO dto) {
        Objects.requireNonNull(remetenteId, "Remetente ID cannot be null");
        Long destinatarioId = Objects.requireNonNull(dto.getDestinatarioId(), "Destinatario ID cannot be null");
        
        User remetente = usuarioRepository.findById(remetenteId)
                .orElseThrow(() -> new RuntimeException("Remetente não encontrado"));

        User destinatario = usuarioRepository.findById(destinatarioId)
                .orElseThrow(() -> new RuntimeException("Destinatário não encontrado"));

        // Verificar existência de agendamento entre remetente e destinatario
        boolean podeTrocar = agendamentoRepository.existsBetweenUsers(remetenteId, destinatarioId);
        if (!podeTrocar) {
            throw new br.pucgo.ads.projetointegrador.carehub.exception.OperacaoNaoPermitidaException("Troca de mensagens só permitida quando existe um atendimento entre as partes");
        }

        Mensagem mensagem = new Mensagem();
        mensagem.setRemetente(remetente);
        mensagem.setDestinatario(destinatario);
        mensagem.setConteudo(dto.getConteudo());
        mensagem.setMediaUrl(dto.getMediaUrl());
        mensagem.setMediaType(dto.getMediaType());

        mensagem = mensagemRepository.save(mensagem);
        return toResponseDTO(mensagem);
    }

    @Transactional(readOnly = true)
    public List<MensagemResponseDTO> listarMensagens(Long usuarioId) {
        Objects.requireNonNull(usuarioId, "Usuario ID cannot be null");
        
        return mensagemRepository.findByRemetenteIdOrDestinatarioIdOrderByDataEnvioDesc(usuarioId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MensagemResponseDTO> buscarConversa(Long usuario1Id, Long usuario2Id) {
        Objects.requireNonNull(usuario1Id, "Usuario1 ID cannot be null");
        Objects.requireNonNull(usuario2Id, "Usuario2 ID cannot be null");
        // Verificar se existe agendamento entre os usuários; se não, recusar acesso
        boolean existe = agendamentoRepository.existsBetweenUsers(usuario1Id, usuario2Id);
        if (!existe) {
            throw new br.pucgo.ads.projetointegrador.carehub.exception.OperacaoNaoPermitidaException("Acesso à conversa negado: sem atendimento entre as partes");
        }

        return mensagemRepository.findConversaBetween(usuario1Id, usuario2Id).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MensagemResponseDTO> buscarMensagensNaoLidas(Long usuarioId) {
        Objects.requireNonNull(usuarioId, "Usuario ID cannot be null");
        
        User usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return mensagemRepository.findByDestinatarioAndLidaFalseOrderByDataEnvioDesc(usuario).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void marcarComoLida(Long mensagemId) {
        Objects.requireNonNull(mensagemId, "Mensagem ID cannot be null");
        
        Mensagem mensagem = mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));
        mensagem.setLida(true);
        mensagemRepository.save(mensagem);
    }

    @Transactional(readOnly = true)
    public long contarMensagensNaoLidas(Long usuarioId) {
        Objects.requireNonNull(usuarioId, "Usuario ID cannot be null");
        return mensagemRepository.countMensagensNaoLidas(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<ContatoDTO> listarContatos(Long usuarioId) {
        Objects.requireNonNull(usuarioId, "Usuario ID cannot be null");
        
        // Buscar IDs dos contatos
        List<Long> contatoIds = mensagemRepository.findContatoIds(usuarioId);
        
        if (contatoIds == null || contatoIds.isEmpty()) {
            return List.of(); // Retorna lista vazia se não houver contatos
        }
        
        // Buscar usuários pelos IDs e preencher informações completas
        return usuarioRepository.findAllById(contatoIds).stream()
                .map(usuario -> {
                    ContatoDTO dto = new ContatoDTO();
                    dto.setId(usuario.getId());
                    dto.setNome(usuario.getName());
                    dto.setPerfil(usuario.getClass().getSimpleName().toUpperCase());
                    dto.setEmail(usuario.getEmail());
                    
                    // Contar mensagens não lidas deste contato
                    long naoLidas = mensagemRepository.countMensagensNaoLidasDeRemetente(usuarioId, usuario.getId());
                    dto.setMensagensNaoLidas(naoLidas);
                    
                    // Buscar última mensagem
                    Mensagem ultimaMensagem = mensagemRepository.findUltimaMensagemEntre(usuarioId, usuario.getId());
                    if (ultimaMensagem != null) {
                        String preview = ultimaMensagem.getConteudo();
                        if (preview != null) {
                            if (preview.length() > 50) {
                                preview = preview.substring(0, 50) + "...";
                            }
                            dto.setUltimaMensagem(preview);
                        } else {
                            dto.setUltimaMensagem("🎤 Áudio");
                        }
                        dto.setDataUltimaMensagem(ultimaMensagem.getDataEnvio());
                    }
                    
                    return dto;
                })
                .sorted((c1, c2) -> {
                    // Ordenar por data da última mensagem (mais recente primeiro)
                    if (c1.getDataUltimaMensagem() == null) return 1;
                    if (c2.getDataUltimaMensagem() == null) return -1;
                    return c2.getDataUltimaMensagem().compareTo(c1.getDataUltimaMensagem());
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void marcarConversaComoLida(Long usuarioId, Long remetenteId) {
        Objects.requireNonNull(usuarioId, "Usuario ID cannot be null");
        Objects.requireNonNull(remetenteId, "Remetente ID cannot be null");
        
        mensagemRepository.marcarComoLidas(usuarioId, remetenteId);
    }

    private MensagemResponseDTO toResponseDTO(Mensagem mensagem) {
        MensagemResponseDTO dto = new MensagemResponseDTO();
        dto.setId(mensagem.getId());
        dto.setRemetenteId(mensagem.getRemetente().getId());
        dto.setRemetenteNome(mensagem.getRemetente().getName());
        dto.setDestinatarioId(mensagem.getDestinatario().getId());
        dto.setDestinatarioNome(mensagem.getDestinatario().getName());
        dto.setConteudo(mensagem.getConteudo());
        dto.setDataEnvio(mensagem.getDataEnvio());
        dto.setLida(mensagem.getLida());
        dto.setMediaUrl(mensagem.getMediaUrl());
        dto.setMediaType(mensagem.getMediaType());
        return dto;
    }
}
