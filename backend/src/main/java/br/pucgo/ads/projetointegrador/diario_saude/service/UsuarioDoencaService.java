package br.pucgo.ads.projetointegrador.diario_saude.service;

import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.exception.UsuarioDoencaAlreadyExistsException;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioDoencasEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.DoencasEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioDoencaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.DoencaRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDoencaService {

    @Autowired
    private UsuarioDoencaRepository usuarioDoencaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DoencaRepository doencaRepository;

    public UsuarioDoencasEntity adicionarDoenca(Long usuarioId, Long doencaId) {
        if (usuarioDoencaRepository.existsByUsuario_IdUsuarioAndDoenca_Id(usuarioId, doencaId)) {
            throw new UsuarioDoencaAlreadyExistsException(
                "Este usuário já possui esta doença cadastrada."
            );
        }

        UsuarioEntity usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        DoencasEntity doenca = doencaRepository.findById(doencaId)
                .orElseThrow(() -> new RuntimeException("Doença não encontrada"));

        UsuarioDoencasEntity relacao = new UsuarioDoencasEntity(usuario, doenca);

        return usuarioDoencaRepository.save(relacao);
    }


    public List<UsuarioDoencasEntity> listarDoencasPorUsuario(Long usuarioId) {
        return usuarioDoencaRepository.findByUsuario_IdUsuario(usuarioId);
    }
    @Transactional
    public void removerDoenca(Long usuarioId, Long doencaId) {
        usuarioDoencaRepository.deleteByUsuario_IdUsuarioAndDoenca_Id(usuarioId, doencaId);
    }

}
