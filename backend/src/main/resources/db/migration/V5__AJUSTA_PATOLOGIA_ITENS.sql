-- ================================================================
-- V5__AJUSTA_PATOLOGIA_ITENS.sql
-- Ajusta itens que geram ALERTA para novas dietas
-- Assume:
--   - patologias 'Intolerância à Lactose' e 'Hipertensão' já existem
--   - produtos novos já foram inseridos (V3)
--   - patologia_itens tem UNIQUE em (patologia_id, produto_id) ou similar
-- ================================================================

-- -------------------------------
-- 1) INTOLERÂNCIA À LACTOSE
--    -> incluir Leite Desnatado e Manteiga como itens de alerta
-- -------------------------------

INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose'),
    p.id
FROM produto p
WHERE p.nome IN ('Leite Desnatado', 'Manteiga')
    ON CONFLICT DO NOTHING;

-- -------------------------------
-- 2) HIPERTENSÃO
--    -> incluir Sal Light como item de alerta
--       (ainda é sal, só reduzido em sódio)
-- -------------------------------

INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome = 'Hipertensão'),
    p.id
FROM produto p
WHERE p.nome IN ('Sal Light')
    ON CONFLICT DO NOTHING;
