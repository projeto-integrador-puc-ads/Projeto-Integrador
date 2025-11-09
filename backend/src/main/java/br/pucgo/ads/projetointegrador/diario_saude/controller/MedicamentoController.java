package br.pucgo.ads.projetointegrador.diario_saude.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicamentoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicamentoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.MedicamentoRepository;
import br.pucgo.ads.projetointegrador.diario_saude.service.MedicamentoService;

@RestController
@RequestMapping(value = "/api/diario_saude/medicamentos")
public class MedicamentoController {

    @Autowired
    private MedicamentoService medicamentoService;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @GetMapping
    public List<MedicamentoDTO> listarTodos(){
        return medicamentoService.listarTodos();
    }

    @PostMapping
    public void inserir(@RequestBody MedicamentoDTO medicamento){
        medicamentoService.inserir(medicamento);
    }

    @PostMapping("/import")
    public ResponseEntity<String> importarCSV(@RequestParam("file") MultipartFile file) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            br.readLine(); // pula cabeçalho

            String linha;
            while ((linha = br.readLine()) != null) {
                String[] col = linha.split(";");
                if(col.length < 11) continue;
                
                String nome = col[1];
                String principio_ativo = col[10];
                String empresa = col[8];
                String classe = col[7];
                String numero_registro = col[4];

                // Evitar duplicar
                if (!medicamentoRepository.existsByNome(nome)) {
                    medicamentoRepository.save(
                        new MedicamentoEntity(nome, principio_ativo, empresa, classe, numero_registro)
                    );
                }
            }

            return ResponseEntity.ok("Importação concluída.");
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Erro: " + e.getMessage());
        }
    }

    @PutMapping
    public MedicamentoDTO alterar(@RequestBody MedicamentoDTO medicamento){
        return medicamentoService.alterar(medicamento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        medicamentoService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public MedicamentoDTO buscarPorId(@PathVariable Long id){
        return medicamentoService.buscarPorId(id);
    }
}
