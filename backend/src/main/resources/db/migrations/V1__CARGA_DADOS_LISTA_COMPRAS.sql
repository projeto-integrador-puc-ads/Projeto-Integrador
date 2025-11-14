-- ================================================================
-- V1__seed_lista_compras.sql
-- Seed inicial para Lista de Compras (Flyway)
-- Tabelas esperadas (criadas por JPA conforme suas entidades):
--   users, user_roles, categorias, produto, lista, lista_item,
--   produto_relacionado, patologias, usuario_patologias
-- Adicional: cria patologia_itens (se não existir) para mapear risco por produto.
-- Observação: lista.user_id é NOT NULL nas entidades, então templates são atribuídos ao usuário 'sistema'.
-- ================================================================

BEGIN;

-- 1) Usuário 'sistema' --------------------------------------------------------
INSERT INTO users (name, username, email, password)
VALUES ('Sistema UNADE', 'sistema', 'sistema@unade.local', '{noop}changeme')
    ON CONFLICT (username) DO NOTHING;

-- garantir ROLE USER
INSERT INTO user_roles (user_id, role)
SELECT u.id, 'USER'
FROM users u
WHERE u.username = 'sistema'
  AND NOT EXISTS (SELECT 1 FROM user_roles r WHERE r.user_id = u.id AND r.role = 'USER');

-- referenciar o id do usuário sistema
WITH sel AS (SELECT id FROM users WHERE username = 'sistema' LIMIT 1)
SELECT 1;

-- 2) Categorias ---------------------------------------------------------------
WITH c(n, d) AS (
    VALUES
        ('Laticínios', 'Derivados do leite e similares'),
        ('Padaria', 'Pães e produtos de panificação'),
        ('Mercearia', 'Itens básicos de despensa'),
        ('Hortifruti', 'Frutas, legumes e verduras'),
        ('Bebidas', 'Sucos, chás e refrigerantes'),
        ('Limpeza', 'Produtos de limpeza doméstica'),
        ('Higiene', 'Higiene pessoal e banho'),
        ('Enlatados', 'Alimentos enlatados'),
        ('Condimentos', 'Molhos, temperos e especiarias'),
        ('Massas e Cereais', 'Massas, grãos e cereais'),
        ('Frios e Embutidos', 'Queijos, presuntos, embutidos'),
        ('Carnes e Peixes', 'Proteínas animais frescas ou congeladas')
)
INSERT INTO categorias (nome, descricao)
SELECT n, d FROM c
    ON CONFLICT (nome) DO NOTHING;

