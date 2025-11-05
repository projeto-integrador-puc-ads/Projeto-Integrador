package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.service.MedicoService;

@RestController
@RequestMapping(value = "/api/diario_saude/medico")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    @GetMapping
    public List<MedicoDTO> listarTodos(){
        return medicoService.listarTodos();
    }

    @PostMapping
    public void inserir(@RequestBody MedicoDTO medico){
        medicoService.inserir(medico);
    }

    @PutMapping
    public MedicoDTO alterar(@RequestBody MedicoDTO medico){
        return medicoService.alterar(medico);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        medicoService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public MedicoDTO buscarPorId(@PathVariable Long id){
        return medicoService.buscarPorId(id);
    }
}
