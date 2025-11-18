CREATE TABLE pergunta_template (
  id_pergunta_template BIGSERIAL PRIMARY KEY,
  texto_template TEXT NOT NULL,
  gatilho_tipo INTEGER NOT NULL,
  gatilho_valores TEXT,
  campo_alvo VARCHAR(50),
  campo_placeholder VARCHAR(50),
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);