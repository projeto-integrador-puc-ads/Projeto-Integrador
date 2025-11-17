package br.pucgo.ads.projetointegrador.sabordafamilia.service;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Midia;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.MidiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

// Removido 'java.io.File'
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class MidiaService {

    private final MidiaRepository midiaRepository;
    
    // --- ADAPTADO ---
    // Agora UPLOAD_DIR é um objeto 'Path'
    private final Path UPLOAD_DIR;

    public MidiaService(MidiaRepository midiaRepository) {
        this.midiaRepository = midiaRepository;
        
        // --- ADAPTADO ---
        // Constrói o caminho de forma robusta e o torna absoluto
        this.UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads").toAbsolutePath();
        try {
            // Cria a pasta /uploads se ela não existir
            Files.createDirectories(this.UPLOAD_DIR);
        } catch (IOException e) {
            // Lança um erro se não conseguir criar a pasta
            throw new RuntimeException("Não foi possível criar o diretório de uploads", e);
        }
    }

    public Midia salvarMidia(MultipartFile file, Receita receita, String tipoMidia) throws IOException {
        // 1. Salva o arquivo fisicamente
        // Gera um nome de arquivo único para evitar conflitos
        String nomeArquivo = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // --- ADAPTADO ---
        // Resolve o caminho do arquivo de forma segura, sem misturar barras
        Path caminhoCompleto = this.UPLOAD_DIR.resolve(nomeArquivo);
        
        Files.copy(file.getInputStream(), caminhoCompleto);

        // 2. Cria a entidade Midia
        Midia midia = new Midia();
        midia.setReceita(receita);
        midia.setCaminhoArquivo(nomeArquivo); // Salva apenas o nome do arquivo
        midia.setTipoMidia(tipoMidia); // "foto" ou "video"

        // 3. Salva a entidade no banco
        return midiaRepository.save(midia);
    }
}