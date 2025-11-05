-- ===================================================================
-- Migration: Fix user_roles constraint para suportar novos RoleTypes
-- ===================================================================
-- Este script deve ser executado APENAS UMA VEZ por quem já tem o banco criado
-- Se você está clonando o projeto pela primeira vez, NÃO precisa executar isso!
-- ===================================================================

-- 1. Dropar a tabela user_roles (vai recriar automaticamente)
DROP TABLE IF EXISTS user_roles CASCADE;

-- 2. O Hibernate vai recriar a tabela automaticamente no próximo startup
-- Não precisa fazer mais nada!

-- ===================================================================
-- COMO USAR:
-- ===================================================================
-- 1. Pare a aplicação Spring Boot
-- 2. Execute este script:
--    psql -U postgres -d projeto_integrador -f fix_user_roles_constraint.sql
-- 3. Inicie a aplicação novamente
-- 4. O Hibernate recriará a tabela SEM a constraint antiga
-- ===================================================================
