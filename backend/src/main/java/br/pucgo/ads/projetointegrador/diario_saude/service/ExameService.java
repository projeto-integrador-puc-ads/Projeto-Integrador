package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.pucgo.ads.projetointegrador.diario_saude.dto.ExameDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExameEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.ExameRepository;

@Service
public class ExameService {

    @Autowired
    private ExameRepository exameRepository;

    public List<ExameDTO> listarTodos(){
        return exameRepository.findAll().stream().map(ExameDTO::new).toList();
    }

    public void inserir(ExameDTO exame){
        exameRepository.save(new ExameEntity(exame));
    }

    public ExameDTO alterar(ExameDTO exame){
        return new ExameDTO(exameRepository.save(new ExameEntity(exame)));
    }

    public void excluir(Long id){
        exameRepository.delete(exameRepository.findById(id).get());
    }

    public ExameDTO buscarPorId(Long id){
        return new ExameDTO(exameRepository.findById(id).get());
    }
}
