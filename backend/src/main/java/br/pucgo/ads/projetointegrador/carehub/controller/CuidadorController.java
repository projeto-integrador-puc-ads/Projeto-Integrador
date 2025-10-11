package br.pucgo.ads.projetointegrador.carehub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.cuidador.CuidadorRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.cuidador.CuidadorResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.service.CuidadorService;

import java.util.List;

@RestController
@RequestMapping("/api/carehub/cuidadores")
@CrossOrigin(origins = "*")
public class CuidadorController {

    @Autowired
    private CuidadorService cuidadorService;

    @GetMapping
    public ResponseEntity<List<CuidadorResponseDTO>> listarTodos() {
        List<CuidadorResponseDTO> cuidadores = cuidadorService.listarTodos();
        return ResponseEntity.ok(cuidadores);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<CuidadorResponseDTO>> buscarComFiltros(
            @RequestParam(required = false) String localizacao,
            @RequestParam(required = false) String especialidade,
            @RequestParam(required = false) Cuidador.Disponibilidade disponibilidade,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "avaliacaoMedia") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<CuidadorResponseDTO> cuidadores = cuidadorService.buscarComFiltros(
                localizacao, especialidade, disponibilidade, pageable);
        return ResponseEntity.ok(cuidadores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuidadorResponseDTO> buscarPorId(@PathVariable Long id) {
        CuidadorResponseDTO cuidador = cuidadorService.buscarPorId(id);
        return ResponseEntity.ok(cuidador);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUIDADOR') or hasRole('ADMIN')")
    public ResponseEntity<CuidadorResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody CuidadorRequestDTO dto
    ) {
        CuidadorResponseDTO cuidador = cuidadorService.atualizar(id, dto);
        return ResponseEntity.ok(cuidador);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        cuidadorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
