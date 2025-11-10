package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicaDTO;
import br.pucgo.ads.projetointegrador.diario_saude.service.PrescricaoMedicaService;

@RestController
@RequestMapping("/api/diario_saude/prescricao")
public class PrescricaoMedicaController {

    @Autowired
    private PrescricaoMedicaService service;

    @GetMapping
    public List<PrescricaoMedicaDTO> listarTodos(){
        return service.listarTodos();
    }

    @PostMapping
    public PrescricaoMedicaDTO inserir(@RequestBody PrescricaoMedicaDTO dto){
        return service.inserir(dto);
    }

    @PutMapping
    public PrescricaoMedicaDTO alterar(@RequestBody PrescricaoMedicaDTO dto){
        return service.alterar(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        service.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<PrescricaoMedicaDTO>> listarPorUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(service.listarPorUsuario(id));
    }
}
