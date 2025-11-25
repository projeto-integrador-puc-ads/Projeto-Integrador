package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.dto.ExercicioRecomendadoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExercicioRecomendadoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.ExercicioRecomendadoRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoMedicaRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExercicioRecomendadoService {

    @Autowired
    private ExercicioRecomendadoRepository exercicioRepo;

    @Autowired
    private PrescricaoMedicaRepository prescricaoRepo;

    public ExercicioRecomendadoEntity criar(ExercicioRecomendadoDTO dto) {
        Optional<PrescricaoMedicaEntity> prescricaoOpt = prescricaoRepo.findById(dto.getIdPrescricao());

        if (!prescricaoOpt.isPresent()) {
            throw new RuntimeException("Prescrição não encontrada");
        }

        PrescricaoMedicaEntity prescricao = prescricaoOpt.get();

        ExercicioRecomendadoEntity entity = new ExercicioRecomendadoEntity();
        entity.setDescricao(dto.getDescricao());
        entity.setPrescricaoMedica(prescricao);

        return exercicioRepo.save(entity);
    }

    public void deletar(Long id) {
        exercicioRepo.deleteById(id);
    }

    @Transactional(readOnly = true) // Garante que a transação esteja ativa
    public java.util.List<ExercicioRecomendadoEntity> listarPorPrescricao(Long idPrescricao) {
        
        PrescricaoMedicaEntity prescricao = prescricaoRepo.findByIdWithExercicios(idPrescricao)
            .orElseThrow(() -> new RuntimeException("Prescrição não encontrada"));

        return new java.util.ArrayList<>(prescricao.getExerciciosRecomendados());
    }
}
