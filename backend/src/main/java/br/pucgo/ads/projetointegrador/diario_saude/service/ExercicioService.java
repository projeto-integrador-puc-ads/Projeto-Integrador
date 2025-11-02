package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.pucgo.ads.projetointegrador.diario_saude.dto.ExercicioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExercicioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.ExercicioRepository;

@Service
public class ExercicioService {

    @Autowired
    private ExercicioRepository exercicioRepository;

    public List<ExercicioDTO> listarTodos() {
        return exercicioRepository.findAll().stream().map(ExercicioDTO::new).toList();
    }

    public void inserir(ExercicioDTO dto) {
        exercicioRepository.save(new ExercicioEntity(dto));
    }

    public ExercicioDTO alterar(ExercicioDTO dto) {
        return new ExercicioDTO(exercicioRepository.save(new ExercicioEntity(dto)));
    }

    public void excluir(Long id) {
        exercicioRepository.delete(exercicioRepository.findById(id).get());
    }

    public ExercicioDTO buscarPorId(Long id) {
        return new ExercicioDTO(exercicioRepository.findById(id).get());
    }
}