-- 3) Produtos (80+) -----------------------------------------------------------
-- Observação: nome_normalizado simples (LOWER); a aplicação pode tratar acentos.
WITH p(nome, preco, cat, tags) AS (
    VALUES
        ('Leite',                 5.99,  'Laticínios',       'bebida,laticinio'),
        ('Iogurte',               3.90,  'Laticínios',       'laticinio,matinal'),
        ('Queijo Mussarela',     39.90,  'Frios e Embutidos','laticinio,frios'),
        ('Queijo Minas',         34.90,  'Frios e Embutidos','laticinio,frios'),
        ('Manteiga',             12.90,  'Laticínios',       'laticinio'),
        ('Requeijão',            10.90,  'Laticínios',       'laticinio'),
        ('Pão Integral',          7.49,  'Padaria',          'padaria'),
        ('Pão Francês',           0.60,  'Padaria',          'padaria'),
        ('Biscoito Maizena',      4.90,  'Mercearia',        'biscoito'),
        ('Biscoito Recheado',     6.90,  'Mercearia',        'biscoito,doce'),
        ('Arroz',                22.90,  'Massas e Cereais', 'mercearia,basico'),
        ('Arroz Integral',       26.90,  'Massas e Cereais', 'mercearia,basico'),
        ('Feijão Carioca',       10.90,  'Massas e Cereais', 'mercearia,basico'),
        ('Feijão Preto',         10.90,  'Massas e Cereais', 'mercearia,basico'),
        ('Macarrão Espaguete',    6.90,  'Massas e Cereais', 'massa,mercearia'),
        ('Macarrão Parafuso',     7.40,  'Massas e Cereais', 'massa,mercearia'),
        ('Aveia em Flocos',       6.90,  'Massas e Cereais', 'cereal,matinal'),
        ('Granola',              14.90,  'Massas e Cereais', 'cereal,matinal'),
        ('Farinha de Trigo',      5.50,  'Mercearia',        'confeitaria'),
        ('Fubá',                  4.90,  'Mercearia',        'cereal,mercearia'),
        ('Polvilho Doce',         7.90,  'Mercearia',        'mercearia'),
        ('Açúcar',                4.20,  'Mercearia',        'basico'),
        ('Sal',                   2.50,  'Mercearia',        'tempero'),
        ('Óleo de Soja',          6.99,  'Mercearia',        'oleo'),
        ('Azeite de Oliva',      29.90,  'Mercearia',        'oleo'),
        ('Molho de Tomate',       4.90,  'Condimentos',      'molho'),
        ('Ketchup',               9.90,  'Condimentos',      'condimento'),
        ('Maionese',              9.90,  'Condimentos',      'condimento'),
        ('Mostarda',              7.90,  'Condimentos',      'condimento'),
        ('Pimenta-do-Reino',      7.90,  'Condimentos',      'tempero'),
        ('Orégano',               3.90,  'Condimentos',      'tempero'),
        ('Alho',                  3.90,  'Hortifruti',       'tempero'),
        ('Cebola',                4.90,  'Hortifruti',       'tempero'),
        ('Tomate',                7.90,  'Hortifruti',       'hortifruti'),
        ('Alface',                4.50,  'Hortifruti',       'hortifruti'),
        ('Batata',                5.90,  'Hortifruti',       'hortifruti'),
        ('Cenoura',               5.50,  'Hortifruti',       'hortifruti'),
        ('Banana',                6.90,  'Hortifruti',       'fruta,hortifruti'),
        ('Maçã',                  8.90,  'Hortifruti',       'fruta,hortifruti'),
        ('Laranja',               6.90,  'Hortifruti',       'fruta,hortifruti'),
        ('Limão',                 5.50,  'Hortifruti',       'fruta,hortifruti'),
        ('Café',                  9.90,  'Bebidas',          'bebida,matinal'),
        ('Chá Preto',             6.90,  'Bebidas',          'bebida,cha'),
        ('Chá de Camomila',       7.90,  'Bebidas',          'bebida,cha'),
        ('Achocolatado',          8.90,  'Bebidas',          'bebida,matinal'),
        ('Refrigerante',          8.90,  'Bebidas',          'bebida,refrigerante'),
        ('Suco de Laranja',       7.90,  'Bebidas',          'bebida,suco'),
        ('Água Mineral',          2.90,  'Bebidas',          'bebida'),
        ('Peito de Frango',      22.90,  'Carnes e Peixes',  'aves,proteina'),
        ('Carne Moída',          34.90,  'Carnes e Peixes',  'bovino,proteina'),
        ('Filé de Peixe',        36.90,  'Carnes e Peixes',  'peixe,proteina'),
        ('Presunto',             34.90,  'Frios e Embutidos','frios,embutido'),
        ('Linguiça',             24.90,  'Frios e Embutidos','frios,embutido'),
        ('Atum Enlatado',        11.90,  'Enlatados',        'peixe,enlatado'),
        ('Sardinha Enlatada',     7.90,  'Enlatados',        'peixe,enlatado'),
        ('Milho Enlatado',        4.90,  'Enlatados',        'hortalica,enlatado'),
        ('Ervilha Enlatada',      4.90,  'Enlatados',        'hortalica,enlatado'),
        ('Creme de Leite',        4.99,  'Laticínios',       'confeitaria,laticinio'),
        ('Leite Condensado',      6.99,  'Laticínios',       'confeitaria,laticinio'),
        ('Papel Higiênico',      16.90,  'Higiene',          'higiene'),
        ('Sabonete',              2.99,  'Higiene',          'higiene'),
        ('Shampoo',              12.90,  'Higiene',          'higiene'),
        ('Condicionador',        12.90,  'Higiene',          'higiene'),
        ('Pasta de Dente',        5.90,  'Higiene',          'higiene'),
        ('Escova de Dente',       6.90,  'Higiene',          'higiene'),
        ('Detergente',            3.99,  'Limpeza',          'limpeza'),
        ('Esponja de Louça',      2.99,  'Limpeza',          'limpeza'),
        ('Sabão em Pó',          18.90,  'Limpeza',          'limpeza'),
        ('Amaciante',            16.90,  'Limpeza',          'limpeza'),
        ('Desinfetante',          8.90,  'Limpeza',          'limpeza'),
        ('Álcool 70%',            7.90,  'Limpeza',          'limpeza'),
        ('Saco de Lixo',          9.90,  'Limpeza',          'limpeza'),
        ('Papel Toalha',          7.90,  'Limpeza',          'limpeza'),
        ('Queijo Prato',         36.90,  'Frios e Embutidos','laticinio,frios'),
        ('Ricota',               24.90,  'Frios e Embutidos','laticinio'),
        ('Granulado',             4.90,  'Mercearia',        'confeitaria'),
        ('Mel',                  18.90,  'Mercearia',        'matinal,doce')
)
INSERT INTO produto (nome, nome_normalizado, preco, ativo, is_personalizado, tags, categoria_id, created_at, updated_at)
SELECT
    p.nome,
    LOWER(p.nome),
    p.preco,
    TRUE,
    FALSE,
    p.tags,
    (SELECT c.id FROM categorias c WHERE c.nome = p.cat LIMIT 1),
  NOW(),
  NOW()
