-- ================================================================
-- V7__NOVOS_PRODUTOS_BASICOS.sql
-- Enriquecimento da base de produtos com itens básicos de mercado
-- + ajuste de vínculos em patologia_itens para produtos problemáticos
-- ================================================================

-- 1) NOVOS PRODUTOS BÁSICOS
--    (idempotente: ON CONFLICT (nome) DO NOTHING)

WITH p(nome, preco, cat, tags) AS (
    VALUES
        -- Itens de mercearia / despensa
        ('Açúcar',              4.50,  'Mercearia',         'acucar,doce'),
        ('Farinha de Trigo',    4.99,  'Massas e Cereais',  'farinha'),
        ('Óleo de Soja',        7.49,  'Mercearia',         'oleo,cozinha'),
        ('Macarrão Espaguete',  5.99,  'Massas e Cereais',  'massa,espaguete'),
        ('Arroz Parboilizado', 23.90,  'Massas e Cereais',  'basico,arroz'),
        ('Fubá de Milho',       4.90,  'Massas e Cereais',  'fuba,mingau'),
        ('Ovos',               14.90,  'Mercearia',         'ovos,proteina'),

        -- Enlatados / molhos
        ('Milho Verde em Lata', 4.90,  'Enlatados',         'enlatado,legume'),
        ('Ervilha em Lata',     4.90,  'Enlatados',         'enlatado,legume'),
        ('Molho de Tomate',     3.50,  'Enlatados',         'molho,tomate'),
        ('Extrato de Tomate',   3.90,  'Enlatados',         'molho,tomate'),

        -- Condimentos
        ('Sal',                 2.50,  'Condimentos',       'sal,temperar'),
        ('Ketchup',             8.90,  'Condimentos',       'molho,ketchup'),
        ('Maionese',            9.90,  'Condimentos',       'molho,maionese'),

        -- Bebidas
        ('Refrigerante',        8.90,  'Bebidas',           'bebida,açucar'),
        ('Achocolatado',        7.90,  'Bebidas',           'achocolatado,açucar'),
        ('Chá Preto',           5.90,  'Bebidas',           'cha,cafeina'),

        -- Itens de higiene
        ('Papel Higiênico',    15.90,  'Higiene',           'papel,sanitario'),
        ('Pasta de Dente',      5.50,  'Higiene',           'dental,pasta'),
        ('Escova de Dente',     4.50,  'Higiene',           'dental,escova'),
        ('Shampoo',            12.90,  'Higiene',           'cabelo,shampoo'),
        ('Condicionador',      14.90,  'Higiene',           'cabelo,condicionador'),
        ('Desodorante',        11.90,  'Higiene',           'desodorante,higiene'),

        -- Limpeza
        ('Sabão em Pó',        18.90,  'Limpeza',           'lavar_roupa,sabao'),
        ('Sabão em Barra',      5.90,  'Limpeza',           'sabao,barra'),
        ('Esponja de Aço',      2.50,  'Limpeza',           'esponja,aco'),
        ('Esponja Multiuso',    2.50,  'Limpeza',           'esponja,cozinha'),

        -- Frios e embutidos
        ('Presunto',           34.90,  'Frios e Embutidos', 'presunto,embutido'),
        ('Linguiça',           19.90,  'Frios e Embutidos', 'linguica,embutido'),

        -- Carnes / proteínas
        ('Carne Moída Bovina', 29.90,  'Carnes e Peixes',   'carne,bovina'),
        ('Coxa de Frango',     17.90,  'Carnes e Peixes',   'carne,frango'),

        -- Doces / naturais
        ('Mel',                12.90,  'Mercearia',         'mel,doce,natural')
)
INSERT INTO produto (nome, nome_normalizado, preco, ativo, is_personalizado, tags, categoria_id, created_at, updated_at)
SELECT
    p.nome,
    LOWER(p.nome),
    p.preco,
    TRUE,
    FALSE,
    p.tags,
    (SELECT id FROM categorias c WHERE c.nome = p.cat LIMIT 1),
    NOW(),
    NOW()
FROM p
ON CONFLICT (nome) DO NOTHING;

-- ================================================================
-- 2) AJUSTE DE patologia_itens PARA NOVOS PRODUTOS PROBLEMÁTICOS
--    (idempotente: só cria se ainda não existir o vínculo)
-- ================================================================

