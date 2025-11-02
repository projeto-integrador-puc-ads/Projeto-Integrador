package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicamentoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicamentoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.MedicamentoRepository;

@Service
public class MedicamentoService {

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    public List<MedicamentoDTO> listarTodos(){
        return medicamentoRepository.findAll().stream().map(MedicamentoDTO::new).toList();
    }

    public void inserir(MedicamentoDTO medicamento){
        medicamentoRepository.save(new MedicamentoEntity(medicamento));
    }

    public MedicamentoDTO alterar(MedicamentoDTO medicamento){
        return new MedicamentoDTO(medicamentoRepository.save(new MedicamentoEntity(medicamento)));
    }

    public void excluir(Long id){
        medicamentoRepository.delete(medicamentoRepository.findById(id).get());
    }

    public MedicamentoDTO buscarPorId(Long id){
        return new MedicamentoDTO(medicamentoRepository.findById(id).get());
    }
}
