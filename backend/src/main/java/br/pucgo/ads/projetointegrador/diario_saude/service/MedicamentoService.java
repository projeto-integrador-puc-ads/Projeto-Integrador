package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicamentoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicamentoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.MedicamentoRepository;

@Service
public class MedicamentoService {

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    public List<MedicamentoDTO> listarTodos(){
        return medicamentoRepository.findAll().stream().map(MedicamentoDTO::new).toList();
    }

    public void inserir(MedicamentoDTO medicamento){
        medicamentoRepository.save(new MedicamentoEntity(medicamento));
    }

    public MedicamentoDTO alterar(MedicamentoDTO medicamento){
        return new MedicamentoDTO(medicamentoRepository.save(new MedicamentoEntity(medicamento)));
    }

    public void excluir(Long id){
        medicamentoRepository.delete(medicamentoRepository.findById(id).get());
    }

    public MedicamentoDTO buscarPorId(Long id){
        return new MedicamentoDTO(medicamentoRepository.findById(id).get());
    }

    public void importarCSV(MultipartFile file) {
        // CORREÇÃO: Alterado de "Windows-1252" para "ISO-8859-1"
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), "ISO-8859-1"))) { 

            br.readLine(); // pula cabeçalho

            String linha;
            while ((linha = br.readLine()) != null) {
                String[] col = linha.split(";");
                if (col.length < 11) continue;

                // ... restante do código de processamento
                String nome = col[1];
                String principio_ativo = col[10];
                String empresa = col[8];
                String classe = col[7];
                String numero_registro = col[4];

                if (!medicamentoRepository.existsByNome(nome)) {
                    medicamentoRepository.save(
                        new MedicamentoEntity(nome, principio_ativo, empresa, classe, numero_registro)
                    );
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Erro ao importar CSV de medicamentos: " + e.getMessage(), e);
        }
    }
}
