package br.pucgo.ads.projetointegrador.diario_saude.service;

import br.pucgo.ads.projetointegrador.diario_saude.dto.AlergiaDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.AlergiaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.AlergiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AlergiaService {

    @Autowired
    private AlergiaRepository repository;

    public AlergiaEntity criarAlergia(AlergiaEntity alergia) {
        return repository.save(alergia);
    }

    public List<AlergiaEntity> listar() {
        return repository.findAll();
    }

    /**
     * Salva várias alergias a partir de uma lista de DTOs.
     * Usa getters do DTO (não acessa campos privados diretamente).
     * Evita inserir duplicatas verificando findByCodigo antes de salvar.
     */
    public List<AlergiaEntity> criarMultiplas(List<AlergiaDTO> lista) {

        List<AlergiaEntity> salvas = new ArrayList<>();

        for (AlergiaDTO dto : lista) {

            AlergiaEntity a = new AlergiaEntity();

            a.setCodigo(dto.getCode());
            a.setNome(dto.getDisplay());

            String categoria = null;

            if (dto.getProperty() != null) {
                for (AlergiaDTO.PropertyDTO p : dto.getProperty()) {
                    if ("category".equalsIgnoreCase(p.getCode())) {
                        categoria = p.getValueCode();
                    }
                }
            }

            a.setCategoria(categoria);

            salvas.add(repository.save(a));
        }

        return salvas;
    }

}
