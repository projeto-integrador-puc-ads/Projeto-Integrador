package br.pucgo.ads.projetointegrador.eldercare.service;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_dia_plano;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_exercicio;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_participante;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_plano;
import br.pucgo.ads.projetointegrador.eldercare.dto.PlanoGeradoResponse;
import br.pucgo.ads.projetointegrador.eldercare.repository.DiaPlanoRepository;
import br.pucgo.ads.projetointegrador.eldercare.repository.ItemPlanoRepository;
import br.pucgo.ads.projetointegrador.eldercare.repository.PlanoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlanoService {

    private final PlanoRepository planoRepo;
    private final DiaPlanoRepository diaRepo;
    private final ItemPlanoRepository itemRepo;

    public PlanoService(PlanoRepository planoRepo,
                        DiaPlanoRepository diaRepo,
                        ItemPlanoRepository itemRepo) {
        this.planoRepo = planoRepo;
        this.diaRepo = diaRepo;
        this.itemRepo = itemRepo;
    }

    /** Usado pelo PlanoController: buscar plano por ID */
    @Transactional(readOnly = true)
    public ex_plano buscar(UUID id) {
        return planoRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano não encontrado"));
    }

    /** Usado pelo PlanoController: listar planos de um participante */
    @Transactional(readOnly = true)
    public List<ex_plano> listarPorParticipante(UUID participanteId) {
        return planoRepo.findByParticipante_IdOrderByMesDesc(participanteId);
    }

    /** Monta o JSON que o front exibe (resumo + dias + atividades) */
    @Transactional(readOnly = true)
    public PlanoGeradoResponse montarPlanoGeradoResponse(UUID planoId) {
        ex_plano plano = buscar(planoId);
        ex_participante p = plano.getParticipante();

        String nome = Optional.ofNullable(p.getNome()).orElse("—");

        Integer idade = null;
        if (p.getNascimento() != null) {
            idade = Period.between(p.getNascimento(), LocalDate.now()).getYears();
        }

        String sexo = Optional.ofNullable(p.getSexo()).orElse("—");
        Integer semanas = 4; // fixo para o protótipo
        Integer diasSemana = plano.getFreqSemana();
        Integer minDia = plano.getTempoSessaoMin();
        Integer tempoSemanalMin = (diasSemana != null && minDia != null)
                ? diasSemana * minDia
                : null;
        String nivel = Optional.ofNullable(plano.getNivel()).orElse("—");

        var diasDtos = diaRepo.findByPlano_IdOrderByDataOuOrdemAsc(plano.getId())
                .stream()
                .map(dia -> {
                    var atividades = itemRepo.findByDia_IdOrderByOrdemAsc(dia.getId())
                            .stream()
                            .map(it -> {
                                ex_exercicio ex = it.getExercicio();
                                return ex != null ? ex.getNome() : "—";
                            })
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());

                    // Aqui vai o nome do dia (SEGUNDA-FEIRA, QUARTA-FEIRA, etc)
                    String tituloDia = Optional.ofNullable(dia.getDataOuOrdem()).orElse("DIA");

                    return new PlanoGeradoResponse.DiaDTO(tituloDia, atividades);
                })
                .collect(Collectors.toList());

        return new PlanoGeradoResponse(
                nome,
                idade,
                sexo,
                semanas,
                diasSemana,
                minDia,
                tempoSemanalMin,
                nivel,
                diasDtos
        );
    }
}