FROM p
ON CONFLICT (nome) DO NOTHING;

-- 4) Templates (atribuídos ao usuário 'sistema' por causa do NOT NULL) --------
INSERT INTO lista (user_id, titulo, is_template, created_at)
SELECT u.id, x.titulo, TRUE, NOW()
FROM users u
         JOIN (VALUES
                   ('Lista - Café da Manhã'),
                   ('Lista - Feira da Semana'),
                   ('Lista - Limpeza da Casa'),
                   ('Lista - Cesta Básica')
) AS x(titulo) ON 1=1
WHERE u.username = 'sistema'
  AND NOT EXISTS (SELECT 1 FROM lista l WHERE l.titulo = x.titulo AND l.is_template = TRUE);

-- 5) Itens dos templates ------------------------------------------------------
-- Café da Manhã
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE is_template=TRUE AND titulo='Lista - Café da Manhã'),
    p.id, 1.00, NOW()
FROM produto p
WHERE p.nome IN ('Leite','Café','Pão Integral','Iogurte','Achocolatado')
    ON CONFLICT DO NOTHING;

-- Feira da Semana
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE is_template=TRUE AND titulo='Lista - Feira da Semana'),
    p.id, 1.00, NOW()
FROM produto p
WHERE p.nome IN ('Arroz','Feijão Carioca','Feijão Preto','Tomate','Alface','Batata','Cenoura','Banana','Maçã','Laranja','Limão','Cebola','Alho')
    ON CONFLICT DO NOTHING;

-- Limpeza da Casa
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE is_template=TRUE AND titulo='Lista - Limpeza da Casa'),
    p.id, 1.00, NOW()
FROM produto p
WHERE p.nome IN ('Detergente','Esponja de Louça','Sabão em Pó','Amaciante','Desinfetante','Álcool 70%','Saco de Lixo','Papel Toalha')
    ON CONFLICT DO NOTHING;

-- Cesta Básica
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE is_template=TRUE AND titulo='Lista - Cesta Básica'),
    p.id, 1.00, NOW()
FROM produto p
WHERE p.nome IN ('Arroz','Feijão Carioca','Macarrão Espaguete','Óleo de Soja','Sal','Açúcar','Café','Leite','Molho de Tomate','Farinha de Trigo')
    ON CONFLICT DO NOTHING;

-- 6) Recomendações (produto_relacionado) -------------------------------------
-- Afinidades iniciais arbitrárias (0.55~0.90).
WITH pares AS (
    SELECT 'Café' a, 'Filtro de Papel' b, 0.80::numeric AS af UNION ALL
    SELECT 'Arroz','Feijão Carioca',0.90 UNION ALL
    SELECT 'Feijão Carioca','Arroz',0.85 UNION ALL
    SELECT 'Molho de Tomate','Macarrão Espaguete',0.78 UNION ALL
    SELECT 'Macarrão Espaguete','Molho de Tomate',0.76 UNION ALL
    SELECT 'Leite','Pão Integral',0.60 UNION ALL
    SELECT 'Pão Integral','Manteiga',0.58 UNION ALL
    SELECT 'Manteiga','Pão Integral',0.62 UNION ALL
    SELECT 'Tomate','Cebola',0.60 UNION ALL
    SELECT 'Cebola','Alho',0.72 UNION ALL
    SELECT 'Detergente','Esponja de Louça',0.82 UNION ALL
    SELECT 'Sabão em Pó','Amaciante',0.76
),
     ids AS (
         SELECT p1.id AS produto_id, p2.id AS similar_id, pares.af
         FROM pares
                  JOIN produto p1 ON p1.nome = pares.a
                  JOIN produto p2 ON p2.nome = pares.b
     )
INSERT INTO produto_relacionado (produto_id, similar_id, afinidade, atualizado_em)
SELECT produto_id, similar_id, af, NOW()
FROM ids
    ON CONFLICT (produto_id, similar_id) DO NOTHING;