-- Helper: pegar ids de patologias
WITH pat_ids AS (
    SELECT
        (SELECT id FROM patologias WHERE nome = 'Hipertensão')       AS pat_hip,
        (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus') AS pat_dm,
        (SELECT id FROM patologias WHERE nome = 'Doença Celíaca')    AS pat_celiaca
)
-- A cláusula abaixo só serve para tornar o CTE visível;
-- os INSERTs reais vêm logo depois.
SELECT 1
FROM pat_ids
LIMIT 1;

-- -------------------------------
-- 2.1) HIPERTENSÃO
--     Sal, Linguiça, Presunto
-- -------------------------------

-- Sal -> Tempero Natural sem Sal (se existir)
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Hipertensão') AS patologia_id,
    p_sal.id AS produto_id,
    p_sub.id AS produto_sugestao_id
FROM produto p_sal
JOIN produto p_sub
  ON p_sub.nome = 'Tempero Natural sem Sal'
WHERE p_sal.nome = 'Sal'
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
        AND pi.produto_id   = p_sal.id
  );

-- Linguiça -> Peito de Frango (substituição mais magra)
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Hipertensão') AS patologia_id,
    p_ling.id AS produto_id,
    p_sub.id  AS produto_sugestao_id
FROM produto p_ling
JOIN produto p_sub
  ON p_sub.nome = 'Peito de Frango'
WHERE p_ling.nome = 'Linguiça'
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
        AND pi.produto_id   = p_ling.id
  );

-- Presunto -> Peito de Frango
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Hipertensão') AS patologia_id,
    p_pres.id AS produto_id,
    p_sub.id  AS produto_sugestao_id
FROM produto p_pres
JOIN produto p_sub
  ON p_sub.nome = 'Peito de Frango'
WHERE p_pres.nome = 'Presunto'
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
        AND pi.produto_id   = p_pres.id
  );

-- -------------------------------
-- 2.2) DIABETES MELLITUS
--     Açúcar, Refrigerante, Achocolatado, Mel
-- -------------------------------

-- Açúcar -> Adoçante Dietético (fallback para Adoçante se necessário)
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus') AS patologia_id,
    p_acucar.id AS produto_id,
    (
        SELECT id
        FROM produto
        WHERE nome IN ('Adoçante Dietético','Adoçante')
        ORDER BY CASE WHEN nome = 'Adoçante Dietético' THEN 0 ELSE 1 END
        LIMIT 1
    ) AS produto_sugestao_id
FROM produto p_acucar
WHERE p_acucar.nome = 'Açúcar'
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
        AND pi.produto_id   = p_acucar.id
  );

-- Refrigerante -> Refrigerante Zero (se existir)
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus') AS patologia_id,
    p_ref.id  AS produto_id,
    p_sub.id  AS produto_sugestao_id
FROM produto p_ref
JOIN produto p_sub
  ON p_sub.nome = 'Refrigerante Zero'
WHERE p_ref.nome = 'Refrigerante'
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
        AND pi.produto_id   = p_ref.id
  );

-- Achocolatado -> Achocolatado Diet (se existir)
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus') AS patologia_id,
    p_ach.id AS produto_id,
    p_sub.id AS produto_sugestao_id
FROM produto p_ach
JOIN produto p_sub
  ON p_sub.nome = 'Achocolatado Diet'
WHERE p_ach.nome = 'Achocolatado'
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
        AND pi.produto_id   = p_ach.id
  );

-- Mel -> Adoçante Dietético (ou Adoçante)
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus') AS patologia_id,
    p_mel.id AS produto_id,
    (
        SELECT id
        FROM produto
        WHERE nome IN ('Adoçante Dietético','Adoçante')
        ORDER BY CASE WHEN nome = 'Adoçante Dietético' THEN 0 ELSE 1 END
        LIMIT 1
    ) AS produto_sugestao_id
FROM produto p_mel
WHERE p_mel.nome = 'Mel'
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
        AND pi.produto_id   = p_mel.id
  );

-- -------------------------------
-- 2.3) DOENÇA CELÍACA
--     Garante vínculo para Pão Francês (se ainda não existir)
-- -------------------------------

INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Doença Celíaca') AS patologia_id,
    p_pao.id AS produto_id,
    (SELECT id FROM produto WHERE nome = 'Pão Sem Glúten' LIMIT 1) AS produto_sugestao_id
FROM produto p_pao
WHERE p_pao.nome = 'Pão Francês'
  AND EXISTS (
      SELECT 1 FROM patologias pat WHERE pat.nome = 'Doença Celíaca'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM patologia_itens pi
      WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Doença Celíaca')
        AND pi.produto_id   = p_pao.id
  );
