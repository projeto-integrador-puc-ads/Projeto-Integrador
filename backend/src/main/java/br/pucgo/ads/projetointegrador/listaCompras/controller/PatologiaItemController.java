package br.pucgo.ads.projetointegrador.listaCompras.controller;

import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaItemRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaItemResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.PatologiaItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lista-compras/patologia-itens") // O caminho base da URL
@RequiredArgsConstructor
public class PatologiaItemController {

    private final PatologiaItemService service;

    @PostMapping
    public ResponseEntity<PatologiaItemResponseDTO> vincular(@RequestBody PatologiaItemRequestDTO dto) {
        PatologiaItemResponseDTO novoVinculo = service.vincular(dto);

        return ResponseEntity.ok(novoVinculo);
    }
}