-- Extensão para UUID (ignora erro se não tiver permissão)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- PARTICIPANTE
-- =========================================================
CREATE TABLE IF NOT EXISTS ex_participante (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid,
  nome         text NOT NULL,
  nascimento   date,
  sexo         text,
  peso_kg      double precision,
  altura_cm    double precision,
  observacoes  text
);

-- =========================================================
-- PERGUNTA
-- =========================================================
CREATE TABLE IF NOT EXISTS ex_pergunta (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ordem      int,
  enunciado  text NOT NULL,
  tipo       text
);

-- Opções de pergunta (DER novo)
CREATE TABLE IF NOT EXISTS ex_opcao_pergunta (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pergunta_id  uuid NOT NULL REFERENCES ex_pergunta(id) ON DELETE CASCADE,
  codigo       text NOT NULL,
  rotulo       text NOT NULL,
  created_at   timestamptz DEFAULT now(),
  CONSTRAINT uk_opcao_pergunta_pergunta_codigo UNIQUE (pergunta_id, codigo)
);
CREATE INDEX IF NOT EXISTS idx_opcao_pergunta_pergunta ON ex_opcao_pergunta(pergunta_id);

-- =========================================================
-- EXERCÍCIO
-- =========================================================
CREATE TABLE IF NOT EXISTS ex_exercicio (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             text NOT NULL,
  tags_json        jsonb DEFAULT '{}'::jsonb,
  tempo_medio_min  int
);
-- opcional: ajuda nas buscas por nome
CREATE INDEX IF NOT EXISTS idx_exercicio_nome ON ex_exercicio (lower(nome));

-- =========================================================
-- RESPOSTA (cabeçalho da resposta do questionário)
-- =========================================================
CREATE TABLE IF NOT EXISTS ex_resposta_questionario (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id uuid NOT NULL REFERENCES ex_participante(id) ON DELETE CASCADE,
  created_at      timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_respq_participante ON ex_resposta_questionario(participante_id);
CREATE INDEX IF NOT EXISTS idx_respq_created ON ex_resposta_questionario(created_at);

-- Respostas do usuário por pergunta (detalhe)
CREATE TABLE IF NOT EXISTS ex_resposta_usuario (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id   uuid NOT NULL REFERENCES ex_resposta_questionario(id) ON DELETE CASCADE,
  question_id   uuid NOT NULL REFERENCES ex_pergunta(id) ON DELETE CASCADE,
  option_code   text,
  value_number  double precision,
  value_boolean boolean
);
CREATE INDEX IF NOT EXISTS idx_resposta_response ON ex_resposta_usuario(response_id);
CREATE INDEX IF NOT EXISTS idx_resposta_question ON ex_resposta_usuario(question_id);

-- =========================================================
-- PLANO
-- =========================================================
CREATE TABLE IF NOT EXISTS ex_plano (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id  uuid NOT NULL REFERENCES ex_participante(id) ON DELETE CASCADE,
  response_id      uuid REFERENCES ex_resposta_questionario(id) ON DELETE SET NULL,
  mes              date,
  objetivo         text,
  nivel            text,
  freq_semana      int,
  tempo_sessao_min int
);
CREATE INDEX IF NOT EXISTS idx_plano_participante ON ex_plano(participante_id);

-- Dias do plano
CREATE TABLE IF NOT EXISTS ex_dia_plano (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id        uuid NOT NULL REFERENCES ex_plano(id) ON DELETE CASCADE,
  data_ou_ordem  text
);
CREATE INDEX IF NOT EXISTS idx_dia_plano_plan ON ex_dia_plano(plan_id);

-- Itens (exercícios) de cada dia
CREATE TABLE IF NOT EXISTS ex_item_plano (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id        uuid NOT NULL REFERENCES ex_dia_plano(id) ON DELETE CASCADE,
  exercicio_id  uuid NOT NULL REFERENCES ex_exercicio(id) ON DELETE RESTRICT,
  series        int,
  repeticoes    int,
  duracao_seg   int,
  ordem         int
);
CREATE INDEX IF NOT EXISTS idx_item_day ON ex_item_plano(day_id);
CREATE INDEX IF NOT EXISTS idx_item_exercicio ON ex_item_plano(exercicio_id);
