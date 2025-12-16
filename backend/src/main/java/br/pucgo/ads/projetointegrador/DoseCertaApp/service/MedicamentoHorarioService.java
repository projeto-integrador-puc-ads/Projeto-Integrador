package br.pucgo.ads.projetointegrador.DoseCertaApp.service;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoHorarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MedicamentoHorarioService {

    private final MedicamentoHorarioRepository repository;

    public MedicamentoHorarioService(MedicamentoHorarioRepository repository) {
        this.repository = repository;
    }

    public List<MedicamentoHorario> listarPorMedicamento(Long medicamentoId) {
        List<MedicamentoHorario> horarios = repository.findByMedicamentoIdOrderByHorarioAsc(medicamentoId);
        horarios.forEach(MedicamentoHorario::resetarSeNovoDia);
        return horarios;
    }

    @Transactional
    public MedicamentoHorario marcarTomado(Long id, Boolean tomado) {
        MedicamentoHorario horario = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Horário não encontrado"));

        horario.resetarSeNovoDia();
        horario.setTomadoHoje(tomado != null ? tomado : true);
        horario.setDataUltimaAtualizacao(LocalDate.now());

        return repository.save(horario);
    }
}
