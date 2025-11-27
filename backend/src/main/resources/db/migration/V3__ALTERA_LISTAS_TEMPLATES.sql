-- ================================================================
-- V3__ALTERA_LISTAS_TEMPLATES.sql
-- Ajuste de templates de lista para dietas específicas por patologia
-- ATENÇÃO: assume que:
--   - a tabela lista já possui a coluna patologia_id (NULL permitido)
--   - enum StatusLista permite apenas 'ABERTA' e 'FINALIZADA'
-- ================================================================

-- ================================================================
-- 1) NOVOS PRODUTOS PARA DIETAS ESPECÍFICAS
--    (usa mesmo padrão do script V1, idempotente com ON CONFLICT)
-- ================================================================

WITH p(nome, preco, cat, tags) AS (
    VALUES
        ('Arroz Integral',          24.90, 'Massas e Cereais', 'basico,integral'),
        ('Macarrão Integral',        8.90, 'Massas e Cereais', 'integral'),
        ('Adoçante Dietético',      12.50, 'Mercearia',        'diet'),
        ('Leite Desnatado',          6.90, 'Laticínios',       'laticinio,desnatado'),
        ('Aveia em Flocos',          7.50, 'Massas e Cereais', 'integral,fibra'),
        ('Peito de Frango',         22.90, 'Carnes e Peixes',  'proteina,magro'),
        ('Filé de Peixe',           29.90, 'Carnes e Peixes',  'proteina,magro'),
        ('Sal Light',                3.50, 'Condimentos',      'light'),
        ('Pão 100% Integral',        8.50, 'Padaria',          'padaria,integral'),
        ('Biscoito Integral',        6.90, 'Mercearia',        'integral,lanche'),
        ('Óleo de Canola',          17.90, 'Mercearia',        'gordura_boas'),
        ('Castanha de Caju',        29.90, 'Mercearia',        'oleaginosa'),
        ('Nozes',                   34.90, 'Mercearia',        'oleaginosa'),
        ('Maçã Verde',               9.90, 'Hortifruti',       'fruta'),
        ('Mamão',                    7.90, 'Hortifruti',       'fruta'),
        ('Abobrinha',                6.50, 'Hortifruti',       'hortifruti'),
        ('Brócolis',                 9.50, 'Hortifruti',       'hortifruti'),
        ('Couve-flor',               9.50, 'Hortifruti',       'hortifruti')
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
-- 2) "ARQUIVAR" TEMPLATES ANTIGOS DO USUÁRIO 'sistema'
--    -> deixa de ser template, status = 'FINALIZADA'
-- ================================================================

UPDATE lista l
SET is_template = FALSE,
    status      = 'FINALIZADA'
    FROM users u
WHERE l.user_id = u.id
  AND u.username = 'sistema'
  AND l.is_template = TRUE;

-- ================================================================
-- 3) CRIAR NOVAS LISTAS TEMPLATE POR PATOLOGIA
--    Títulos sem o prefixo "Lista - "
-- ================================================================

WITH pat AS (
    SELECT id, nome
    FROM patologias
    WHERE nome IN ('Intolerância à Lactose','Hipertensão','Diabetes Mellitus')
),
     base_user AS (
         SELECT id AS user_id
         FROM users
         WHERE username = 'sistema'
     ),
     tpl AS (
         SELECT
             'Dieta Intolerância à Lactose'::text AS titulo,
             (SELECT id FROM pat WHERE nome = 'Intolerância à Lactose') AS patologia_id
         UNION ALL
         SELECT
             'Dieta Hipertensão'::text AS titulo,
             (SELECT id FROM pat WHERE nome = 'Hipertensão') AS patologia_id
         UNION ALL
         SELECT
             'Dieta Diabetes Mellitus'::text AS titulo,
             (SELECT id FROM pat WHERE nome = 'Diabetes Mellitus') AS patologia_id
     )
