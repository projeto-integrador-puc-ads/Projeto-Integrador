package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void inserir(PrescricaoMedicaDTO dto){
        PrescricaoMedicaEntity entity = new PrescricaoMedicaEntity(dto);
        entity.setMedico(medicoRepo.findById(dto.getId_medico()).get());
        entity.setUsuario(usuarioRepo.findById(dto.getId_usuario()).get());
        repo.save(entity);
    }

    public PrescricaoMedicaDTO alterar(PrescricaoMedicaDTO dto){
        PrescricaoMedicaEntity entity = new PrescricaoMedicaEntity(dto);
        entity.setMedico(medicoRepo.findById(dto.getId_medico()).get());
        entity.setUsuario(usuarioRepo.findById(dto.getId_usuario()).get());
        return new PrescricaoMedicaDTO(repo.save(entity));
    }

    public void excluir(Long id){
        repo.delete(repo.findById(id).get());
    }
}
