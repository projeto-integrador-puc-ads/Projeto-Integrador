CREATE TABLE usuario_conquista (
  id_usuario BIGINT NOT NULL,
  id_conquista BIGINT NOT NULL,
  data_obtencao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY (id_usuario, id_conquista)
);

CREATE INDEX ix_usuario_conquista_conquista ON usuario_conquista (id_conquista);

-- FK para usuário (assumi tabela usuario(id_usuario) existente)
ALTER TABLE usuario_conquista
  ADD CONSTRAINT fk_usuario_conquista_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE;

ALTER TABLE usuario_conquista
  ADD CONSTRAINT fk_usuario_conquista_conquista FOREIGN KEY (id_conquista) REFERENCES conquista (id_conquista) ON DELETE CASCADE;