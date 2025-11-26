package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoExameDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExameEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoExameEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.ExameRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoMedicaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.service.PrescricaoExameService;

@RestController
@RequestMapping("/api/diario_saude/prescricao/exame")
public class PrescricaoExameController {

    @Autowired
    private PrescricaoExameService service;

    @Autowired
    private ExameRepository exameRepository;

    @Autowired
    private PrescricaoMedicaRepository prescricaoMedicaRepository;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody PrescricaoExameDTO dto){
        PrescricaoExameEntity entity = new PrescricaoExameEntity(dto);

        ExameEntity exame = exameRepository.findById(dto.getId_exame()).orElse(null);
        PrescricaoMedicaEntity prescricaoMedica = prescricaoMedicaRepository.findById(dto.getId_prescricao_medica()).orElse(null);

        if(exame == null || prescricaoMedica == null){
            return ResponseEntity.badRequest().body("Exame ou Prescrição Médica não encontrado.");
        }

        entity.setExame(exame);
        entity.setPrescricaoMedica(prescricaoMedica);

        return ResponseEntity.ok(service.save(entity));
    }


    @GetMapping
    public ResponseEntity<List<PrescricaoExameEntity>> findAll(){
        return ResponseEntity.ok(service.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id){
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
