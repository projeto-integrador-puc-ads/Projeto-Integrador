package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.diario_saude.dto.ExercicioRecomendadoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExercicioRecomendadoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.service.ExercicioRecomendadoService;

@RestController
@RequestMapping("/api/diario_saude/exercicio-recomendado")
@CrossOrigin(origins = "*")
public class ExercicioRecomendadoController {

    @Autowired
    private ExercicioRecomendadoService service;

    @PostMapping
    public ExercicioRecomendadoEntity criar(@RequestBody ExercicioRecomendadoDTO dto) {
        return service.criar(dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @GetMapping("/prescricao/{idPrescricao}")
    public List<ExercicioRecomendadoEntity> listarPorPrescricao(@PathVariable Long idPrescricao) {
        return service.listarPorPrescricao(idPrescricao);
    }
}
