package br.pucgo.ads.projetointegrador.eldercare.controller;

import br.pucgo.ads.projetointegrador.eldercare.dto.CriarIdosoDTO;
import br.pucgo.ads.projetointegrador.eldercare.dto.IdosoDTO;
import br.pucgo.ads.projetointegrador.eldercare.mapper.EldercareMapper;
import br.pucgo.ads.projetointegrador.eldercare.service.IdosoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eldercare/idosos")
public class IdosoController {

    private final IdosoService service;
    public IdosoController(IdosoService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IdosoDTO criar(@Valid @RequestBody CriarIdosoDTO dto) {
        return EldercareMapper.toDTO(service.criar(dto));
    }

    @GetMapping
    public List<IdosoDTO> listar() {
        return service.listar().stream().map(EldercareMapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public IdosoDTO buscar(@PathVariable Long id) {
        return EldercareMapper.toDTO(service.buscar(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        service.remover(id);
    }
}
