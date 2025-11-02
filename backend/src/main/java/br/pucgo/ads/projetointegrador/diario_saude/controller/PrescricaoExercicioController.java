package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoExercicioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.service.PrescricaoExercicioService;

@RestController
@RequestMapping(value = "/prescricao_exercicio")
public class PrescricaoExercicioController {

    @Autowired
    private PrescricaoExercicioService service;

    @GetMapping
    public List<PrescricaoExercicioDTO> listarTodos(){
        return service.listarTodos();
    }

    @PostMapping
    public void inserir(@RequestBody PrescricaoExercicioDTO dto){
        service.inserir(dto);
    }

    @PutMapping
    public PrescricaoExercicioDTO alterar(@RequestBody PrescricaoExercicioDTO dto){
        return service.alterar(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        service.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public PrescricaoExercicioDTO buscarPorId(@PathVariable Long id){
        return service.buscarPorId(id);
    }
}
