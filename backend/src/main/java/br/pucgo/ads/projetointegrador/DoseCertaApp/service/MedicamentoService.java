package br.pucgo.ads.projetointegrador.DoseCertaApp.service;

import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.*;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.*;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.*;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class MedicamentoService {

    private final MedicamentoRepository medicamentoRepository;
    private final MedicamentoHorarioRepository horarioRepository;
    private final RegistroTomadaRepository registroRepository;
    private final UserRepository userRepository;
    private final ContatoEmergenciaRepository contatoRepository;
    private final MedicamentoAnvisaRepository anvisaRepository;

    public MedicamentoService(
            MedicamentoRepository medicamentoRepository,
            MedicamentoHorarioRepository horarioRepository,
            RegistroTomadaRepository registroRepository,
            UserRepository userRepository,
            ContatoEmergenciaRepository contatoRepository,
            MedicamentoAnvisaRepository anvisaRepository
    ) {
        this.medicamentoRepository = medicamentoRepository;
        this.horarioRepository = horarioRepository;
        this.registroRepository = registroRepository;
        this.userRepository = userRepository;
        this.contatoRepository = contatoRepository;
        this.anvisaRepository = anvisaRepository;
    }

    // ===========================================================
    // LISTAGEM
    // ===========================================================
    public List<Medicamento> listarTodos() {
        return medicamentoRepository.findAll();
    }

    public List<Medicamento> listarPorUsuario(Long usuarioId) {
        validarUsuario(usuarioId);
        return medicamentoRepository.findByUsuarioId(usuarioId);
    }

    // ===========================================================
    // DETALHAMENTO
    // ===========================================================
    public MedicamentoResponseDTO detalharMedicamento(Long medicamentoId) {

        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado!"));

        List<MedicamentoHorario> horarios =
                horarioRepository.findByMedicamentoIdOrderByHorarioAsc(medicamentoId);

        List<RegistroTomada> registrosDoDia =
                registroRepository.findByMedicamentoIdAndDataPrevista(
                        medicamentoId,
                        LocalDate.now()
                );

        return new MedicamentoResponseDTO(medicamento, horarios, registrosDoDia);
    }

    // ===========================================================
    // CADASTRAR VIA DTO — COM AJUSTE DE PROXIMA EXECUCAO
    // ===========================================================
    @Transactional
    public Medicamento salvarFromDTO(MedicamentoCreateDTO dto, Long anvisaId) {

        User usuario = validarUsuario(dto.getUsuarioId());

        Medicamento medicamento = new Medicamento();
        medicamento.setUsuario(usuario);

        // ANVISA
        MedicamentoAnvisa anvisa = anvisaRepository.findById(anvisaId)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento ANVISA não encontrado!"));
        medicamento.setMedicamentoAnvisa(anvisa);

        medicamento.setTipoDosagem(dto.getTipoDosagem());
        medicamento.setDoseDiaria(dto.getDoseDiaria());

        if ("mg".equals(dto.getTipoDosagem()))
            medicamento.setQuantidadeCartela(dto.getQuantidadeCartela());
        else
            medicamento.setTotalFrasco(dto.getTotalFrasco());

        // TARJA
        if (dto.getTarja() != null) {
            medicamento.setTarja(dto.getTarja());
        }

        // CONTATOS — validar tarja preta
        if (dto.getTarja() == TarjaTipo.PRETA &&
                (dto.getContatosEmergenciaIds() == null || dto.getContatosEmergenciaIds().isEmpty())) {

            throw new IllegalArgumentException("Tarja preta exige ao menos 1 contato de emergência.");
        }

        List<ContatoEmergencia> contatos = dto.getContatosEmergenciaIds() != null
                ? dto.getContatosEmergenciaIds().stream()
                .map(id -> contatoRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado: " + id)))
                .toList()
                : List.of();

        medicamento.setContatosEmergencia(contatos);
        medicamento.setContatarEmergencia(!contatos.isEmpty());

        // ===========================================================
        // HORÁRIOS — COM DATA DE EXECUÇÃO HOJE/AMANHÃ
        // ===========================================================
        if (dto.getHorarios() != null) {
            List<MedicamentoHorario> horarios = dto.getHorarios().stream()
                    .map(h -> {
                        MedicamentoHorario mh = new MedicamentoHorario(medicamento, h.getHorario());
                        mh.calcularProximaExecucao(); // 🔥 AQUI É O AJUSTE
                        return mh;
                    })
                    .toList();
            medicamento.setHorarios(horarios);
        }

        medicamento.setDataInicio(LocalDate.now());
        medicamento.setDataFim(LocalDate.now().plusDays(medicamento.calcularDias() - 1));

        return medicamentoRepository.save(medicamento);
    }

    // ===========================================================
    // ATUALIZAR VIA DTO — COM AJUSTE DE PROXIMA EXECUCAO
    // ===========================================================
    @Transactional
    public MedicamentoResponseDTO atualizarFromDTO(Long id, MedicamentoUpdateDTO dto) {

        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado!"));

        // ANVISA
        if (dto.getAnvisaId() != null) {
            MedicamentoAnvisa anvisa = anvisaRepository.findById(dto.getAnvisaId())
                    .orElseThrow(() -> new EntityNotFoundException("Medicamento ANVISA não encontrado!"));
            medicamento.setMedicamentoAnvisa(anvisa);
        }

        medicamento.setTipoDosagem(dto.getTipoDosagem());
        medicamento.setDoseDiaria(dto.getDoseDiaria());

        if ("mg".equals(dto.getTipoDosagem()))
            medicamento.setQuantidadeCartela(dto.getQuantidadeCartela());
        else
            medicamento.setTotalFrasco(dto.getTotalFrasco());

        // TARJA
        if (dto.getTarja() != null) {
            medicamento.setTarja(TarjaTipo.valueOf(dto.getTarja().toUpperCase()));
        }

        // CONTATOS
        List<ContatoEmergencia> contatos = (dto.getContatosEmergenciaIds() != null)
                ? dto.getContatosEmergenciaIds().stream()
                .map(idContato -> contatoRepository.findById(idContato)
                        .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado: " + idContato)))
                .toList()
                : List.of();

        medicamento.setContatosEmergencia(contatos);
        medicamento.setContatarEmergencia(!contatos.isEmpty());

        // ============================================================
        // HORÁRIOS — AGORA RECRIANDO COM PRÓXIMA EXECUÇÃO
        // ============================================================
        List<MedicamentoHorario> horariosAtuais = medicamento.getHorarios();

        if (horariosAtuais == null) {
            horariosAtuais = new ArrayList<>();
            medicamento.setHorarios(horariosAtuais);
        } else {
            horariosAtuais.clear();
        }

        for (HorarioDTO h : dto.getHorarios()) {
            MedicamentoHorario mh = new MedicamentoHorario(medicamento, h.getHorario());
            mh.calcularProximaExecucao(); // 🔥 AQUI TAMBÉM
            horariosAtuais.add(mh);
        }

        medicamento.setDataInicio(LocalDate.now());
        medicamento.setDataFim(LocalDate.now().plusDays(medicamento.calcularDias() - 1));

        medicamentoRepository.save(medicamento);

        return detalharMedicamento(medicamento.getId());
    }

    // ===========================================================
    // EXCLUIR
    // ===========================================================
    @Transactional
    public void excluir(Long id) {
        if (!medicamentoRepository.existsById(id))
            throw new EntityNotFoundException("Medicamento não encontrado!");

        medicamentoRepository.deleteById(id);
    }

    // ===========================================================
    // UTILITÁRIOS
    // ===========================================================
    private User validarUsuario(Long usuarioId) {
        return userRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));
    }

    public List<MedicamentoResponseDTO> listarPorUsuarioComDetalhes(Long usuarioId) {

        validarUsuario(usuarioId);

        return medicamentoRepository.findByUsuarioId(usuarioId).stream()
                .map(m -> new MedicamentoResponseDTO(
                        m,
                        horarioRepository.findByMedicamentoIdOrderByHorarioAsc(m.getId()),
                        registroRepository.findByMedicamentoIdAndDataPrevista(
                                m.getId(),
                                LocalDate.now()
                        )
                ))
                .toList();
    }
}
