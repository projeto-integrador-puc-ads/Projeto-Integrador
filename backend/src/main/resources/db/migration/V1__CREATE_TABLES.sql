-- ================================================================
-- V0_1__CREATE_TABLES.sql
-- Cria a estrutura base de forma idempotente para bancos limpos
-- sem alterar o checksum do historico ja aplicado a partir da V1.
-- ================================================================

-- ===================================================
-- USERS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.users (
                              id serial PRIMARY KEY,
                              name text,
                              username text NOT NULL UNIQUE,
                              email text NOT NULL UNIQUE,
                              password text NOT NULL
);

-- ===================================================
-- USER ROLES
-- ===================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
                                   user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                                   role text NOT NULL,
                                   CONSTRAINT user_roles_pk PRIMARY KEY (user_id, role)
);

-- ===================================================
-- CATEGORIAS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.categorias (
                                   id serial PRIMARY KEY,
                                   nome text NOT NULL UNIQUE,
                                   descricao text,
                                   created_at timestamp without time zone DEFAULT now(),
                                   updated_at timestamp without time zone DEFAULT now()
);

-- ===================================================
-- PRODUTOS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.produto (
                                id serial PRIMARY KEY,
                                nome text NOT NULL UNIQUE,
                                nome_normalizado text,
                                preco numeric(12,2),
                                ativo boolean DEFAULT true,
                                is_personalizado boolean NOT NULL DEFAULT false,
                                tags text,
                                categoria_id integer REFERENCES public.categorias(id),
                                created_at timestamp without time zone DEFAULT now(),
                                updated_at timestamp without time zone DEFAULT now()
);

-- ===================================================
-- LISTAS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.lista (
                              id serial PRIMARY KEY,
                              user_id integer REFERENCES public.users(id) ON DELETE CASCADE,
                              titulo text NOT NULL,
                              is_template boolean NOT NULL DEFAULT false,
                              status text,
                              created_at timestamp without time zone DEFAULT now()
);

-- ===================================================
-- ITENS DA LISTA
-- ===================================================
CREATE TABLE IF NOT EXISTS public.lista_item (
                                   lista_id integer NOT NULL REFERENCES public.lista(id) ON DELETE CASCADE,
                                   produto_id integer NOT NULL REFERENCES public.produto(id) ON DELETE CASCADE,
                                   qtd numeric(10,2) DEFAULT 1,
                                   created_at timestamp without time zone DEFAULT now(),
                                   CONSTRAINT lista_item_pkey PRIMARY KEY (lista_id, produto_id)
);

-- ===================================================
-- PRODUTOS RELACIONADOS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.produto_relacionado (
                                            produto_id integer NOT NULL REFERENCES public.produto(id) ON DELETE CASCADE,
                                            similar_id integer NOT NULL REFERENCES public.produto(id) ON DELETE CASCADE,
                                            afinidade numeric(6,4) NOT NULL DEFAULT 0.0,
                                            atualizado_em timestamp without time zone DEFAULT now(),
                                            CONSTRAINT produto_relacionado_pk PRIMARY KEY (produto_id, similar_id),
                                            CONSTRAINT produto_relacionado_diff CHECK (produto_id <> similar_id)
);

-- ===================================================
-- PATOLOGIAS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.patologias (
                                   id serial PRIMARY KEY,
                                   nome text NOT NULL UNIQUE,
                                   descricao text,
                                   created_at timestamp without time zone DEFAULT now(),
                                   updated_at timestamp without time zone DEFAULT now()
);

-- ===================================================
-- PATOLOGIA_ITENS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.patologia_itens (
                                        id serial PRIMARY KEY,
                                        patologia_id integer NOT NULL REFERENCES public.patologias(id) ON DELETE CASCADE,
                                        produto_id integer NOT NULL REFERENCES public.produto(id) ON DELETE CASCADE,
                                        created_at timestamp without time zone DEFAULT now(),
                                        updated_at timestamp without time zone DEFAULT now(),
                                        CONSTRAINT uq_patologia_itens UNIQUE (patologia_id, produto_id)
);

-- ===================================================
-- USUARIO_PATOLOGIAS
-- ===================================================
CREATE TABLE IF NOT EXISTS public.usuario_patologias (
                                           id serial PRIMARY KEY,
                                           usuario_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                                           patologia_id integer NOT NULL REFERENCES public.patologias(id) ON DELETE CASCADE,
                                           created_at timestamp without time zone DEFAULT now(),
                                           updated_at timestamp without time zone DEFAULT now(),
                                           CONSTRAINT uq_usuario_patologias UNIQUE (usuario_id, patologia_id)
);
