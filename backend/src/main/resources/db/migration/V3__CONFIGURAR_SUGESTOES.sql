-- ================================================================
-- V3__CONFIGURAR_SUGESTOES.sql
-- 1. Adiciona coluna de sugestão
-- 2. Cadastra os produtos saudáveis (que faltavam na V1)
-- 3. Refaz os vínculos de patologia com as sugestões
-- ================================================================

-- 1) Adicionar a nova coluna na tabela patologia_itens
ALTER TABLE patologia_itens
    ADD COLUMN IF NOT EXISTS produto_sugestao_id BIGINT REFERENCES produto(id);

-- 2) INSERIR OS PRODUTOS DE SUGESTÃO (Eles não existem na V1)
-- Precisamos garantir que Água, Suco, Fubá, etc., existam para serem sugeridos.

WITH novos_produtos(nome, preco, cat_nome, tags) AS (
    VALUES
        ('Água Mineral', 2.50, 'Bebidas', 'bebida,saudavel'),
        ('Suco de Laranja', 8.90, 'Bebidas', 'bebida,fruta'),
        ('Peito de Frango', 18.90, 'Carnes e Peixes', 'carne,proteina'),
        ('Fubá', 4.50, 'Massas e Cereais', 'sem-gluten'),
        ('Arroz Integral', 6.90, 'Massas e Cereais', 'sem-gluten,integral'),
        ('Adoçante', 12.90, 'Condimentos', 'diabetes,doce'),
        ('Aveia em Flocos', 7.50, 'Massas e Cereais', 'cereal')
)
INSERT INTO produto (nome, nome_normalizado, preco, ativo, is_personalizado, tags, categoria_id, created_at, updated_at)
SELECT
    np.nome,
    LOWER(np.nome), -- nome_normalizado
    np.preco,
    TRUE,
    FALSE,
    np.tags,
    (SELECT id FROM categorias c WHERE c.nome = np.cat_nome LIMIT 1), -- Busca o ID da categoria pelo nome
    NOW(),
    NOW()
FROM novos_produtos np
WHERE NOT EXISTS (SELECT 1 FROM produto p WHERE p.nome = np.nome); -- Só insere se não existir


-- 3) LIMPAR VÍNCULOS ANTIGOS (Para recriar com a lógica correta)
DELETE FROM patologia_itens;


-- 4) RECRIAR VÍNCULOS COM SUGESTÕES

-- === INTOLERÂNCIA À LACTOSE ===
-- Leite -> Sugere Água Mineral
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose'),
    (SELECT id FROM produto WHERE nome = 'Leite'),
    (SELECT id FROM produto WHERE nome = 'Água Mineral'),
    NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM produto WHERE nome = 'Leite');

-- Iogurte -> Sugere Suco de Laranja
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    (SELECT id FROM patologias WHERE nome = 'Intolerância à Lactose'),
    (SELECT id FROM produto WHERE nome = 'Iogurte'),
    (SELECT id FROM produto WHERE nome = 'Suco de Laranja'),
    NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM produto WHERE nome = 'Iogurte');


-- === HIPERTENSÃO ===
-- Presunto (Se existir) -> Peito de Frango
-- Nota: Na V1 original 'Presunto' não foi inserido na tabela produto,
-- mas se você tiver inserido manualmente ou em outro script, isso vai funcionar.
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    (SELECT id FROM patologias WHERE nome = 'Hipertensão'),
    (SELECT id FROM produto WHERE nome = 'Presunto'), -- Atenção: Presunto precisa existir
    (SELECT id FROM produto WHERE nome = 'Peito de Frango'),
    NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM produto WHERE nome = 'Presunto');


-- === DOENÇA CELÍACA (GLÚTEN) ===
-- Vamos criar essa patologia caso ela não exista na V1
INSERT INTO patologias (nome, descricao, created_at, updated_at)
VALUES ('Doença Celíaca', 'Intolerância ao glúten', NOW(), NOW())
ON CONFLICT (nome) DO NOTHING;

-- Pão Francês -> Arroz Integral
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    (SELECT id FROM patologias WHERE nome = 'Doença Celíaca'),
    (SELECT id FROM produto WHERE nome = 'Pão Francês'),
    (SELECT id FROM produto WHERE nome = 'Arroz Integral'),
    NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM produto WHERE nome = 'Pão Francês');


-- === DIABETES ===
-- Açúcar -> Adoçante
-- (Novamente, verificando se Açúcar existe, pois na V1 ele não estava no INSERT de produtos)
INSERT INTO patologia_itens (patologia_id, produto_id, produto_sugestao_id, created_at, updated_at)
SELECT
    (SELECT id FROM patologias WHERE nome = 'Diabetes Mellitus'),
    (SELECT id FROM produto WHERE nome = 'Açúcar'),
    (SELECT id FROM produto WHERE nome = 'Adoçante'),
    NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM produto WHERE nome = 'Açúcar');