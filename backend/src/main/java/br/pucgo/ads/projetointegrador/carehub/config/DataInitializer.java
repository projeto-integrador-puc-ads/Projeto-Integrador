package br.pucgo.ads.projetointegrador.carehub.config;

// ...existing imports... (Administrador not needed for carehub seeding)
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;
import br.pucgo.ads.projetointegrador.carehub.entity.Avaliacao;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.entity.Mensagem;
import br.pucgo.ads.projetointegrador.carehub.entity.Prontuario;
import br.pucgo.ads.projetointegrador.carehub.entity.RegistroAcompanhamento;
import br.pucgo.ads.projetointegrador.carehub.entity.TipoAtendimento;
import br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.AvaliacaoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.MensagemRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ProntuarioRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.RegistroAcompanhamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
// no local RoleType enum used; prefer platform Role names
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Configuration("carehubConfig")
public class DataInitializer {

	@Bean(name = "carehubDataInitializer")
	CommandLineRunner seedCarehubData(UsuarioRepository usuarioRepo,
									  ClienteRepository clienteRepo,
									  CuidadorRepository cuidadorRepo,
									  // AdministradorRepository removed: carehub should not seed admin users
									  ProntuarioRepository prontuarioRepo,
									  AgendamentoRepository agendamentoRepo,
									  AvaliacaoRepository avaliacaoRepo,
									  MensagemRepository mensagemRepo,
									  RegistroAcompanhamentoRepository registroRepo,
									  RoleRepository roleRepo,
									  PasswordEncoder encoder) {
		return args -> {
			if (clienteRepo.count() > 0) {
				return;
			}

			// Ensure a default role exists in plataforma
			Role defaultRole = roleRepo.findByName("ROLE_USER").orElseGet(() -> {
				Role r = new Role();
				r.setName("ROLE_USER");
				return roleRepo.save(r);
			});

			// Use platform roles for carehub users. Prefer explicit CareHub roles if present.
			Role cuidadorRole = roleRepo.findByName("CAREHUB_CUIDADOR").orElse(defaultRole);
			Role clienteRole = roleRepo.findByName("CAREHUB_CLIENTE").orElse(defaultRole);

			// Cliente - usando campos da tabela users
			Cliente cliente = new Cliente();
			cliente.setName("Dona Maria");
			cliente.setUsername("maria");
			cliente.setEmail("maria@example.com");
			cliente.setPassword(encoder.encode("123456"));
			// assign legacy role names as strings and platform Role entity for DB
			cliente.setRoles(Set.of("CAREHUB_CLIENTE"));
			cliente.setRole(clienteRole);
			cliente.setTelefone("62999990000");
			cliente.setAtivo(true);
			cliente.setEndereco("Rua A, 123, Goiania-GO");
			cliente.setContatoEmergencia("Filho: 62988887777");
			cliente.setTipoCliente("IDOSO");
			cliente = clienteRepo.save(cliente);

			Prontuario prontuario = new Prontuario();
			prontuario.setCliente(cliente);
			prontuario.setDataNascimento(LocalDate.of(1942, 5, 10));
			prontuario.setHistoricoMedico("Hipertensao controlada");
			prontuario.setMedicamentosUso("Losartana");
			prontuario.setAlergias("Dipirona");
			prontuario.setTipoSanguineo("O+");
			prontuario.setContatoEmergencia("Filho: 62988887777");
			prontuario.setObservacoesGerais("Precisa de auxilio em mobilidade");
			prontuarioRepo.save(prontuario);

			// Cuidador - usando campos da tabela users
			Cuidador cuidador = new Cuidador();
			cuidador.setName("Joao Cuidador");
			cuidador.setUsername("joao");
			cuidador.setEmail("joao@example.com");
			cuidador.setPassword(encoder.encode("123456"));
			cuidador.setRoles(Set.of("CAREHUB_CUIDADOR"));
			cuidador.setRole(cuidadorRole);
			cuidador.setTelefone("62911112222");
			cuidador.setAtivo(true);
			cuidador.setExperiencia("5 anos com idosos acamados");
			cuidador.setCidade("Goiania");
			cuidador.setEstado("GO");
			cuidador.setDisponibilidade(true);
			cuidador.setTaxaHora(new BigDecimal("35.00"));
			cuidador = cuidadorRepo.save(cuidador);

			 // Adicionar mais cuidadores de teste, incluindo 'Gildenor Cuidador'
			 if (!cuidadorRepo.existsByUsername("gildenor")) {
				 Cuidador gildenor = new Cuidador();
				 gildenor.setName("Gildenor Cuidador");
				 gildenor.setUsername("gildenor");
				 gildenor.setEmail("gildenor@example.com");
				 gildenor.setPassword(encoder.encode("123456"));
				 gildenor.setRoles(Set.of("CAREHUB_CUIDADOR"));
				 gildenor.setRole(cuidadorRole);
				 gildenor.setTelefone("62933334444");
				 gildenor.setAtivo(true);
				 gildenor.setExperiencia("10 anos com cuidados domiciliares");
				 gildenor.setCidade("Goiânia");
				 gildenor.setEstado("GO");
				 gildenor.setDisponibilidade(true);
				 gildenor.setTaxaHora(new BigDecimal("40.00"));
				 cuidadorRepo.save(gildenor);
			 }

		 	 // Adicionar vários cuidadores de teste com endereços/cidades distintas
		 	 String[] cidades = new String[] {"Goiânia", "Anápolis", "Trindade", "Rio Verde", "Catalão"};
		 	 for (int i = 0; i < cidades.length; i++) {
		 	 	 String uname = "cuidador_teste" + (i + 1);
		 	 	 if (!cuidadorRepo.existsByUsername(uname)) {
		 	 	 	 Cuidador ct = new Cuidador();
		 	 	 	 ct.setName("Cuidador Teste " + (i + 1));
		 	 	 	 ct.setUsername(uname);
		 	 	 	 ct.setEmail(uname + "@example.com");
		 	 	 	 ct.setPassword(encoder.encode("123456"));
		 	 	 	 ct.setRoles(Set.of("CAREHUB_CUIDADOR"));
		 	 	 	 ct.setRole(cuidadorRole);
		 	 	 	 ct.setTelefone("62970000" + (10 + i));
		 	 	 	 ct.setAtivo(true);
		 	 	 	 ct.setExperiencia((2 + i) + " anos de experiência");
		 	 	 	 ct.setCidade(cidades[i]);
		 	 	 	 ct.setEstado("GO");
		 	 	 	 ct.setDisponibilidade(i % 2 == 0);
		 	 	 	 ct.setTaxaHora(new BigDecimal(30 + i * 5));
		 	 	 	 cuidadorRepo.save(ct);
		 	 	 }
		 	 }

			 // Criar múltiplos idosos (clientes) para popular o sistema
			 for (int i = 1; i <= 5; i++) {
				 String username = "idoso" + i;
				 if (!clienteRepo.existsByUsername(username)) {
					 Cliente c = new Cliente();
					 c.setName("Idoso Teste " + i);
					 c.setUsername(username);
					 c.setEmail(username + "@example.com");
					 c.setPassword(encoder.encode("123456"));
					 c.setRoles(Set.of("CAREHUB_CLIENTE"));
					 c.setRole(clienteRole);
					 c.setTelefone("62990000" + (100 + i));
					 c.setAtivo(true);
					 clienteRepo.save(c);
				 }
			 }

			Agendamento agendamento = new Agendamento();
			agendamento.setCuidador(cuidador);
			agendamento.setCliente(cliente);
			agendamento.setDataHoraInicio(LocalDateTime.now().plusDays(1).withHour(9).withMinute(0));
			agendamento.setDataHoraFim(LocalDateTime.now().plusDays(1).withHour(12).withMinute(0));
			agendamento.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);
			agendamento.setObservacoes("Primeira visita");
			agendamento.setTipoAtendimento(TipoAtendimento.ACOMPANHAMENTO);
			agendamento = agendamentoRepo.save(agendamento);

			RegistroAcompanhamento registro = new RegistroAcompanhamento();
			registro.setAgendamento(agendamento);
			registro.setCuidador(cuidador);
			registro.setCliente(cliente);
			registro.setPressaoArterial("120/80 mmHg");
			registro.setGlicemia("95 mg/dL");
			registro.setMedicamentosAdministrados("Losartana 50mg");
			registro.setAlimentacao("Almoco completo");
			registro.setAtividadesRealizadas("Caminhada leve");
			registro.setObservacoes("Paciente apresentou boa disposicao.");
			registro.setIntercorrencias("Nenhuma");
			registro.setSinaisVitais("PA 120/80, 92 bpm");
			registroRepo.save(registro);

			Avaliacao avaliacao = new Avaliacao();
			avaliacao.setCuidador(cuidador);
			avaliacao.setCliente(cliente);
			avaliacao.setNota(5);
			avaliacao.setComentario("Excelente atendimento!");
			avaliacaoRepo.save(avaliacao);

			// Atualizar média do cuidador após criar avaliação
			cuidador.setAvaliacaoMedia(new BigDecimal("5.00"));
			cuidador.setTotalAvaliacoes(1);
			cuidadorRepo.save(cuidador);

			Mensagem mensagem = new Mensagem();
			mensagem.setRemetente(cliente);
			mensagem.setDestinatario(cuidador);
			mensagem.setConteudo("Ola Joao, combinado para amanha?");
			mensagemRepo.save(mensagem);

			// --- Dados adicionais para popular diferentes cenários ---
			// Cliente extra (se não existir)
			if (!clienteRepo.existsByUsername("idoso_extra1")) {
				Cliente extra1 = new Cliente();
				extra1.setName("Idoso Extra 1");
				extra1.setUsername("idoso_extra1");
				extra1.setEmail("idoso_extra1@example.com");
				extra1.setPassword(encoder.encode("123456"));
				extra1.setRoles(Set.of("CAREHUB_CLIENTE"));
				extra1.setRole(clienteRole);
				extra1.setTelefone("62977770001");
				extra1.setAtivo(true);
				extra1 = clienteRepo.save(extra1);

				Prontuario pextra = new Prontuario();
				pextra.setCliente(extra1);
				pextra.setDataNascimento(LocalDate.of(1948, 8, 20));
				pextra.setHistoricoMedico("Diabetes tipo 2");
				pextra.setMedicamentosUso("Metformina");
				pextra.setAlergias("Nenhuma");
				prontuarioRepo.save(pextra);

				// Agendamento pendente (cliente propôs)
				Agendamento pend = new Agendamento();
				pend.setCuidador(cuidador);
				pend.setCliente(extra1);
				pend.setDataHoraInicio(LocalDateTime.now().plusDays(2).withHour(10).withMinute(0));
				pend.setDataHoraFim(LocalDateTime.now().plusDays(2).withHour(11).withMinute(0));
				pend.setStatus(Agendamento.StatusAgendamento.PENDENTE);
				pend.setTipoAtendimento(TipoAtendimento.DOMICILIO);
				pend.setObservacoes("Proposta enviada via app");
				agendamentoRepo.save(pend);

				// Mensagens entre cliente extra e cuidador gildenor
				// Conversa inicial com o cuidador principal (Joao)
				Mensagem m1 = new Mensagem();
				m1.setRemetente(extra1);
				m1.setDestinatario(cuidador);
				m1.setConteudo("Oi, vi seu perfil e gostaria de agendar.");
				mensagemRepo.save(m1);

				Mensagem m2 = new Mensagem();
				m2.setRemetente(cuidador);
				m2.setDestinatario(extra1);
				m2.setConteudo("Olá! Podemos combinar sim. Qual horário prefere?");
				mensagemRepo.save(m2);
			}

			// Agendamento reagendado (cuidador propôs nova data)
			Agendamento reag = new Agendamento();
			reag.setCuidador(cuidador);
			reag.setCliente(cliente);
			reag.setDataHoraInicio(LocalDateTime.now().plusDays(3).withHour(14).withMinute(0));
			reag.setDataHoraFim(LocalDateTime.now().plusDays(3).withHour(15).withMinute(0));
			reag.setStatus(Agendamento.StatusAgendamento.REAGENDADO);
			reag.setTipoAtendimento(TipoAtendimento.PRESENCIAL);
			reag.setObservacoes("Cuidador sugeriu nova data devido a indisponibilidade");
			agendamentoRepo.save(reag);

			// Agendamento em andamento (agora)
			Agendamento andamento = new Agendamento();
			andamento.setCuidador(cuidador);
			andamento.setCliente(cliente);
			andamento.setDataHoraInicio(LocalDateTime.now().minusMinutes(15));
			andamento.setDataHoraFim(LocalDateTime.now().plusMinutes(45));
			andamento.setStatus(Agendamento.StatusAgendamento.EM_ANDAMENTO);
			andamento.setTipoAtendimento(TipoAtendimento.ACOMPANHAMENTO);
			andamento.setObservacoes("Atendimento em progresso (seed)");
			andamento = agendamentoRepo.save(andamento);

			// Criar registro parcial para o atendimento em andamento
			RegistroAcompanhamento regAnd = new RegistroAcompanhamento();
			regAnd.setAgendamento(andamento);
			regAnd.setCuidador(cuidador);
			regAnd.setCliente(cliente);
			regAnd.setPressaoArterial("118/76 mmHg");
			regAnd.setGlicemia("100 mg/dL");
			regAnd.setObservacoes("Registro inicial durante atendimento em andamento.");
			registroRepo.save(regAnd);

			// Agendamento concluído (passado) com avaliação
			Agendamento concluido = new Agendamento();
			concluido.setCuidador(cuidador);
			concluido.setCliente(cliente);
			concluido.setDataHoraInicio(LocalDateTime.now().minusDays(5).withHour(9).withMinute(0));
			concluido.setDataHoraFim(LocalDateTime.now().minusDays(5).withHour(11).withMinute(0));
			concluido.setStatus(Agendamento.StatusAgendamento.CONCLUIDO);
			concluido.setTipoAtendimento(TipoAtendimento.DOMICILIO);
			concluido.setObservacoes("Atendimento concluído (seed)");
			concluido = agendamentoRepo.save(concluido);

			RegistroAcompanhamento regConc = new RegistroAcompanhamento();
			regConc.setAgendamento(concluido);
			regConc.setCuidador(cuidador);
			regConc.setCliente(cliente);
			regConc.setPressaoArterial("122/80 mmHg");
			regConc.setGlicemia("92 mg/dL");
			regConc.setMedicamentosAdministrados("Losartana 50mg");
			regConc.setAtividadesRealizadas("Alongamento");
			regConc.setObservacoes("Sessão tranquila, paciente respondeu bem.");
			registroRepo.save(regConc);

			Avaliacao aval2 = new Avaliacao();
			aval2.setCuidador(cuidador);
			aval2.setCliente(cliente);
			aval2.setNota(4);
			aval2.setComentario("Boa atenção e cuidado, obrigado.");
			avaliacaoRepo.save(aval2);

			// Atualizar estatísticas simples do cuidador usando valores pré-existentes
			try {
				int prevTotal = cuidador.getTotalAvaliacoes() == null ? 0 : cuidador.getTotalAvaliacoes();
				double prevAvg = cuidador.getAvaliacaoMedia() == null ? 0.0 : cuidador.getAvaliacaoMedia().doubleValue();
				int novoTotal = prevTotal + 1; // adicionamos a avaliacao aval2 acima
				double novoAvg = (prevAvg * prevTotal + aval2.getNota()) / novoTotal;
				cuidador.setTotalAvaliacoes(novoTotal);
				cuidador.setAvaliacaoMedia(new BigDecimal(String.format("%.2f", novoAvg)));
				cuidadorRepo.save(cuidador);
			} catch (Exception ex) {
				// Se alguma operação falhar aqui, não interrompemos o seeding
			}
		};
	}
}
