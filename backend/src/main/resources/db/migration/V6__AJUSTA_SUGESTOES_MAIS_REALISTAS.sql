
-- ================================================================
-- V6__AJUSTA_SUGESTOES_MAIS_REALISTAS.sql
-- Ajusta sugestões de substituição para serem mais próximas dos itens
-- e enriquece a base de produtos para intolerância à lactose, hipertensão,
-- diabetes mellitus e doença celíaca, mantendo tudo idempotente.
-- ================================================================

-- 1) NOVOS PRODUTOS "SAUDÁVEIS" / SUBSTITUTOS MAIS PRÓXIMOS
--    (usa ON CONFLICT para ser seguro em múltiplas execuções)

WITH novos_produtos (nome, preco, cat_nome, tags) AS (
    VALUES
        -- Intolerância à Lactose
        ('Leite Sem Lactose Integral',   6.90, 'Laticínios', 'laticinio,sem-lactose'),
        ('Leite Sem Lactose Desnatado',  7.20, 'Laticínios', 'laticinio,sem-lactose,desnatado'),
        ('Iogurte Sem Lactose',          4.90, 'Laticínios', 'laticinio,sem-lactose'),
        ('Queijo Minas Sem Lactose',    39.90, 'Frios e Embutidos', 'frios,sem-lactose'),

        -- Doença Celíaca / Sem glúten
        ('Pão Sem Glúten',              10.90, 'Padaria', 'padaria,sem-gluten'),
        ('Macarrão Sem Glúten',          9.90, 'Massas e Cereais', 'massa,sem-gluten'),

        -- Hipertensão
        ('Tempero Natural sem Sal',      5.90, 'Condimentos', 'tempero,sem-sal,hipertensao'),

        -- Diabetes Mellitus
        ('Refrigerante Zero',            7.90, 'Bebidas', 'bebida,zero-acucar,diabetes'),
        ('Achocolatado Diet',           12.90, 'Bebidas', 'bebida,diet,diabetes')
)
INSERT INTO produto (nome, nome_normalizado, preco, ativo, is_personalizado, tags, categoria_id, created_at, updated_at)
SELECT
    np.nome,
    LOWER(np.nome),
    np.preco,
    TRUE,
    FALSE,
    np.tags,
    (SELECT id FROM categorias c WHERE c.nome = np.cat_nome LIMIT 1),
    NOW(),
    NOW()
FROM novos_produtos np
WHERE NOT EXISTS (SELECT 1 FROM produto p WHERE p.nome = np.nome);

-- ================================================================
-- 2) GARANTIR VÍNCULOS EM patologia_itens PARA ITENS PROBLEMÁTICOS
--    (caso tenham se perdido em algum DELETE anterior)
-- ================================================================

-- 2.1) INTOLERÂNCIA À LACTOSE
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose'),
    p.id,
    NULL
FROM produto p
WHERE p.nome IN ('Leite','Iogurte','Queijo Mussarela','Queijo Minas','Requeijão','Leite Desnatado','Manteiga')
  AND EXISTS (SELECT 1 FROM patologias pat WHERE pat.nome = 'Intolerância à Lactose')
  AND NOT EXISTS (
    SELECT 1 FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose')
      AND pi.produto_id = p.id
);

-- 2.2) HIPERTENSÃO
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome = 'Hipertensão'),
    p.id,
    NULL
FROM produto p
WHERE p.nome IN ('Sal','Linguiça','Presunto')
  AND EXISTS (SELECT 1 FROM patologias pat WHERE pat.nome = 'Hipertensão')
  AND NOT EXISTS (
    SELECT 1 FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
      AND pi.produto_id = p.id
);

-- 2.3) DIABETES MELLITUS
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus'),
    p.id,
    NULL
FROM produto p
WHERE p.nome IN ('Açúcar','Refrigerante','Achocolatado','Mel')
  AND EXISTS (SELECT 1 FROM patologias pat WHERE pat.nome = 'Diabetes Mellitus')
  AND NOT EXISTS (
    SELECT 1 FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
      AND pi.produto_id = p.id
);

