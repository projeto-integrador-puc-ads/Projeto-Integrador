package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.MedicoRepository;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    public List<MedicoDTO> listarTodos(){
        return medicoRepository.findAll().stream().map(MedicoDTO::new).toList();
    }

    public void inserir(MedicoDTO medico){
        medicoRepository.save(new MedicoEntity(medico));
    }

    public MedicoDTO alterar(MedicoDTO medico){
        return new MedicoDTO(medicoRepository.save(new MedicoEntity(medico)));
    }

    public void excluir(Long id){
        medicoRepository.delete(medicoRepository.findById(id).get());
    }

    public MedicoDTO buscarPorId(Long id){
        return new MedicoDTO(medicoRepository.findById(id).get());
    }
}
