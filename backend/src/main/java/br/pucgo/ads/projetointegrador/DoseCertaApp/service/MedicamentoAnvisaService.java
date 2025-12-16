package br.pucgo.ads.projetointegrador.DoseCertaApp.service;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoAnvisa;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoAnvisaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;

@Service
public class MedicamentoAnvisaService {

    private final MedicamentoAnvisaRepository repository;

    public MedicamentoAnvisaService(MedicamentoAnvisaRepository repository) {
        this.repository = repository;
    }

    // 🔧 Normalizar texto
    private String limpar(String valor) {
        try {
            if (valor == null) return null;

            byte[] bytes = valor.getBytes(StandardCharsets.ISO_8859_1);
            String utf8 = new String(bytes, StandardCharsets.UTF_8);

            return Normalizer.normalize(utf8, Normalizer.Form.NFC).trim();
        } catch (Exception e) {
            return valor;
        }
    }

    // 📥 Importação CSV
    public int importarCsv(MultipartFile file) {
        try {
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream(), "ISO-8859-1")
            );

            String linha;
            boolean firstLine = true;
            List<MedicamentoAnvisa> listaParaSalvar = new ArrayList<>();
            int ignorados = 0;

            while ((linha = reader.readLine()) != null) {

                if (firstLine) { firstLine = false; continue; }

                String[] colunas = linha.split(";", -1);

                if (colunas.length < 11) continue;

                for (int i = 0; i < colunas.length; i++) {
                    colunas[i] = limpar(colunas[i]);
                }

                String registro = colunas[4];

                // Evita duplicidade pelo número de registro
                if (registro != null && !registro.isBlank()
                        && repository.existsByNumeroRegistroProduto(registro)) {
                    ignorados++;
                    continue;
                }

                MedicamentoAnvisa medicamento = new MedicamentoAnvisa(
                        colunas[0], colunas[1], colunas[2], colunas[3], colunas[4],
                        colunas[5], colunas[6], colunas[7], colunas[8], colunas[9], colunas[10]
                );

                listaParaSalvar.add(medicamento);
            }

            repository.saveAll(listaParaSalvar);
            return ignorados;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao importar CSV: " + e.getMessage());
        }
    }

    // 🔍 Consultas
    public List<MedicamentoAnvisa> buscarPorNome(String nome) {
        return repository.findByNomeProdutoContainingIgnoreCase(nome);
    }

    public MedicamentoAnvisa buscarPorNumeroRegistro(String registro) {
        List<MedicamentoAnvisa> lista = repository.findByNumeroRegistroProduto(registro);
        return lista.isEmpty() ? null : lista.get(0);
    }

    public List<MedicamentoAnvisa> buscarPorPrincipioAtivo(String principio) {
        return repository.findByPrincipioAtivoContainingIgnoreCase(principio);
    }

    public MedicamentoAnvisa buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<MedicamentoAnvisa> listarTodos() {
        return repository.findAll();
    }

    // ⭐ NOVO MÉTODO — retorna somente os 20 primeiros registros
    public List<MedicamentoAnvisa> listarPrimeiros20() {
        return repository.findTop20ByOrderByNomeProdutoAsc();
    }
}
