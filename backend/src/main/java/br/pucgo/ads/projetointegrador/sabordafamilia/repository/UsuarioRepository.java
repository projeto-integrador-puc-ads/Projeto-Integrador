package br.pucgo.ads.projetointegrador.sabordafamilia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {}