package br.pucgo.ads.projetointegrador.diario_saude.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicamentoEntity;

public interface MedicamentoRepository extends JpaRepository<MedicamentoEntity, Long> {
    boolean existsByNome(String nome);
}
