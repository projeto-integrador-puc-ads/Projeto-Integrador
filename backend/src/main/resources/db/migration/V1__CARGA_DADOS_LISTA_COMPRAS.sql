-- ================================================================
-- V1__CARGA_DADOS_LISTA_COMPRAS.sql
-- Script inicial para carga de dados da base existente
-- ================================================================

-- ================================================================
-- GARANTIR UNICIDADE PARA OS ON CONFLICT
-- (usa UNIQUE INDEX ao invés de CONSTRAINT para ser idempotente)
-- ================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique
    ON users (username);

CREATE UNIQUE INDEX IF NOT EXISTS idx_categorias_nome_unique
    ON categorias (nome);

CREATE UNIQUE INDEX IF NOT EXISTS idx_produto_nome_unique
    ON produto (nome);

CREATE UNIQUE INDEX IF NOT EXISTS idx_patologias_nome_unique
    ON patologias (nome);

-- ================================================================
-- USERS + USER_ROLES
-- ================================================================

INSERT INTO users (name, username, email, password)
VALUES ('Sistema UNADE', 'sistema', 'sistema@unade.local', '{noop}changeme')
    ON CONFLICT (username) DO NOTHING;

-- ROLES conforme RoleType enum
INSERT INTO user_roles (user_id, role)
SELECT u.id, 'ROLE_USER'
FROM users u
WHERE u.username = 'sistema'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles r
    WHERE r.user_id = u.id AND r.role = 'ROLE_USER'
);

-- ================================================================
-- CATEGORIAS
-- ================================================================

WITH c(n, d) AS (
    VALUES
        ('Laticínios','Derivados do leite e similares'),
        ('Padaria','Pães e produtos de panificação'),
        ('Mercearia','Itens básicos de despensa'),
        ('Hortifruti','Frutas, legumes e verduras'),
        ('Bebidas','Sucos, chás e refrigerantes'),
        ('Limpeza','Produtos de limpeza doméstica'),
        ('Higiene','Higiene pessoal e banho'),
        ('Enlatados','Alimentos enlatados'),
        ('Condimentos','Molhos, temperos e especiarias'),
        ('Massas e Cereais','Massas, grãos e cereais'),
        ('Frios e Embutidos','Queijos, presuntos e embutidos'),
        ('Carnes e Peixes','Proteínas animais')
)
INSERT INTO categorias (nome, descricao, created_at, updated_at)
SELECT n, d, NOW(), NOW()
FROM c
    ON CONFLICT (nome) DO NOTHING;

-- ================================================================
-- PRODUTOS
-- ================================================================

WITH p(nome, preco, cat, tags) AS (
    VALUES
        ('Leite',5.99,'Laticínios','laticinio'),
        ('Iogurte',3.90,'Laticínios','laticinio'),
        ('Queijo Mussarela',39.90,'Frios e Embutidos','frios'),
        ('Queijo Minas',34.90,'Frios e Embutidos','frios'),
        ('Manteiga',12.90,'Laticínios','laticinio'),
        ('Requeijão',10.90,'Laticínios','laticinio'),
        ('Pão Integral',7.49,'Padaria','padaria'),
        ('Pão Francês',0.60,'Padaria','padaria'),
        ('Arroz',22.90,'Massas e Cereais','basico'),
        ('Feijão Carioca',10.90,'Massas e Cereais','basico'),
        ('Feijão Preto',10.90,'Massas e Cereais','basico'),
        ('Tomate',7.90,'Hortifruti','hortifruti'),
        ('Batata',5.90,'Hortifruti','hortifruti'),
        ('Cenoura',5.50,'Hortifruti','hortifruti'),
        ('Banana',6.90,'Hortifruti','fruta'),
        ('Maçã',8.90,'Hortifruti','fruta'),
        ('Laranja',6.90,'Hortifruti','fruta'),
        ('Limão',5.50,'Hortifruti','fruta'),
        ('Café',9.90,'Bebidas','bebida'),
        ('Sabonete',2.99,'Higiene','higiene'),
        ('Detergente',3.99,'Limpeza','limpeza'),
        ('Amaciante',16.90,'Limpeza','limpeza'),
        ('Desinfetante',8.90,'Limpeza','limpeza'),
        ('Álcool 70%',7.90,'Limpeza','limpeza'),
        ('Saco de Lixo',9.90,'Limpeza','limpeza')
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
-- LISTAS TEMPLATES
-- ================================================================

INSERT INTO lista (user_id, titulo, is_template, status, created_at)
SELECT u.id, x.titulo, TRUE, 'ABERTA', NOW()
FROM users u
         JOIN (VALUES
                   ('Lista - Café da Manhã'),
                   ('Lista - Feira da Semana'),
                   ('Lista - Limpeza da Casa'),
                   ('Lista - Cesta Básica')
) AS x(titulo) ON 1=1
WHERE u.username = 'sistema'
  AND NOT EXISTS (
    SELECT 1 FROM lista l
    WHERE l.titulo = x.titulo AND l.is_template = TRUE
);

-- ================================================================
-- LISTA ITEMS
-- ================================================================

-- Café da Manhã
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE titulo='Lista - Café da Manhã' AND is_template=TRUE),
    p.id, 1, NOW()
