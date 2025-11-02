package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.ExercicioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.service.ExercicioService;

@RestController
@RequestMapping(value = "/exercicio")
public class ExercicioController {

    @Autowired
    private ExercicioService exercicioService;

    @GetMapping
    public List<ExercicioDTO> listarTodos() {
        return exercicioService.listarTodos();
    }

    @PostMapping
    public void inserir(@RequestBody ExercicioDTO dto) {
        exercicioService.inserir(dto);
    }

    @PutMapping
    public ExercicioDTO alterar(@RequestBody ExercicioDTO dto) {
        return exercicioService.alterar(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        exercicioService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ExercicioDTO buscarPorId(@PathVariable Long id) {
        return exercicioService.buscarPorId(id);
    }
}
