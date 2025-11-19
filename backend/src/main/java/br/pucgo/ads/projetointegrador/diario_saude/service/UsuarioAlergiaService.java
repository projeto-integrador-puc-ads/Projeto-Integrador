package br.pucgo.ads.projetointegrador.diario_saude.service;

import br.pucgo.ads.projetointegrador.diario_saude.entity.AlergiaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioAlergiaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.AlergiaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioAlergiaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioAlergiaService {

    @Autowired
    private UsuarioAlergiaRepository usuarioAlergiaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AlergiaRepository alergiaRepository;

    public UsuarioAlergiaEntity adicionar(Long usuarioId, Long alergiaId) {

        if (usuarioAlergiaRepository.existsByUsuario_IdUsuarioAndAlergia_Id(usuarioId, alergiaId)) {
            throw new RuntimeException("Alergia já cadastrada para este usuário.");
        }

        UsuarioEntity usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        AlergiaEntity alergia = alergiaRepository.findById(alergiaId)
                .orElseThrow(() -> new RuntimeException("Alergia não encontrada"));

        return usuarioAlergiaRepository.save(new UsuarioAlergiaEntity(usuario, alergia));
    }

    public List<UsuarioAlergiaEntity> listarPorUsuario(Long usuarioId) {
        return usuarioAlergiaRepository.findByUsuario_IdUsuario(usuarioId);
    }

    public void remover(Long usuarioId, Long alergiaId) {

        UsuarioAlergiaEntity entidade =
                usuarioAlergiaRepository.findByUsuario_IdUsuarioAndAlergia_Id(usuarioId, alergiaId)
                        .orElseThrow(() -> new RuntimeException("Alergia não associada ao usuário."));

        usuarioAlergiaRepository.delete(entidade);
    }
}
