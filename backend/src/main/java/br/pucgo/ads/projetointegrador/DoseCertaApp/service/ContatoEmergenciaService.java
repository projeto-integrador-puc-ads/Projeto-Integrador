package br.pucgo.ads.projetointegrador.DoseCertaApp.service;

import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.ContatoEmergenciaDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.ContatoEmergencia;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.ContatoEmergenciaRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContatoEmergenciaService {

    private final ContatoEmergenciaRepository repository;
    private final UserRepository usuarioRepository;

    public ContatoEmergenciaService(ContatoEmergenciaRepository repository,
                                    UserRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    // ======================
    // LISTAR POR USUÁRIO
    // ======================
    public List<ContatoEmergencia> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    // ======================
    // BUSCAR POR ID
    // ======================
    public ContatoEmergencia buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));
    }

    // ======================
    // CRIAR USANDO DTO (RECOMENDADO)
    // ======================
    @Transactional
    public ContatoEmergencia criar(ContatoEmergenciaDTO dto) {

        // 1️⃣ Valida usuário
        User usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));

        // 2️⃣ Evita duplicidade de telefone
        boolean existeTelefone = repository.existsByUsuarioIdAndTelefone(dto.getUsuarioId(), dto.getTelefone());
        if (existeTelefone) {
            throw new IllegalArgumentException("Já existe um contato com este telefone para o usuário.");
        }

        // 3️⃣ Criar entidade
        ContatoEmergencia contato = new ContatoEmergencia();
        contato.setUsuario(usuario);
        contato.setNome(dto.getNome());
        contato.setTelefone(dto.getTelefone());
        contato.setRelacao(dto.getRelacao());

        // 4️⃣ Persistir
        return repository.save(contato);
    }

    // ======================
    // ATUALIZAR USANDO DTO (NOVO MÉTODO)
    // ======================
    @Transactional
    public ContatoEmergencia atualizar(Long id, ContatoEmergenciaDTO dto) {

        // 1️⃣ Busca o contato existente
        ContatoEmergencia contato = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));

        Long usuarioId = contato.getUsuario().getId(); // 🔥 Sempre use o do banco

        // 2️⃣ Verifica duplicidade de telefone (somente se for alterar)
        boolean telefoneJaExiste = repository.existsByUsuarioIdAndTelefone(usuarioId, dto.getTelefone());

        if (telefoneJaExiste && !contato.getTelefone().equals(dto.getTelefone())) {
            throw new IllegalArgumentException("Já existe outro contato com este telefone para o usuário.");
        }

        // 3️⃣ Atualiza dados
        contato.setNome(dto.getNome());
        contato.setTelefone(dto.getTelefone());
        contato.setRelacao(dto.getRelacao());

        // 4️⃣ Salva
        return repository.save(contato);
    }


    // ======================
    // EXCLUIR
    // ======================
    @Transactional
    public void excluir(Long id) {
        ContatoEmergencia contato = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));
        repository.delete(contato);
    }
}
