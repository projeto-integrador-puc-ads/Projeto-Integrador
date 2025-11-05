package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicamentoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.service.PrescricaoMedicamentoService;

@RestController
@RequestMapping("/api/diario_saude/prescricao_medicamento")
public class PrescricaoMedicamentoController {

    @Autowired
    private PrescricaoMedicamentoService service;

    @GetMapping
    public List<PrescricaoMedicamentoDTO> listarTodos(){
        return service.listarTodos();
    }

    @PostMapping
    public void inserir(@RequestBody PrescricaoMedicamentoDTO dto){
        service.inserir(dto);
    }

    @PutMapping
    public PrescricaoMedicamentoDTO alterar(@RequestBody PrescricaoMedicamentoDTO dto){
        return service.alterar(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        service.excluir(id);
        return ResponseEntity.ok().build();
    }
}
