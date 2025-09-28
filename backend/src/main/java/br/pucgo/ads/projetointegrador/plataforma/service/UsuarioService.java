package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.dto.UsuarioRequestDTO;
import br.pucgo.ads.projetointegrador.plataforma.dto.UsuarioResponseDTO;
import br.pucgo.ads.projetointegrador.plataforma.entity.Usuario;
import br.pucgo.ads.projetointegrador.plataforma.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    
    /**
     * Listar todos os usuários
     */
    public List<UsuarioResponseDTO> listarTodos() {
        log.info("Buscando todos os usuários");
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Listar usuários ativos
     */
    public List<UsuarioResponseDTO> listarAtivos() {
        log.info("Buscando usuários ativos");
        return usuarioRepository.findByAtivoTrue()
                .stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Buscar usuário por ID
     */
    public UsuarioResponseDTO buscarPorId(Long id) {
        log.info("Buscando usuário com ID: {}", id);
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        return new UsuarioResponseDTO(usuario);
    }
    
    /**
     * Buscar usuário por email
     */
    public UsuarioResponseDTO buscarPorEmail(String email) {
        log.info("Buscando usuário com email: {}", email);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
        return new UsuarioResponseDTO(usuario);
    }
    
    /**
     * Buscar usuários por tipo
     */
    public List<UsuarioResponseDTO> buscarPorTipo(Usuario.TipoUsuario tipoUsuario) {
        log.info("Buscando usuários do tipo: {}", tipoUsuario);
        return usuarioRepository.findByTipoUsuario(tipoUsuario)
                .stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Buscar usuários por nome
     */
    public List<UsuarioResponseDTO> buscarPorNome(String nome) {
        log.info("Buscando usuários com nome contendo: {}", nome);
        return usuarioRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Criar novo usuário
     */
    @Transactional
    public UsuarioResponseDTO criar(UsuarioRequestDTO request) {
        log.info("Criando novo usuário com email: {}", request.getEmail());
        
        // Verificar se email já existe
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe usuário com este email: " + request.getEmail());
        }
        
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());
        usuario.setDataNascimento(request.getDataNascimento());
        usuario.setTipoUsuario(request.getTipoUsuario());
        usuario.setAtivo(request.getAtivo());
        
        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        log.info("Usuário criado com sucesso. ID: {}", usuarioSalvo.getId());
        
        return new UsuarioResponseDTO(usuarioSalvo);
    }
    
    /**
     * Atualizar usuário
     */
    @Transactional
    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO request) {
        log.info("Atualizando usuário com ID: {}", id);
        
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        
        // Verificar se email já existe para outro usuário
        if (usuarioRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new RuntimeException("Já existe outro usuário com este email: " + request.getEmail());
        }
        
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());
        usuario.setDataNascimento(request.getDataNascimento());
        usuario.setTipoUsuario(request.getTipoUsuario());
        usuario.setAtivo(request.getAtivo());
        
        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        log.info("Usuário atualizado com sucesso. ID: {}", usuarioAtualizado.getId());
        
        return new UsuarioResponseDTO(usuarioAtualizado);
    }
    
    /**
     * Desativar usuário (soft delete)
     */
    @Transactional
    public void desativar(Long id) {
        log.info("Desativando usuário com ID: {}", id);
        
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
        
        log.info("Usuário desativado com sucesso. ID: {}", id);
    }
    
    /**
     * Deletar usuário permanentemente
     */
    @Transactional
    public void deletar(Long id) {
        log.info("Deletando usuário com ID: {}", id);
        
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        
        usuarioRepository.deleteById(id);
        log.info("Usuário deletado com sucesso. ID: {}", id);
    }
}