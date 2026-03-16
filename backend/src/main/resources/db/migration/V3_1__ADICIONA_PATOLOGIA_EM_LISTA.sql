-- ===================================================
-- V3_1__ADICIONA_PATOLOGIA_EM_LISTA.sql
-- Prepara a tabela lista para a V4, que já insere patologia_id.
-- ===================================================

ALTER TABLE public.lista
    ADD COLUMN IF NOT EXISTS patologia_id integer;

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

CREATE INDEX IF NOT EXISTS idx_lista_patologia_id
    ON public.lista (patologia_id);
