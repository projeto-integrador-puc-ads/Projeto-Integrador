package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.plataforma.dto.midia.MidiaResponseDTO;
import br.pucgo.ads.projetointegrador.plataforma.entity.Midia;
import br.pucgo.ads.projetointegrador.plataforma.repository.MidiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class MidiaService {

    private final MidiaRepository midiaRepository;
    private final String uploadPath = "/arquivos/uploads/fotos/";

    @Autowired
    public MidiaService(MidiaRepository midiaRepository) {
        this.midiaRepository = midiaRepository;
    }

    /**
     * Salva um arquivo de foto no servidor e cria o registro no banco de dados.
     * @param arquivo O arquivo de foto enviado.
     * @return Os dados da mídia salva.
     */
    public MidiaResponseDTO salvarFoto(MultipartFile arquivo) throws IOException {
        if (arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo enviado está vazio.");
        }

        String nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
        Path caminhoCompleto = Paths.get(uploadPath + nomeArquivo);

        Files.createDirectories(caminhoCompleto.getParent());
        Files.write(caminhoCompleto, arquivo.getBytes());

        Midia novaMidia = new Midia();
        novaMidia.setUrlArquivo("/midia/" + nomeArquivo);

        Midia midiaSalva = midiaRepository.save(novaMidia);
        return new MidiaResponseDTO(midiaSalva);
    }

    /**
     * Deleta um arquivo de mídia (do servidor e do banco de dados).
     * @param identificador O ID da mídia a ser deletada.
     */
    public void deletarMidia(UUID identificador) throws IOException {
        Midia midia = midiaRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Mídia não encontrada com o ID: " + identificador));

        String nomeArquivo = midia.getUrlArquivo().replace("/midia/", "");
        Path caminhoCompleto = Paths.get(uploadPath + nomeArquivo);
        Files.deleteIfExists(caminhoCompleto);

        midiaRepository.delete(midia);
    }
}