FROM produto p
WHERE p.nome IN ('Leite','Café','Pão Integral','Iogurte')
    ON CONFLICT DO NOTHING;

-- Feira da Semana
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE titulo='Lista - Feira da Semana' AND is_template=TRUE),
    p.id, 1, NOW()
FROM produto p
WHERE p.nome IN ('Arroz','Feijão Carioca','Feijão Preto','Tomate','Batata','Cenoura','Banana','Maçã','Laranja','Limão')
    ON CONFLICT DO NOTHING;

-- Limpeza da Casa
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE titulo='Lista - Limpeza da Casa' AND is_template=TRUE),
    p.id,1,NOW()
FROM produto p
WHERE p.nome IN ('Detergente','Amaciante','Desinfetante','Álcool 70%','Saco de Lixo')
    ON CONFLICT DO NOTHING;

-- Cesta Básica
INSERT INTO lista_item (lista_id, produto_id, qtd, created_at)
SELECT
    (SELECT id FROM lista WHERE titulo='Lista - Cesta Básica' AND is_template=TRUE),
    p.id, 1, NOW()
FROM produto p
WHERE p.nome IN ('Arroz','Feijão Carioca','Café','Leite')
    ON CONFLICT DO NOTHING;

-- ================================================================
-- PATOLOGIAS
-- ================================================================

INSERT INTO patologias (nome, descricao, created_at, updated_at)
VALUES
    ('Intolerância à Lactose','Dificuldade de digerir lactose',NOW(),NOW()),
    ('Hipertensão','Pressão arterial elevada',NOW(),NOW()),
    ('Diabetes Mellitus','Problemas no metabolismo da glicose',NOW(),NOW())
    ON CONFLICT (nome) DO NOTHING;

-- ================================================================
-- VÍNCULOS patologia_itens
-- (SEM mexer em DDL, respeitando tabela já existente)
-- ================================================================

-- Intolerância à Lactose
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome='Intolerância à Lactose'),
    p.id
FROM produto p
WHERE p.nome IN ('Leite','Iogurte','Queijo Mussarela','Queijo Minas','Requeijão')
    ON CONFLICT DO NOTHING;

-- Hipertensão
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome='Hipertensão'),
    p.id
FROM produto p
WHERE p.nome IN ('Sal','Presunto','Linguiça')
    ON CONFLICT DO NOTHING;

-- Diabetes
INSERT INTO patologia_itens (created_at, updated_at, patologia_id, produto_id)
SELECT
    NOW(), NOW(),
    (SELECT id FROM patologias WHERE nome='Diabetes Mellitus'),
    p.id
FROM produto p
WHERE p.nome IN ('Açúcar','Refrigerante','Achocolatado','Mel')
    ON CONFLICT DO NOTHING;

-- ================================================================
-- VINCULAR PATOLOGIAS AO USUÁRIO sistema
-- ================================================================

INSERT INTO usuario_patologias (usuario_id, patologia_id, created_at, updated_at)
SELECT u.id, pat.id, NOW(), NOW()
FROM users u
         JOIN patologias pat
              ON pat.nome IN ('Intolerância à Lactose','Hipertensão')
WHERE u.username='sistema'
    ON CONFLICT DO NOTHING;
