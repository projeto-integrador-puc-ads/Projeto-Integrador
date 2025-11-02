package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoExameEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoExameRepository;

@Service
public class PrescricaoExameService {

    @Autowired
    private PrescricaoExameRepository repository;

    public PrescricaoExameEntity save(PrescricaoExameEntity entity){
        return repository.save(entity);
    }

    public List<PrescricaoExameEntity> findAll(){
        return repository.findAll();
    }

    public void delete(long id){
        repository.deleteById(id);
    }
}