INSERT INTO lista (user_id, titulo, is_template, status, patologia_id, created_at)
SELECT
    bu.user_id,
    t.titulo,
    TRUE,
    'ABERTA',
    t.patologia_id,
    NOW()
FROM base_user bu
         CROSS JOIN tpl t
WHERE NOT EXISTS (
    SELECT 1
    FROM lista l
    WHERE l.titulo = t.titulo
      AND l.is_template = TRUE
);

-- ================================================================
-- 4) ITENS DAS LISTAS TEMPLATE POR PATOLOGIA
--    Usa mesmo padrão da V1 em lista_item
-- ================================================================

-- ------------------------------------------------
-- 4.1) DIETA INTOLERÂNCIA À LACTOSE
--      -> foco em itens sem laticínios
-- ------------------------------------------------

INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id
     FROM lista
     WHERE titulo = 'Dieta Intolerância à Lactose'
       AND is_template = TRUE
        LIMIT 1)          AS lista_id,
    p.id               AS produto_id,
    1                  AS qtd,
    NOW()              AS created_at
FROM produto p
WHERE p.nome IN (
    'Arroz',
    'Feijão Carioca',
    'Feijão Preto',
    'Arroz Integral',
    'Macarrão Integral',
    'Tomate',
    'Batata',
    'Cenoura',
    'Banana',
    'Maçã',
    'Maçã Verde',
    'Laranja',
    'Limão',
    'Mamão',
    'Abobrinha',
    'Brócolis',
    'Couve-flor',
    'Pão Integral',
    'Pão 100% Integral',
    'Biscoito Integral',
    'Peito de Frango',
    'Filé de Peixe',
    'Aveia em Flocos',
    'Castanha de Caju',
    'Nozes'
    )
ON CONFLICT DO NOTHING;

-- ------------------------------------------------
-- 4.2) DIETA HIPERTENSÃO
--      -> menos processados, controle de sódio, uso de "Sal Light"
-- ------------------------------------------------

INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id
     FROM lista
     WHERE titulo = 'Dieta Hipertensão'
       AND is_template = TRUE
        LIMIT 1)          AS lista_id,
    p.id               AS produto_id,
    1                  AS qtd,
    NOW()              AS created_at
FROM produto p
WHERE p.nome IN (
    'Arroz',
    'Feijão Carioca',
    'Feijão Preto',
    'Arroz Integral',
    'Tomate',
    'Batata',
    'Cenoura',
    'Banana',
    'Maçã',
    'Maçã Verde',
    'Laranja',
    'Limão',
    'Mamão',
    'Abobrinha',
    'Brócolis',
    'Couve-flor',
    'Aveia em Flocos',
    'Óleo de Canola',
    'Peito de Frango',
    'Filé de Peixe',
    'Sal Light',
    'Castanha de Caju',
    'Nozes'
    )
ON CONFLICT DO NOTHING;

-- ------------------------------------------------
-- 4.3) DIETA DIABETES MELLITUS
--      -> foco em integrais, fibras, baixo açúcar simples
-- ------------------------------------------------

INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id
     FROM lista
     WHERE titulo = 'Dieta Diabetes Mellitus'
       AND is_template = TRUE
        LIMIT 1)          AS lista_id,
    p.id               AS produto_id,
    1                  AS qtd,
    NOW()              AS created_at
FROM produto p
WHERE p.nome IN (
    'Arroz Integral',
    'Feijão Carioca',
    'Aveia em Flocos',
    'Pão Integral',
    'Pão 100% Integral',
    'Biscoito Integral',
    'Tomate',
    'Cenoura',
    'Abobrinha',
    'Brócolis',
    'Couve-flor',
    'Banana',
    'Maçã',
    'Maçã Verde',
    'Laranja',
    'Mamão',
    'Leite Desnatado',
    'Peito de Frango',
    'Filé de Peixe',
    'Adoçante Dietético',
    'Castanha de Caju',
    'Nozes'
    )
ON CONFLICT DO NOTHING;
