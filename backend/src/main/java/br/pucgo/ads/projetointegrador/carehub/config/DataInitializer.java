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
			// =======================================================
			// IMPORTANTE: Criar roles ANTES de verificar se há dados
			// Isso garante que os roles existam mesmo com dados antigos
			// =======================================================
			
			// Ensure a default role exists in plataforma
			Role defaultRole = roleRepo.findByName("ROLE_USER").orElseGet(() -> {
				Role r = new Role();
				r.setName("ROLE_USER");
				return roleRepo.save(r);
			});

			// Create CareHub-specific roles if they don't exist
			Role cuidadorRole = roleRepo.findByName("CAREHUB_CUIDADOR").orElseGet(() -> {
				Role r = new Role();
				r.setName("CAREHUB_CUIDADOR");
				r.setCode("CAREHUB_CUIDADOR");
				return roleRepo.save(r);
			});
			
			Role clienteRole = roleRepo.findByName("CAREHUB_CLIENTE").orElseGet(() -> {
				Role r = new Role();
				r.setName("CAREHUB_CLIENTE");
				r.setCode("CAREHUB_CLIENTE");
				return roleRepo.save(r);
			});
			
			// Atualizar endereços de clientes existentes que estão vazios
			atualizarEnderecosClientesExistentes(clienteRepo);
			
			// Atualizar roles de usuários existentes que estão com role errada
			atualizarRolesUsuariosExistentes(cuidadorRepo, clienteRepo, cuidadorRole, clienteRole);
			
			if (clienteRepo.count() > 0) {
				return;
			}

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
			cliente.setEndereco("Rua A, 123, Setor Central, Goiânia-GO");
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
			 // Endereços de Goiânia e região para os idosos
			 String[] enderecosIdosos = new String[] {
				 "Rua 10, 456, Setor Oeste, Goiânia-GO",
				 "Av. T-63, 789, Setor Bueno, Goiânia-GO",
				 "Rua das Flores, 123, Centro, Anápolis-GO",
				 "Av. Brasil, 321, Setor Central, Aparecida de Goiânia-GO",
				 "Rua 5, 654, Jardim América, Goiânia-GO"
			 };
			 String[] contatosEmergencia = new String[] {
				 "Filho(a): 62988881111",
				 "Filha: 62988882222",
				 "Neto: 62988883333",
				 "Sobrinha: 62988884444",
				 "Vizinha: 62988885555"
			 };
			 
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
					 c.setEndereco(enderecosIdosos[i - 1]);
					 c.setContatoEmergencia(contatosEmergencia[i - 1]);
					 c.setTipoCliente("IDOSO");
					 c.setNecessidades("Acompanhamento diário e auxílio com medicação");
					 clienteRepo.save(c);
				 }
			 }

			// Buscar Gildenor para os agendamentos
			Cuidador gildenorAgendamento = cuidadorRepo.findByUsername("gildenor").orElse(cuidador);
			
			// Avaliação de Maria para Gildenor (agendamento concluído anterior) - CRIAR PRIMEIRO
			Agendamento agendamentoConcluido1 = new Agendamento();
			agendamentoConcluido1.setCuidador(gildenorAgendamento);
			agendamentoConcluido1.setCliente(cliente);
			agendamentoConcluido1.setDataHoraInicio(LocalDateTime.now().minusDays(7).withHour(9).withMinute(0));
			agendamentoConcluido1.setDataHoraFim(LocalDateTime.now().minusDays(7).withHour(12).withMinute(0));
			agendamentoConcluido1.setStatus(Agendamento.StatusAgendamento.CONCLUIDO);
			agendamentoConcluido1.setObservacoes("Primeiro atendimento - Concluído");
			agendamentoConcluido1.setTipoAtendimento(TipoAtendimento.DOMICILIO);
			agendamentoConcluido1 = agendamentoRepo.save(agendamentoConcluido1);
			
			// Agendamento concluído com João - CRIAR ANTES DO REGISTRO
			Agendamento agendamentoConcluidoJoao = new Agendamento();
			agendamentoConcluidoJoao.setCuidador(cuidador);
			agendamentoConcluidoJoao.setCliente(cliente);
			agendamentoConcluidoJoao.setDataHoraInicio(LocalDateTime.now().minusDays(10).withHour(14).withMinute(0));
			agendamentoConcluidoJoao.setDataHoraFim(LocalDateTime.now().minusDays(10).withHour(16).withMinute(0));
			agendamentoConcluidoJoao.setStatus(Agendamento.StatusAgendamento.CONCLUIDO);
			agendamentoConcluidoJoao.setObservacoes("Atendimento regular");
			agendamentoConcluidoJoao.setTipoAtendimento(TipoAtendimento.ACOMPANHAMENTO);
			agendamentoConcluidoJoao = agendamentoRepo.save(agendamentoConcluidoJoao);
			
			// Agendamento confirmado entre Maria e Gildenor para amanhã
			Agendamento agendamento = new Agendamento();
			agendamento.setCuidador(gildenorAgendamento);
			agendamento.setCliente(cliente);
			agendamento.setDataHoraInicio(LocalDateTime.now().plusDays(1).withHour(9).withMinute(0));
			agendamento.setDataHoraFim(LocalDateTime.now().plusDays(1).withHour(12).withMinute(0));
			agendamento.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);
			agendamento.setObservacoes("Auxílio com medicação e acompanhamento");
			agendamento.setTipoAtendimento(TipoAtendimento.ACOMPANHAMENTO);
			agendamento = agendamentoRepo.save(agendamento);
			
			// Agendamento adicional com João
			Agendamento agendamentoJoao = new Agendamento();
			agendamentoJoao.setCuidador(cuidador);
			agendamentoJoao.setCliente(cliente);
			agendamentoJoao.setDataHoraInicio(LocalDateTime.now().plusDays(3).withHour(14).withMinute(0));
			agendamentoJoao.setDataHoraFim(LocalDateTime.now().plusDays(3).withHour(16).withMinute(0));
			agendamentoJoao.setStatus(Agendamento.StatusAgendamento.PENDENTE);
			agendamentoJoao.setObservacoes("Avaliação semanal");
			agendamentoJoao.setTipoAtendimento(TipoAtendimento.DOMICILIO);
			agendamentoRepo.save(agendamentoJoao);

			// Registro de acompanhamento do atendimento concluído com Gildenor
			RegistroAcompanhamento registroGildenor = new RegistroAcompanhamento();
			registroGildenor.setAgendamento(agendamentoConcluido1);
			registroGildenor.setCuidador(gildenorAgendamento);
			registroGildenor.setCliente(cliente);
			registroGildenor.setPressaoArterial("125/85 mmHg");
			registroGildenor.setGlicemia("98 mg/dL");
			registroGildenor.setMedicamentosAdministrados("Losartana 50mg às 8h");
			registroGildenor.setAlimentacao("Café da manhã completo e lanche da tarde");
			registroGildenor.setAtividadesRealizadas("Exercícios de alongamento e caminhada de 15 minutos");
			registroGildenor.setObservacoes("Paciente estava bem disposta e colaborativa.");
			registroGildenor.setIntercorrencias("Nenhuma");
			registroGildenor.setSinaisVitais("PA 125/85, FC 88 bpm, Temp 36.5°C");
			registroRepo.save(registroGildenor);
			
			// Registro do atendimento do João
			RegistroAcompanhamento registro = new RegistroAcompanhamento();
			registro.setAgendamento(agendamentoConcluidoJoao);
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
			
			Avaliacao avaliacaoGildenor = new Avaliacao();
			avaliacaoGildenor.setCuidador(gildenorAgendamento);
			avaliacaoGildenor.setCliente(cliente);
			avaliacaoGildenor.setAgendamento(agendamentoConcluido1);
			avaliacaoGildenor.setNota(5);
			avaliacaoGildenor.setComentario("Gildenor é muito atencioso e cuidadoso. Recomendo!");
			avaliacaoRepo.save(avaliacaoGildenor);

			// Atualizar média do Gildenor após criar avaliação
			gildenorAgendamento.setAvaliacaoMedia(new BigDecimal("5.00"));
			gildenorAgendamento.setTotalAvaliacoes(1);
			cuidadorRepo.save(gildenorAgendamento);
			
			// Avaliação para João (agendamento já foi criado acima)
			Avaliacao avaliacao = new Avaliacao();
			avaliacao.setCuidador(cuidador);
			avaliacao.setCliente(cliente);
			avaliacao.setAgendamento(agendamentoConcluidoJoao);
			avaliacao.setNota(5);
			avaliacao.setComentario("Excelente atendimento!");
			avaliacaoRepo.save(avaliacao);

			// Atualizar média do cuidador João após criar avaliação
			cuidador.setAvaliacaoMedia(new BigDecimal("5.00"));
			cuidador.setTotalAvaliacoes(1);
			cuidadorRepo.save(cuidador);

			// Mensagens entre Maria e Gildenor (buscar Gildenor)
			Cuidador gildenorCuidador = cuidadorRepo.findByUsername("gildenor").orElse(cuidador);
			
			// Conversa com mensagens variadas para teste
			Mensagem m1 = new Mensagem();
			m1.setRemetente(cliente);
			m1.setDestinatario(gildenorCuidador);
			m1.setConteudo("Olá Gildenor, tudo bem? Gostaria de conversar sobre os cuidados.");
			m1.setDataEnvio(LocalDateTime.now().minusHours(5));
			mensagemRepo.save(m1);

			Mensagem m2 = new Mensagem();
			m2.setRemetente(gildenorCuidador);
			m2.setDestinatario(cliente);
			m2.setConteudo("Olá Dona Maria! Tudo ótimo. Fico à disposição para ajudá-la.");
			m2.setDataEnvio(LocalDateTime.now().minusHours(4).minusMinutes(50));
			mensagemRepo.save(m2);

			Mensagem m3 = new Mensagem();
			m3.setRemetente(cliente);
			m3.setDestinatario(gildenorCuidador);
			m3.setConteudo("Preciso de ajuda com a medicação. Você poderia vir amanhã?");
			m3.setDataEnvio(LocalDateTime.now().minusHours(4).minusMinutes(30));
			mensagemRepo.save(m3);

			Mensagem m4 = new Mensagem();
			m4.setRemetente(gildenorCuidador);
			m4.setDestinatario(cliente);
			m4.setConteudo("Claro! Posso ir às 9h da manhã. Está bom para a senhora?");
			m4.setDataEnvio(LocalDateTime.now().minusHours(4).minusMinutes(15));
			mensagemRepo.save(m4);

			Mensagem m5 = new Mensagem();
			m5.setRemetente(cliente);
			m5.setDestinatario(gildenorCuidador);
			m5.setConteudo("Perfeito! Às 9h está ótimo. Obrigada!");
			m5.setDataEnvio(LocalDateTime.now().minusHours(4));
			mensagemRepo.save(m5);

			Mensagem m6 = new Mensagem();
			m6.setRemetente(gildenorCuidador);
			m6.setDestinatario(cliente);
			m6.setConteudo("De nada! Até amanhã então. Qualquer coisa, pode me chamar aqui.");
			m6.setDataEnvio(LocalDateTime.now().minusHours(3).minusMinutes(45));
			mensagemRepo.save(m6);

			// Mensagem mais recente para aparecer no topo
			Mensagem m7 = new Mensagem();
			m7.setRemetente(cliente);
			m7.setDestinatario(gildenorCuidador);
			m7.setConteudo("Bom dia! Confirma o horário de hoje?");
			m7.setDataEnvio(LocalDateTime.now().minusMinutes(30));
			mensagemRepo.save(m7);

			Mensagem m8 = new Mensagem();
			m8.setRemetente(gildenorCuidador);
			m8.setDestinatario(cliente);
			m8.setConteudo("Bom dia Dona Maria! Sim, estarei aí às 9h em ponto.");
			m8.setDataEnvio(LocalDateTime.now().minusMinutes(15));
			mensagemRepo.save(m8);

			// Mensagem do João também
			Mensagem mensagem = new Mensagem();
			mensagem.setRemetente(cliente);
			mensagem.setDestinatario(cuidador);
			mensagem.setConteudo("Ola Joao, combinado para amanha?");
			mensagem.setDataEnvio(LocalDateTime.now().minusDays(1));
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
				// Buscar Gildenor novamente para garantir
				Cuidador gildenorExtra = cuidadorRepo.findByUsername("gildenor").orElse(cuidador);
				
				// Conversa inicial com o cuidador Gildenor
				Mensagem mx1 = new Mensagem();
				mx1.setRemetente(extra1);
				mx1.setDestinatario(gildenorExtra);
				mx1.setConteudo("Oi, vi seu perfil e gostaria de agendar.");
				mx1.setDataEnvio(LocalDateTime.now().minusDays(2));
				mensagemRepo.save(mx1);

				Mensagem mx2 = new Mensagem();
				mx2.setRemetente(gildenorExtra);
				mx2.setDestinatario(extra1);
				mx2.setConteudo("Olá! Podemos combinar sim. Qual horário prefere?");
				mx2.setDataEnvio(LocalDateTime.now().minusDays(2).plusHours(1));
				mensagemRepo.save(mx2);
				
				// Conversa com João também
				Mensagem mj1 = new Mensagem();
				mj1.setRemetente(extra1);
				mj1.setDestinatario(cuidador);
				mj1.setConteudo("Olá João, você também atende na minha região?");
				mj1.setDataEnvio(LocalDateTime.now().minusDays(3));
				mensagemRepo.save(mj1);

				Mensagem mj2 = new Mensagem();
				mj2.setRemetente(cuidador);
				mj2.setDestinatario(extra1);
				mj2.setConteudo("Sim! Atendo em toda Goiânia. Podemos agendar uma visita.");
				mj2.setDataEnvio(LocalDateTime.now().minusDays(3).plusMinutes(30));
				mensagemRepo.save(mj2);
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
	
	/**
	 * Atualiza os endereços dos clientes existentes que estão vazios ou nulos.
	 * Isso garante que clientes já cadastrados tenham um endereço para a funcionalidade de busca por proximidade.
	 */
	private void atualizarEnderecosClientesExistentes(ClienteRepository clienteRepo) {
		// Endereços de Goiânia e região para distribuir entre os clientes
		String[] enderecosPadrao = new String[] {
			"Rua A, 123, Setor Central, Goiânia-GO",
			"Rua 10, 456, Setor Oeste, Goiânia-GO",
			"Av. T-63, 789, Setor Bueno, Goiânia-GO",
			"Rua das Flores, 123, Centro, Anápolis-GO",
			"Av. Brasil, 321, Setor Central, Aparecida de Goiânia-GO",
			"Rua 5, 654, Jardim América, Goiânia-GO"
		};
		
		try {
			var clientes = clienteRepo.findAll();
			int index = 0;
			for (var cliente : clientes) {
				if (cliente.getEndereco() == null || cliente.getEndereco().isBlank()) {
					cliente.setEndereco(enderecosPadrao[index % enderecosPadrao.length]);
					cliente.setTipoCliente("IDOSO");
					if (cliente.getContatoEmergencia() == null || cliente.getContatoEmergencia().isBlank()) {
						cliente.setContatoEmergencia("Familiar: 62988880000");
					}
					clienteRepo.save(cliente);
					index++;
				}
			}
		} catch (Exception ex) {
			// Log silenciosamente para não interromper a inicialização
			System.err.println("Aviso: Erro ao atualizar endereços de clientes existentes: " + ex.getMessage());
		}
	}
	
	/**
	 * Atualiza os roles dos usuários CareHub existentes que estão com role incorreta (ex: ROLE_USER).
	 * Cuidadores devem ter o role CAREHUB_CUIDADOR e Clientes devem ter o role CAREHUB_CLIENTE.
	 */
	private void atualizarRolesUsuariosExistentes(CuidadorRepository cuidadorRepo, 
												   ClienteRepository clienteRepo,
												   Role cuidadorRole, 
												   Role clienteRole) {
		try {
			// Atualizar roles dos cuidadores
			var cuidadores = cuidadorRepo.findAll();
			for (var cuidador : cuidadores) {
				if (cuidador.getRole() == null || 
					!"CAREHUB_CUIDADOR".equals(cuidador.getRole().getName())) {
					cuidador.setRole(cuidadorRole);
					cuidadorRepo.save(cuidador);
					System.out.println("Role do cuidador '" + cuidador.getUsername() + "' atualizado para CAREHUB_CUIDADOR");
				}
			}
			
			// Atualizar roles dos clientes
			var clientes = clienteRepo.findAll();
			for (var cliente : clientes) {
				if (cliente.getRole() == null || 
					!"CAREHUB_CLIENTE".equals(cliente.getRole().getName())) {
					cliente.setRole(clienteRole);
					clienteRepo.save(cliente);
					System.out.println("Role do cliente '" + cliente.getUsername() + "' atualizado para CAREHUB_CLIENTE");
				}
			}
		} catch (Exception ex) {
			// Log silenciosamente para não interromper a inicialização
			System.err.println("Aviso: Erro ao atualizar roles de usuários existentes: " + ex.getMessage());
		}
	}
}
