CREATE TABLE resposta_pergunta_usuario (
  id_resposta_pergunta_usuario BIGSERIAL PRIMARY KEY,
  id_pergunta BIGINT NOT NULL UNIQUE,
  id_usuario BIGINT NOT NULL,
  texto_resposta TEXT NOT NULL,
  data_resposta TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX ix_resposta_pergunta_usuario_usuario ON resposta_pergunta_usuario (id_usuario);

ALTER TABLE resposta_pergunta_usuario
  ADD CONSTRAINT fk_resposta_pergunta FOREIGN KEY (id_pergunta) REFERENCES pergunta_cognitiva (id_pergunta) ON DELETE CASCADE;

ALTER TABLE resposta_pergunta_usuario
  ADD CONSTRAINT fk_resposta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE RESTRICT;