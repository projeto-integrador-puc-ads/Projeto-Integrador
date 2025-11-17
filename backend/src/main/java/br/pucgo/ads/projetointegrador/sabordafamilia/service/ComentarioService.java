package br.pucgo.ads.projetointegrador.sabordafamilia.service;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Comentario;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.ComentarioRepository;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.ReceitaRepository; // IMPORTAR
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.UsuarioRepository; // IMPORTAR
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final ReceitaRepository receitaRepository; // <-- INJETAR
    private final UsuarioRepository usuarioRepository; // <-- INJETAR

    // Atualize o construtor para injetar os outros repositórios
    public ComentarioService(ComentarioRepository comentarioRepository, 
                             ReceitaRepository receitaRepository, 
                             UsuarioRepository usuarioRepository) {
        this.comentarioRepository = comentarioRepository;
        this.receitaRepository = receitaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // --- ESTE É O NOVO MÉTODO QUE FALTAVA ---
    @Transactional
    public Comentario adicionar(Long receitaId, Long usuarioId, Comentario comentario) {
        // 1. Busca a Receita no banco
        Receita receita = receitaRepository.findById(receitaId)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada com id: " + receitaId));

        // 2. Busca o Usuário no banco
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + usuarioId));

        // 3. "Amarra" as entidades ao novo comentário
        comentario.setReceita(receita);
        comentario.setUsuario(usuario);
        
        // 4. Agora sim pode salvar, pois receita e usuario não são null
        return comentarioRepository.save(comentario);
    }
    
    // Este método está correto (assumindo que ComentarioRepository tenha findByReceitaIdWithUsuario)
    @Transactional(readOnly = true)
    public List<Comentario> listarPorReceita(Long receitaId) {
        return comentarioRepository.findByReceitaIdWithUsuario(receitaId); 
    }
}