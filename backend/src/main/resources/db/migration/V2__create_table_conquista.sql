CREATE TABLE conquista (
  id_conquista BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  icone_url VARCHAR(512) NOT NULL,
  pontos INTEGER NOT NULL
);