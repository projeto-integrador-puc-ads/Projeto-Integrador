package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.pucgo.ads.projetointegrador.carehub.entity.MessageMedia;
import java.time.LocalDateTime;
import java.util.List;

public interface MessageMediaRepository extends JpaRepository<MessageMedia, Long> {
	MessageMedia findByStorageKey(String storageKey);
	List<MessageMedia> findByCreatedAtBefore(LocalDateTime cutoff);
}

