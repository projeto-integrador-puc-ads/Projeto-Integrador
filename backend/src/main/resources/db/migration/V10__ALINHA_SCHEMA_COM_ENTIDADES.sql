-- ===================================================
-- V10__ALINHA_SCHEMA_COM_ENTIDADES.sql
-- Ajustes incrementais para manter compatibilidade com as
-- entidades JPA sem alterar o checksum da V1 já aplicada.
-- ===================================================

ALTER TABLE public.produto
    ADD COLUMN IF NOT EXISTS categoria_id integer;

ALTER TABLE public.lista
    ADD COLUMN IF NOT EXISTS patologia_id integer;

ALTER TABLE public.patologia_itens
    ADD COLUMN IF NOT EXISTS produto_sugestao_id integer;

UPDATE public.lista
SET status = 'ABERTA'
WHERE status IS NULL;

ALTER TABLE public.lista
    ALTER COLUMN status SET DEFAULT 'ABERTA';

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'produto'
          AND column_name = 'categoria_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM public.produto
        WHERE categoria_id IS NULL
    ) THEN
        ALTER TABLE public.produto
            ALTER COLUMN categoria_id SET NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'lista'
          AND column_name = 'user_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM public.lista
        WHERE user_id IS NULL
    ) THEN
        ALTER TABLE public.lista
            ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'lista'
          AND column_name = 'status'
    ) AND NOT EXISTS (
        SELECT 1
        FROM public.lista
        WHERE status IS NULL
    ) THEN
        ALTER TABLE public.lista
            ALTER COLUMN status SET NOT NULL;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.historico_compras (
    id serial PRIMARY KEY,
    usuario_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    produto_a_id integer NOT NULL REFERENCES public.produto(id) ON DELETE CASCADE,
    produto_b_id integer NOT NULL REFERENCES public.produto(id) ON DELETE CASCADE,
    frequencia integer NOT NULL DEFAULT 0,
    confianca double precision NOT NULL DEFAULT 0.0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT uq_historico_compras UNIQUE (usuario_id, produto_a_id, produto_b_id),
    CONSTRAINT ck_historico_compras_produtos_diferentes CHECK (produto_a_id <> produto_b_id)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_lista_patologia'
    ) THEN
        ALTER TABLE public.lista
            ADD CONSTRAINT fk_lista_patologia
                FOREIGN KEY (patologia_id) REFERENCES public.patologias(id) ON DELETE SET NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_patologia_itens_produto_sugestao'
    ) THEN
        ALTER TABLE public.patologia_itens
            ADD CONSTRAINT fk_patologia_itens_produto_sugestao
                FOREIGN KEY (produto_sugestao_id) REFERENCES public.produto(id) ON DELETE SET NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ck_lista_status'
    ) THEN
        ALTER TABLE public.lista
            ADD CONSTRAINT ck_lista_status
                CHECK (status IN ('ABERTA', 'FINALIZADA'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_lista_patologia_id
    ON public.lista (patologia_id);

CREATE INDEX IF NOT EXISTS idx_patologia_itens_produto_sugestao_id
    ON public.patologia_itens (produto_sugestao_id);
