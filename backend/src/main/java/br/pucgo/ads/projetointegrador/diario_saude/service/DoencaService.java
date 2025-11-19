package br.pucgo.ads.projetointegrador.diario_saude.service;

import br.pucgo.ads.projetointegrador.diario_saude.entity.DoencasEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.DoencaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DoencaService {

    @Autowired
    private DoencaRepository repository;

    public DoencasEntity criarDoenca(DoencasEntity doenca) {
        return repository.save(doenca);
    }

    public List<DoencasEntity> listarDoencas() {
        return repository.findAll();
    }

    public List<DoencasEntity> importarCSV(MultipartFile arquivo) {
        List<DoencasEntity> lista = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(arquivo.getInputStream(), "Windows-1252"))) {

            String linha;
            boolean primeira = true;

            while ((linha = br.readLine()) != null) {

                if (primeira) {
                    primeira = false;
                    // pula cabeçalho, caso tenha
                    if (linha.toUpperCase().contains("SUBCAT") || linha.toUpperCase().contains("DESCRICAO")) {
                        continue;
                    }
                }

                if (linha.trim().isEmpty()) continue;

                String[] colunas = linha.split(";", -1);

                String codigo = colunas.length > 0 ? colunas[0].trim() : null;
                String categoria = colunas.length > 1 ? colunas[1].trim() : null;
                String restrSexo = colunas.length > 2 ? colunas[2].trim() : null;
                String causaObito = colunas.length > 3 ? colunas[3].trim() : null;
                String nome = colunas.length > 4 ? colunas[4].trim() : null;
                String nomeAbrev = colunas.length > 5 ? colunas[5].trim() : null;

                if (codigo == null || codigo.isEmpty()) continue;
                if (nome == null || nome.isEmpty()) continue;

                Optional<DoencasEntity> existente = repository.findByCodigo(codigo);
                if (existente.isPresent()) {
                    continue;
                }

                DoencasEntity d = new DoencasEntity();
                d.setCodigo(codigo);
                d.setCategoria(categoria);
                d.setRestricaoSexo(restrSexo);
                d.setCausaObito(causaObito);
                d.setNome(nome);
                d.setNomeAbreviado(nomeAbrev);

                lista.add(repository.save(d));
            }

            return lista;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao importar CSV de doenças: " + e.getMessage(), e);
        }
    }
}
