CREATE TABLE lembranca (
  id_lembranca BIGSERIAL PRIMARY KEY,
  id_usuario BIGINT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  data_acontecimento DATE NOT NULL,
  pessoas_presentes TEXT,
  local VARCHAR(255),
  historia TEXT NOT NULL,
  data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  data_atualizacao TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX ix_lembranca_id_usuario ON lembranca (id_usuario);