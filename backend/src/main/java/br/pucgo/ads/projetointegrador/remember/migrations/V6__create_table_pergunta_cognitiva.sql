CREATE TABLE pergunta_cognitiva (
  id_pergunta BIGSERIAL PRIMARY KEY,
  id_template_origem BIGINT NOT NULL,
  id_usuario BIGINT NOT NULL,
  id_lembranca_relacionada BIGINT,
  id_diario_relacionado BIGINT,
  texto_pergunta TEXT NOT NULL,
  status INTEGER NOT NULL,
  data_geracao TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX ix_pergunta_cognitiva_template ON pergunta_cognitiva (id_template_origem);
CREATE INDEX ix_pergunta_cognitiva_usuario ON pergunta_cognitiva (id_usuario);
CREATE INDEX ix_pergunta_cognitiva_lembranca ON pergunta_cognitiva (id_lembranca_relacionada);
CREATE INDEX ix_pergunta_cognitiva_diario ON pergunta_cognitiva (id_diario_relacionado);

ALTER TABLE pergunta_cognitiva
  ADD CONSTRAINT fk_pergunta_template FOREIGN KEY (id_template_origem) REFERENCES pergunta_template (id_pergunta_template) ON DELETE RESTRICT;

-- FK para usuário (assumi tabela usuario(id_usuario) existente)
ALTER TABLE pergunta_cognitiva
  ADD CONSTRAINT fk_pergunta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE RESTRICT;

ALTER TABLE pergunta_cognitiva
  ADD CONSTRAINT fk_pergunta_lembranca FOREIGN KEY (id_lembranca_relacionada) REFERENCES lembranca (id_lembranca) ON DELETE SET NULL;

ALTER TABLE pergunta_cognitiva
  ADD CONSTRAINT fk_pergunta_diario FOREIGN KEY (id_diario_relacionado) REFERENCES diario (id_diario) ON DELETE SET NULL;