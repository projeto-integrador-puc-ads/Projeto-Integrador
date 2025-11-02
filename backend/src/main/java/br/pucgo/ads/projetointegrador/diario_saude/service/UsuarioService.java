package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.diario_saude.dto.UsuarioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;

@Service
public class UsuarioService {
    @Autowired//Instanciar automaticamente
    private UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> listarTodos(){
        List<UsuarioEntity> usuarios = usuarioRepository.findAll();
        return usuarios.stream().map(UsuarioDTO::new).toList();//Converte a lista de usuarios para usuarioDTO
    }

    public void inserir(UsuarioDTO usuario){
        UsuarioEntity usuarioEntity = new UsuarioEntity(usuario);
        usuarioRepository.save(usuarioEntity);
    }

    public UsuarioDTO alterar(UsuarioDTO usuario){
        UsuarioEntity usuarioEntity = new UsuarioEntity(usuario);
        return new UsuarioDTO(usuarioRepository.save(usuarioEntity));
    }

    public void excluir(Long id){
        UsuarioEntity usuario = usuarioRepository.findById(id).get();
        usuarioRepository.delete(usuario);
    }

    public UsuarioDTO buscarPorId(Long id){
        return new UsuarioDTO(usuarioRepository.findById(id).get());
    }
}