-- 2.4) DOENÇA CELÍACA
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id, produto_sugestao_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome = 'Doença Celíaca'),
    p.id,
    NULL
FROM produto p
WHERE p.nome IN ('Pão Francês','Macarrão Integral')
  AND EXISTS (SELECT 1 FROM patologias pat WHERE pat.nome = 'Doença Celíaca')
  AND NOT EXISTS (
    SELECT 1 FROM patologia_itens pi
    WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Doença Celíaca')
      AND pi.produto_id = p.id
);

-- ================================================================
-- 3) AJUSTAR produto_sugestao_id PARA SUBSTITUTOS MAIS PRÓXIMOS
--    (UPDATE nos registros já existentes em patologia_itens)
-- ================================================================

-- 3.1) INTOLERÂNCIA À LACTOSE
-- Leite -> Leite Sem Lactose Integral
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Leite Sem Lactose Integral')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Leite')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Leite Sem Lactose Integral');

-- Iogurte -> Iogurte Sem Lactose
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Iogurte Sem Lactose')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Iogurte')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Iogurte Sem Lactose');

-- Queijos e manteiga -> Queijo Minas Sem Lactose
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Queijo Minas Sem Lactose')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose')
  AND pi.produto_id IN (
        (SELECT id FROM produto WHERE nome = 'Queijo Mussarela'),
        (SELECT id FROM produto WHERE nome = 'Queijo Minas'),
        (SELECT id FROM produto WHERE nome = 'Requeijão'),
        (SELECT id FROM produto WHERE nome = 'Manteiga')
  )
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Queijo Minas Sem Lactose');

-- Leite Desnatado -> Leite Sem Lactose Desnatado
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Leite Sem Lactose Desnatado')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Leite Desnatado')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Leite Sem Lactose Desnatado');

-- 3.2) HIPERTENSÃO
-- Sal -> Tempero Natural sem Sal
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Tempero Natural sem Sal')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Sal')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Tempero Natural sem Sal');

-- Linguiça e Presunto -> Peito de Frango (proteína mais magra / menos sódio)
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Peito de Frango')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Hipertensão')
  AND pi.produto_id IN (
        (SELECT id FROM produto WHERE nome = 'Linguiça'),
        (SELECT id FROM produto WHERE nome = 'Presunto')
  )
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Peito de Frango');

-- 3.3) DIABETES MELLITUS
-- Açúcar -> Adoçante Dietético (ou Adoçante se não houver Dietético)
UPDATE patologia_itens pi
SET produto_sugestao_id = COALESCE(
    (SELECT id FROM produto WHERE nome = 'Adoçante Dietético' LIMIT 1),
    (SELECT id FROM produto WHERE nome = 'Adoçante' LIMIT 1)
)
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Açúcar')
  AND (
      (SELECT COUNT(*) FROM produto WHERE nome IN ('Adoçante Dietético','Adoçante')) > 0
  );

-- Refrigerante -> Refrigerante Zero
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Refrigerante Zero')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Refrigerante')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Refrigerante Zero');

-- Achocolatado -> Achocolatado Diet
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Achocolatado Diet')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Achocolatado')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Achocolatado Diet');

-- Mel -> Adoçante Dietético (mais moderado que açúcar simples)
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Adoçante Dietético')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Mel')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Adoçante Dietético');

-- 3.4) DOENÇA CELÍACA
-- Pão Francês -> Pão Sem Glúten (mais parecido do ponto de vista do usuário)
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Pão Sem Glúten')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Doença Celíaca')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Pão Francês')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Pão Sem Glúten');

-- Macarrão Integral -> Macarrão Sem Glúten
UPDATE patologia_itens pi
SET produto_sugestao_id = (SELECT id FROM produto WHERE nome = 'Macarrão Sem Glúten')
WHERE pi.patologia_id = (SELECT id FROM patologias WHERE nome = 'Doença Celíaca')
  AND pi.produto_id = (SELECT id FROM produto WHERE nome = 'Macarrão Integral')
  AND EXISTS (SELECT 1 FROM produto WHERE nome = 'Macarrão Sem Glúten');
