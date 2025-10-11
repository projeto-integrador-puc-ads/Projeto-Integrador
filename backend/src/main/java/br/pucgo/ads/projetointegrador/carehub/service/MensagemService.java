package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Mensagem;
import br.pucgo.ads.projetointegrador.carehub.entity.Usuario;
import br.pucgo.ads.projetointegrador.carehub.repository.MensagemRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public MensagemResponseDTO enviarMensagem(Long remetenteId, MensagemRequestDTO dto) {
        Usuario remetente = usuarioRepository.findById(remetenteId)
                .orElseThrow(() -> new RuntimeException("Remetente não encontrado"));

        Usuario destinatario = usuarioRepository.findById(dto.getDestinatarioId())
                .orElseThrow(() -> new RuntimeException("Destinatário não encontrado"));

        Mensagem mensagem = new Mensagem();
        mensagem.setRemetente(remetente);
        mensagem.setDestinatario(destinatario);
        mensagem.setConteudo(dto.getConteudo());

        mensagem = mensagemRepository.save(mensagem);
        return toResponseDTO(mensagem);
    }

    public List<MensagemResponseDTO> buscarConversa(Long usuario1Id, Long usuario2Id) {
        return mensagemRepository.findConversaBetween(usuario1Id, usuario2Id).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<MensagemResponseDTO> buscarMensagensNaoLidas(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return mensagemRepository.findByDestinatarioAndLidaFalseOrderByDataEnvioDesc(usuario).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void marcarComoLida(Long mensagemId) {
        Mensagem mensagem = mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));
        mensagem.setLida(true);
        mensagemRepository.save(mensagem);
    }

    private MensagemResponseDTO toResponseDTO(Mensagem mensagem) {
        MensagemResponseDTO dto = new MensagemResponseDTO();
        dto.setId(mensagem.getId());
        dto.setRemetenteId(mensagem.getRemetente().getId());
        dto.setRemetenteNome(mensagem.getRemetente().getNome());
        dto.setDestinatarioId(mensagem.getDestinatario().getId());
        dto.setDestinatarioNome(mensagem.getDestinatario().getNome());
        dto.setConteudo(mensagem.getConteudo());
        dto.setDataEnvio(mensagem.getDataEnvio());
        dto.setLida(mensagem.getLida());
        return dto;
    }
}
