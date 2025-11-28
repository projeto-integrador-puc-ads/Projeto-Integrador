-- ================================================================
-- V8__ENABLE_UNACCENT.sql
-- Habilitar extensão unaccent e criar wrapper IMMUTABLE
-- ================================================================

BEGIN;

-- 1. Criar extensão unaccent (se não existir)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Criar uma função "Wrapper" enganando o Postgres para ser IMMUTABLE
-- Nós forçamos o uso do dicionário 'unaccent' para garantir consistência
CREATE OR REPLACE FUNCTION public.f_unaccent(text)
    RETURNS text AS $$
SELECT public.unaccent('public.unaccent', $1)
           $$  LANGUAGE sql IMMUTABLE;

-- 3. criar o índice usando a NOSSA função
CREATE INDEX IF NOT EXISTS idx_produto_nome_unaccent
    ON produto (public.f_unaccent(nome_normalizado));

COMMIT;