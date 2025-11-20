package br.pucgo.ads.projetointegrador.eldercare.controller;

import br.pucgo.ads.projetointegrador.eldercare.domain.Idoso;
import br.pucgo.ads.projetointegrador.eldercare.dto.CriarIdosoDTO;
import br.pucgo.ads.projetointegrador.eldercare.dto.EnsureIdosoRequest;
import br.pucgo.ads.projetointegrador.eldercare.repository.IdosoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/eldercare/idosos")
public class IdosoController {

    private final IdosoRepository repository;

    public IdosoController(IdosoRepository repository) {
        this.repository = repository;
    }

    // =========================
    // POST /api/eldercare/idosos
    // Cadastrar idoso
    // =========================
    @PostMapping
    public ResponseEntity<Idoso> criar(@Valid @RequestBody CriarIdosoDTO req) {
        var idoso = new Idoso();
        idoso.setNome(req.nome());
        idoso.setDataNascimento(req.dataNascimento());
        idoso.setSexo(req.sexo());
        idoso.setEmail(req.email());
        idoso.setTelefone(req.telefone());

        var salvo = repository.save(idoso);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // =========================
    // POST /api/eldercare/idosos/ensure
    // SSO: encontra por e-mail; se houver duplicados, escolhe 1; se não existir, cria.
    // =========================
    @PostMapping("/ensure")
    public ResponseEntity<Idoso> ensure(@Valid @RequestBody EnsureIdosoRequest req) {
        List<Idoso> existentes = repository.findAllByEmail(req.email());

        if (!existentes.isEmpty()) {
            // escolhe 1 (ex.: o de menor id);
            Idoso escolhido = existentes.stream()
                    .min(Comparator.comparing(Idoso::getId))
                    .orElse(existentes.get(0));
            return ResponseEntity.ok(escolhido);
        }

        var novo = new Idoso();
        novo.setNome(req.nome());
        novo.setEmail(req.email());
        novo.setDataNascimento(req.dataNascimento());
        novo.setSexo(req.sexo());
        novo.setTelefone(req.telefone());

        var salvo = repository.save(novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // =========================
    // GET /api/eldercare/idosos
    // Listar todos os idosos
    // =========================
    @GetMapping
    public ResponseEntity<List<Idoso>> listarTodos() {
        List<Idoso> idosos = repository.findAll();
        return ResponseEntity.ok(idosos);
    }

    // =========================
    // GET /api/eldercare/idosos/{id}
    // Buscar um idoso por ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Idoso> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
