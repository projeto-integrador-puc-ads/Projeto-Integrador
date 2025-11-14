package br.pucgo.ads.projetointegrador.listaCompras.service;

import br.pucgo.ads.projetointegrador.listaCompras.dto.CategoriaRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.CategoriaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Categoria;
import br.pucgo.ads.projetointegrador.listaCompras.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional
    public CategoriaResponseDTO criarCategoria(CategoriaRequestDTO dto){
        //verifica se existe uma categoria com mesmo nome
        categoriaRepository.findByNomeIgnoreCase(dto.getNome()).ifPresent(c -> {
            throw new IllegalArgumentException("Ja existe uma Categoria cadastrada com esse nome: " + dto.getNome());
        });
        Categoria categoria = toEntity(dto);
        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return toResponseDTO(categoriaSalva);
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDTO buscarPorId(Long id){
        //verifica se a categoria existe
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        return toResponseDTO(categoria);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarTodas(){
        //não precisa de verificação, pois ja busca todas as categorias disponíveis
        return categoriaRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> buscarPorNome(String nome){
        return categoriaRepository.findByNomeIgnoreCase(nome).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public CategoriaResponseDTO atualizar(Long id, CategoriaRequestDTO dto){
        // valida se a categoria que você quer atualizar existe
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Categoria inexistente"));
        // Validação para verificar se o novo nome já existe em outra categoria
        if (!categoria.getNome().equals(dto.getNome())){
            categoriaRepository.findByNomeIgnoreCase(dto.getNome()).ifPresent(c -> {
                throw new IllegalArgumentException("Ja existe uma categoria com esse nome");
            });
        }
        categoria.setNome(dto.getNome());
        categoria.setDescricao(dto.getDescricao());
        Categoria categoriaAtualizada = categoriaRepository.save(categoria);
        return toResponseDTO(categoriaAtualizada);
    }


    public void deletar(Long id){
        if (!categoriaRepository.existsById(id)){
            throw new IllegalArgumentException("Categoria inexistente");
        }
        categoriaRepository.deleteById(id);
    }

    //Métodos auxiliares para conversão
    private Categoria toEntity(CategoriaRequestDTO dto){
        Categoria categoria = new Categoria();
        categoria.setNome(dto.getNome());
        categoria.setDescricao(dto.getDescricao());
        return categoria;
    }

    private CategoriaResponseDTO toResponseDTO(Categoria categoria){
        return new CategoriaResponseDTO(
                categoria.getId(),
                categoria.getDescricao(),
                categoria.getNome(),
                categoria.getCreatedAt(),
                categoria.getUpdatedAt()
        );
    }
}
