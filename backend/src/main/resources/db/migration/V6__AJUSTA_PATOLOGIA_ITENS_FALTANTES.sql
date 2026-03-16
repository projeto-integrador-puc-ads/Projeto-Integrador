-- ================================================================
-- V6__AJUSTA_PATOLOGIA_ITENS_FALTANTES.sql
-- Restaura vínculos de produtos problemáticos que existiam na V1
-- e foram perdidos nas V2/V4 (após o DELETE geral).
-- Só adiciona se:
--   - o produto existir na tabela produto
--   - ainda não houver vínculo patologia_itens para aquele par
-- ================================================================

-- -------------------------------
-- 1) INTOLERÂNCIA À LACTOSE
--    Faltavam: Queijo Mussarela, Queijo Minas, Requeijão
-- -------------------------------

INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose') AS patologia_id,
    p.id AS produto_id,
    NULL AS produto_sugestao_id
FROM produto p
WHERE p.nome IN ('Queijo Mussarela', 'Queijo Minas', 'Requeijão')
  AND EXISTS (
    SELECT 1
    FROM patologias pat
    WHERE pat.nome = 'Intolerância à Lactose'
)
  AND NOT EXISTS (
    SELECT 1
    FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose')
      AND pi.produto_id = p.id
);

-- -------------------------------
-- 2) HIPERTENSÃO
--    Faltavam: Sal, Linguiça
-- -------------------------------

INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Hipertensão') AS patologia_id,
    p.id AS produto_id,
    NULL AS produto_sugestao_id
FROM produto p
WHERE p.nome IN ('Sal', 'Linguiça')
  AND EXISTS (
    SELECT 1
    FROM patologias pat
    WHERE pat.nome = 'Hipertensão'
)
  AND NOT EXISTS (
    SELECT 1
    FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
      AND pi.produto_id = p.id
);

-- Opcional: reforçar também Açúcar, caso não tenha sido criado na V2
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Hipertensão') AS patologia_id,
    p.id AS produto_id,
    NULL AS produto_sugestao_id
FROM produto p
WHERE p.nome = 'Sal'
  AND EXISTS (
    SELECT 1
    FROM patologias pat
    WHERE pat.nome = 'Hipertensão'
)
  AND NOT EXISTS (
    SELECT 1
    FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
      AND pi.produto_id = p.id
);

-- -------------------------------
-- 3) DIABETES MELLITUS
--    Faltavam: Refrigerante, Achocolatado, Mel
-- -------------------------------

INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus') AS patologia_id,
    p.id AS produto_id,
    NULL AS produto_sugestao_id
FROM produto p
WHERE p.nome IN ('Refrigerante', 'Achocolatado', 'Mel')
  AND EXISTS (
    SELECT 1
    FROM patologias pat
    WHERE pat.nome = 'Diabetes Mellitus'
)
  AND NOT EXISTS (
    SELECT 1
    FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
      AND pi.produto_id = p.id
);

-- Opcional: garantir também o vínculo de Açúcar (caso o produto
-- tenha sido criado depois da V2 e ainda não tenha vínculo)
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW() AS created_at,
    NOW() AS updated_at,
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus') AS patologia_id,
    p.id AS produto_id,
    (SELECT id FROM produto WHERE nome = 'Adoçante' OR nome = 'Adoçante Dietético' LIMIT 1) AS produto_sugestao_id
FROM produto p
WHERE p.nome = 'Açúcar'
  AND EXISTS (
    SELECT 1
    FROM patologias pat
    WHERE pat.nome = 'Diabetes Mellitus'
    )
  AND NOT EXISTS (
    SELECT 1
    FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
  AND pi.produto_id = p.id
    );
