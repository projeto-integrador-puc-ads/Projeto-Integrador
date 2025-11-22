package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicaDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.MedicoRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoMedicaRepository;

@Service
public class PrescricaoMedicaService {

    @Autowired
    private PrescricaoMedicaRepository repo;

    @Autowired
    private MedicoRepository medicoRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    public List<PrescricaoMedicaDTO> listarTodos(){
        return repo.findAll().stream().map(PrescricaoMedicaDTO::new).toList();
    }

    public PrescricaoMedicaDTO inserir(PrescricaoMedicaDTO dto) {

        PrescricaoMedicaEntity entity = new PrescricaoMedicaEntity(dto);

        entity.setMedico(medicoRepo.findById(dto.getId_medico())
            .orElseThrow(() -> new RuntimeException("Médico não encontrado")));

        entity.setUsuario(usuarioRepo.findById(dto.getId_usuario())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado")));

        entity.setData_prescricao(LocalDate.now().toString());

        return new PrescricaoMedicaDTO(repo.save(entity));
    }

    public PrescricaoMedicaDTO alterar(PrescricaoMedicaDTO dto){
        return inserir(dto);
    }

    public void excluir(Long id){
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PrescricaoMedicaDTO> listarPorUsuario(Long idUsuario){
        return repo.findByUsuario(idUsuario).stream().map(PrescricaoMedicaDTO::new).toList();
    }
}
