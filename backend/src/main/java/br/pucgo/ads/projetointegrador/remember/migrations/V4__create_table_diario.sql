CREATE TABLE diario (
  id_diario BIGSERIAL PRIMARY KEY,
  id_usuario BIGINT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  data_escrita DATE NOT NULL,
  data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  data_atualizacao TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX ix_diario_id_usuario ON diario (id_usuario);