-- Derivar recomendações por coocorrência de templates (A->B, B->A) com afinidade base 0.60
INSERT INTO produto_relacionado (produto_id, similar_id, afinidade, atualizado_em)
SELECT li1.produto_id, li2.produto_id, 0.60, NOW()
FROM lista_item li1
         JOIN lista_item li2
              ON li1.lista_id = li2.lista_id
                  AND li1.produto_id <> li2.produto_id
         JOIN lista l ON l.id = li1.lista_id AND l.is_template = TRUE
    ON CONFLICT (produto_id, similar_id) DO NOTHING;

-- 7) Patologias e patologia_itens --------------------------------------------
INSERT INTO patologias (nome, descricao, created_at, updated_at)
VALUES
    ('Intolerância à Lactose','Dificuldade de digerir lactose', NOW(), NOW()),
    ('Doença Celíaca (Glúten)','Reação ao glúten', NOW(), NOW()),
    ('Hipertensão','Pressão arterial elevada', NOW(), NOW()),
    ('Diabetes Mellitus','Alteração no metabolismo da glicose', NOW(), NOW())
    ON CONFLICT (nome) DO NOTHING;

-- tabela auxiliar (se não existir)
CREATE TABLE IF NOT EXISTS patologia_itens (
                                               id BIGSERIAL PRIMARY KEY,
                                               patologia_id BIGINT NOT NULL REFERENCES patologias(id) ON DELETE CASCADE,
    produto_id   BIGINT NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
    nivel        TEXT NOT NULL CHECK (nivel IN ('baixa','media','alta')),
    UNIQUE (patologia_id, produto_id)
    );

-- Lactose
INSERT INTO patologia_itens (patologia_id, produto_id, nivel)
SELECT (SELECT id FROM patologias WHERE nome='Intolerância à Lactose'),
       p.id, x.nivel
FROM produto p
         JOIN (VALUES
                   ('Leite','alta'),
                   ('Iogurte','media'),
                   ('Queijo Mussarela','media'),
                   ('Queijo Minas','media'),
                   ('Creme de Leite','media'),
                   ('Leite Condensado','alta'),
                   ('Requeijão','media'),
                   ('Achocolatado','baixa')
) AS x(nome, nivel) ON x.nome = p.nome
    ON CONFLICT DO NOTHING;

-- Glúten
INSERT INTO patologia_itens (patologia_id, produto_id, nivel)
SELECT (SELECT id FROM patologias WHERE nome='Doença Celíaca (Glúten)'),
       p.id, x.nivel
FROM produto p
         JOIN (VALUES
                   ('Pão Integral','alta'),
                   ('Pão Francês','alta'),
                   ('Macarrão Espaguete','media'),
                   ('Macarrão Parafuso','media'),
                   ('Farinha de Trigo','alta'),
                   ('Biscoito Maizena','media'),
                   ('Biscoito Recheado','media')
) AS x(nome, nivel) ON x.nome = p.nome
    ON CONFLICT DO NOTHING;

-- Hipertensão (sódio)
INSERT INTO patologia_itens (patologia_id, produto_id, nivel)
SELECT (SELECT id FROM patologias WHERE nome='Hipertensão'),
       p.id, x.nivel
FROM produto p
         JOIN (VALUES
                   ('Sal','alta'),
                   ('Presunto','media'),
                   ('Linguiça','media'),
                   ('Refrigerante','baixa')
) AS x(nome, nivel) ON x.nome = p.nome
    ON CONFLICT DO NOTHING;

-- Diabetes (açúcares simples)
INSERT INTO patologia_itens (patologia_id, produto_id, nivel)
SELECT (SELECT id FROM patologias WHERE nome='Diabetes Mellitus'),
       p.id, x.nivel
FROM produto p
         JOIN (VALUES
                   ('Açúcar','alta'),
                   ('Achocolatado','media'),
                   ('Refrigerante','media'),
                   ('Granola','baixa'),
                   ('Mel','media')
) AS x(nome, nivel) ON x.nome = p.nome
    ON CONFLICT DO NOTHING;

-- 8) Vincular patologias ao usuário 'sistema' --------------------------------
INSERT INTO usuario_patologias (usuario_id, patologia_id, created_at, updated_at)
SELECT u.id, pat.id, NOW(), NOW()
FROM users u
         JOIN patologias pat ON pat.nome IN ('Intolerância à Lactose','Hipertensão')
WHERE u.username = 'sistema'
    ON CONFLICT (usuario_id, patologia_id) DO NOTHING;

COMMIT;
