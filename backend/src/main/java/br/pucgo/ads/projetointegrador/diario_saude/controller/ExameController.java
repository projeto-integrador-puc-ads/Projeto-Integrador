package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.ExameDTO;
import br.pucgo.ads.projetointegrador.diario_saude.service.ExameService;

@RestController
@RequestMapping(value = "/api/diario_saude/exames")
public class ExameController {

    @Autowired
    private ExameService exameService;

    @GetMapping
    public List<ExameDTO> listarTodos(){
        return exameService.listarTodos();
    }

    @PostMapping
    public void inserir(@RequestBody ExameDTO exame){
        exameService.inserir(exame);
    }

    @PutMapping
    public ExameDTO alterar(@RequestBody ExameDTO exame){
        return exameService.alterar(exame);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        exameService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ExameDTO buscarPorId(@PathVariable Long id){
        return exameService.buscarPorId(id);
    }
}
