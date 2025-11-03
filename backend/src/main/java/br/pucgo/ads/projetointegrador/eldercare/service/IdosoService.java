package br.pucgo.ads.projetointegrador.eldercare.service;

import br.pucgo.ads.projetointegrador.eldercare.domain.Idoso;
import br.pucgo.ads.projetointegrador.eldercare.dto.CriarIdosoDTO;
import br.pucgo.ads.projetointegrador.eldercare.exception.NotFoundException;
import br.pucgo.ads.projetointegrador.eldercare.repository.IdosoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IdosoService {
    private final IdosoRepository repo;
    public IdosoService(IdosoRepository repo) { this.repo = repo; }

    public Idoso criar(CriarIdosoDTO dto) {
        var e = new Idoso();
        e.setNome(dto.nome());
        e.setDataNascimento(dto.dataNascimento());
        e.setSexo(dto.sexo());
        e.setEmail(dto.email());
        e.setTelefone(dto.telefone());
        return repo.save(e);
    }

    public List<Idoso> listar() { return repo.findAll(); }

    public Idoso buscar(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Idoso não encontrado: " + id));
    }

    public void remover(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Idoso não encontrado: " + id);
        repo.deleteById(id);
    }
}
