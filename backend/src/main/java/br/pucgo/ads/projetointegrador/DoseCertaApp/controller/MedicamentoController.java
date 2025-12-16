package br.pucgo.ads.projetointegrador.DoseCertaApp.controller;

import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.MedicamentoCreateDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.MedicamentoCriadoDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.MedicamentoResponseDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.MedicamentoUpdateDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.Medicamento;
import br.pucgo.ads.projetointegrador.DoseCertaApp.service.MedicamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

    private final MedicamentoService service;

    public MedicamentoController(MedicamentoService service) {
        this.service = service;
    }

    // ================================================================
    // LISTAGENS
    // ================================================================
    @GetMapping
    public ResponseEntity<List<Medicamento>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Medicamento>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoResponseDTO> detalhar(@PathVariable Long id) {
        return ResponseEntity.ok(service.detalharMedicamento(id));
    }

    @GetMapping("/usuario/{usuarioId}/detalhes")
    public ResponseEntity<List<MedicamentoResponseDTO>> listarPorUsuarioDetalhado(
            @PathVariable Long usuarioId
    ) {
        return ResponseEntity.ok(service.listarPorUsuarioComDetalhes(usuarioId));
    }


    // ================================================================
    // CRIAR
    // ================================================================
    @PostMapping
    public ResponseEntity<MedicamentoCriadoDTO> criar(
            @RequestBody MedicamentoCreateDTO dto,
            @RequestParam Long anvisaId
    ) {
        Medicamento salvo = service.salvarFromDTO(dto, anvisaId);

        return ResponseEntity.ok(
                new MedicamentoCriadoDTO(
                        salvo.getId(),
                        salvo.getMedicamentoAnvisa().getNomeProduto(),
                        salvo.getTarja().name()
                )
        );
    }


    // ================================================================
    // ATUALIZAR  (USANDO MedicamentoUpdateDTO)
    // ================================================================
    @PutMapping("/{id}")
    public ResponseEntity<MedicamentoResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody MedicamentoUpdateDTO dto
    ) {
        MedicamentoResponseDTO atualizado = service.atualizarFromDTO(id, dto);
        return ResponseEntity.ok(atualizado);
    }


    // ================================================================
    // DELETAR
    // ================================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
