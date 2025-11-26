-- ================================================================
-- V2__ADD_PRODUTO_SUGESTAO.sql
-- Adicionar coluna produto_sugestao_id na tabela patologia_itens
-- e popular com sugestões de produtos substitutos
-- ================================================================

BEGIN;

-- 1) Adicionar a nova coluna (se não existir)
ALTER TABLE patologia_itens
    ADD COLUMN IF NOT EXISTS produto_sugestao_id BIGINT REFERENCES produto(id) ON DELETE SET NULL;

-- 2) Limpar dados existentes de patologia_itens para recriar com sugestões
DELETE FROM patologia_itens;

-- 3) Inserir dados com produtos sugestão
-- Usando subqueries mais robustas

-- Intolerância à Lactose - Leite -> Água Mineral
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'agua mineral'
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Leite'
ON CONFLICT DO NOTHING;

-- Intolerância à Lactose - Iogurte -> Suco de Laranja
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'suco de laranja'
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Iogurte'
ON CONFLICT DO NOTHING;

-- Intolerância à Lactose - Queijo Mussarela (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Queijo Mussarela'
ON CONFLICT DO NOTHING;

-- Intolerância à Lactose - Queijo Minas (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Queijo Minas'
ON CONFLICT DO NOTHING;

-- Intolerância à Lactose - Creme de Leite (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Creme de Leite'
ON CONFLICT DO NOTHING;

-- Intolerância à Lactose - Leite Condensado -> Mel
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'mel'
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Leite Condensado'
ON CONFLICT DO NOTHING;

-- Intolerância à Lactose - Requeijão (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Requeijão'
ON CONFLICT DO NOTHING;

-- Intolerância à Lactose - Achocolatado -> Café
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'cafe'
WHERE pat.nome LIKE '%Lactose%'
  AND prod.nome = 'Achocolatado'
ON CONFLICT DO NOTHING;


-- Doença Celíaca (Glúten) - Pão Integral -> Arroz
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'arroz'
WHERE pat.nome LIKE '%Cel%'
  AND prod.nome = 'Pão Integral'
ON CONFLICT DO NOTHING;

-- Doença Celíaca (Glúten) - Pão Francês -> Arroz
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'arroz'
WHERE pat.nome LIKE '%Cel%'
  AND prod.nome = 'Pão Francês'
ON CONFLICT DO NOTHING;

-- Doença Celíaca (Glúten) - Macarrão Espaguete -> Arroz
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'arroz'
WHERE pat.nome LIKE '%Cel%'
  AND prod.nome = 'Macarrão Espaguete'
ON CONFLICT DO NOTHING;

-- Doença Celíaca (Glúten) - Macarrão Parafuso -> Arroz
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'arroz'
WHERE pat.nome LIKE '%Cel%'
  AND prod.nome = 'Macarrão Parafuso'
ON CONFLICT DO NOTHING;

-- Doença Celíaca (Glúten) - Farinha de Trigo -> Fubá
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'fuba'
WHERE pat.nome LIKE '%Cel%'
  AND prod.nome = 'Farinha de Trigo'
ON CONFLICT DO NOTHING;

-- Doença Celíaca (Glúten) - Biscoito Maizena (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Cel%'
  AND prod.nome = 'Biscoito Maizena'
ON CONFLICT DO NOTHING;

-- Doença Celíaca (Glúten) - Biscoito Recheado (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Cel%'
  AND prod.nome = 'Biscoito Recheado'
ON CONFLICT DO NOTHING;


-- Hipertensão - Sal (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Hiper%'
  AND prod.nome = 'Sal'
ON CONFLICT DO NOTHING;

-- Hipertensão - Presunto -> Peito de Frango
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'peito de frango'
WHERE pat.nome LIKE '%Hiper%'
  AND prod.nome = 'Presunto'
ON CONFLICT DO NOTHING;

-- Hipertensão - Linguiça -> Peito de Frango
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'peito de frango'
WHERE pat.nome LIKE '%Hiper%'
  AND prod.nome = 'Linguiça'
ON CONFLICT DO NOTHING;

-- Hipertensão - Refrigerante -> Água Mineral
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'agua mineral'
WHERE pat.nome LIKE '%Hiper%'
  AND prod.nome = 'Refrigerante'
ON CONFLICT DO NOTHING;


-- Diabetes Mellitus - Açúcar (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Diabetes%'
  AND prod.nome = 'Açúcar'
ON CONFLICT DO NOTHING;

-- Diabetes Mellitus - Achocolatado -> Café
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'cafe'
WHERE pat.nome LIKE '%Diabetes%'
  AND prod.nome = 'Achocolatado'
ON CONFLICT DO NOTHING;

-- Diabetes Mellitus - Refrigerante -> Água Mineral
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'agua mineral'
WHERE pat.nome LIKE '%Diabetes%'
  AND prod.nome = 'Refrigerante'
ON CONFLICT DO NOTHING;

-- Diabetes Mellitus - Granola -> Aveia em Flocos
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    sug.id,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
         LEFT JOIN produto sug ON sug.nome_normalizado = 'aveia em flocos'
WHERE pat.nome LIKE '%Diabetes%'
  AND prod.nome = 'Granola'
ON CONFLICT DO NOTHING;

-- Diabetes Mellitus - Mel (sem sugestão)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    pat.id,
    prod.id,
    NULL,
    NOW(),
    NOW()
FROM patologias pat
         CROSS JOIN produto prod
WHERE pat.nome LIKE '%Diabetes%'
  AND prod.nome = 'Mel'
ON CONFLICT DO NOTHING;


COMMIT;