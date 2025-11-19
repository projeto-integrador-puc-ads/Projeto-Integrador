package br.pucgo.ads.projetointegrador.diario_saude.controller;

import br.pucgo.ads.projetointegrador.diario_saude.dto.AlergiaDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.AlergiaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.service.AlergiaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diario_saude/alergia")
public class AlergiaController {

    @Autowired
    private AlergiaService service;

    @PostMapping("/criar")
    public AlergiaEntity criar(@RequestBody AlergiaDTO dto) {

        AlergiaEntity alergia = new AlergiaEntity();

        // JSON → ENTITY
        alergia.setCodigo(dto.getCode());
        alergia.setNome(dto.getDisplay());

        // Extrair "categoria" de property.valueCode
        String categoria = null;

        if (dto.getProperty() != null) {
            for (AlergiaDTO.PropertyDTO prop : dto.getProperty()) {
                if ("category".equalsIgnoreCase(prop.getCode())) {
                    categoria = prop.getValueCode();
                }
            }
        }

        alergia.setCategoria(categoria);

        return service.criarAlergia(alergia);
    }

    @GetMapping("/listar")
    public List<AlergiaEntity> listar() {
        return service.listar();
    }
    @PostMapping("/criar-multiplas")
    public List<AlergiaEntity> criarMultiplas(@RequestBody List<AlergiaDTO> alergias) {
        return service.criarMultiplas(alergias);
    }
}
