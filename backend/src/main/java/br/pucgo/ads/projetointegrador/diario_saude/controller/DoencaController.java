package br.pucgo.ads.projetointegrador.diario_saude.controller;

import br.pucgo.ads.projetointegrador.diario_saude.entity.DoencasEntity;
import br.pucgo.ads.projetointegrador.diario_saude.service.DoencaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/diario_saude/doencas")
public class DoencaController {

    @Autowired
    private DoencaService service;

    @PostMapping("/criar")
    public DoencasEntity criarDoenca(@RequestBody DoencasEntity doenca) {
        return service.criarDoenca(doenca);
    }

    @GetMapping("/listar")
    public List<DoencasEntity> listar() {
        return service.listarDoencas();
    }

    @PostMapping("/importar-csv")
    public List<DoencasEntity> importar(@RequestParam("arquivo") MultipartFile arquivo) {
        return service.importarCSV(arquivo);
    }
}
