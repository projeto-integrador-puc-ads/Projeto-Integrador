package br.pucgo.ads.projetointegrador.carehub.config;

// ...existing imports... (Administrador not needed for carehub seeding)
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;
import br.pucgo.ads.projetointegrador.carehub.entity.Avaliacao;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.entity.Especialidade;
import br.pucgo.ads.projetointegrador.carehub.entity.Mensagem;
import br.pucgo.ads.projetointegrador.carehub.entity.Prontuario;
import br.pucgo.ads.projetointegrador.carehub.entity.RegistroAcompanhamento;
import br.pucgo.ads.projetointegrador.carehub.entity.TipoAtendimento;
import br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.AvaliacaoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.EspecialidadeRepository;
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
import java.util.HashSet;
import java.util.List;
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
									  EspecialidadeRepository especialidadeRepo,
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
			
			// =======================================================
			// Criar especialidades de cuidadores
			// =======================================================
			List<Especialidade> especialidades = criarEspecialidades(especialidadeRepo);
			
			// Atualizar endereços de clientes existentes que estão vazios
			atualizarEnderecosClientesExistentes(clienteRepo);
			
			// Atualizar roles de usuários existentes que estão com role errada
			atualizarRolesUsuariosExistentes(cuidadorRepo, clienteRepo, cuidadorRole, clienteRole);
			
			// Atualizar especialidades dos cuidadores existentes
			atualizarEspecialidadesCuidadores(cuidadorRepo, especialidades);
			
			// Popular avaliações variadas para os cuidadores
			popularAvaliacoesVariadas(cuidadorRepo, clienteRepo, agendamentoRepo, avaliacaoRepo);
			
			if (clienteRepo.count() > 0) {
				// Mesmo com dados existentes, garantir que o agendamento da apresentação existe
				criarAgendamentoApresentacao(clienteRepo, cuidadorRepo, agendamentoRepo);
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
			cuidador.setExperiencia("5 anos com idosos acamados e dependentes");
			cuidador.setCidade("Goiania");
			cuidador.setEstado("GO");
			cuidador.setDisponibilidade(true);
			cuidador.setTaxaHora(new BigDecimal("35.00"));
			cuidador.setBiografia("Profissional experiente com formação em enfermagem geriátrica. Trabalho com dedicação e carinho, sempre priorizando o bem-estar dos idosos.");
			// Adicionar especialidades ao João
			Set<Especialidade> espJoao = new HashSet<>();
			espJoao.add(especialidades.get(0)); // Cuidados Domiciliares
			espJoao.add(especialidades.get(4)); // Enfermagem Geriátrica
			espJoao.add(especialidades.get(9)); // Auxílio à Mobilidade
			cuidador.setEspecialidades(espJoao);
			cuidador = cuidadorRepo.save(cuidador);

			// Gildenor - cuidador principal para a apresentação
			Cuidador gildenor = new Cuidador();
			gildenor.setName("Gildenor Souza");
			gildenor.setUsername("gildenor");
			gildenor.setEmail("gildenor@example.com");
			gildenor.setPassword(encoder.encode("123456"));
			gildenor.setRoles(Set.of("CAREHUB_CUIDADOR"));
			gildenor.setRole(cuidadorRole);
			gildenor.setTelefone("62933334444");
			gildenor.setAtivo(true);
			gildenor.setExperiencia("10 anos com cuidados domiciliares e acompanhamento hospitalar");
			gildenor.setCidade("Goiânia");
			gildenor.setEstado("GO");
			gildenor.setDisponibilidade(true);
			gildenor.setTaxaHora(new BigDecimal("45.00"));
			gildenor.setBiografia("Sou Gildenor, cuidador certificado com mais de 10 anos de experiência em cuidados geriátricos. Formado em técnico de enfermagem pela PUC Goiás, com especialização em cuidados paliativos e Alzheimer. Minha missão é proporcionar bem-estar e qualidade de vida para os idosos e tranquilidade para suas famílias. Trabalho com amor, paciência e dedicação total.");
			// Adicionar especialidades ao Gildenor
			Set<Especialidade> espGildenor = new HashSet<>();
			espGildenor.add(especialidades.get(0)); // Cuidados Domiciliares
			espGildenor.add(especialidades.get(1)); // Acompanhamento Hospitalar
			espGildenor.add(especialidades.get(2)); // Cuidados Paliativos
			espGildenor.add(especialidades.get(5)); // Alzheimer e Demência
			gildenor.setEspecialidades(espGildenor);
			gildenor = cuidadorRepo.save(gildenor);

		 	// Adicionar vários cuidadores de teste com endereços/cidades distintas
		 	String[] cidades = new String[] {"Goiânia", "Anápolis", "Trindade", "Rio Verde", "Catalão"};
		 	String[] experienciasCuidadores = new String[] {
		 		"6 anos de experiência em cuidados domiciliares com idosos",
		 		"8 anos trabalhando em hospitais e casas de repouso",
		 		"4 anos especializados em cuidados paliativos",
		 		"7 anos de experiência com pacientes com Alzheimer",
		 		"5 anos em atendimento domiciliar e fisioterapia geriátrica"
		 	};
		 	String[] biografiasCuidadores = new String[] {
		 		"Profissional dedicado com vasta experiência em cuidados geriátricos. Formação em enfermagem com especialização em saúde do idoso.",
		 		"Cuidador certificado com experiência em hospitais e domicílios. Especialista em Alzheimer e demência.",
		 		"Técnico de enfermagem apaixonado por ajudar idosos. Experiência em cuidados paliativos e acompanhamento hospitalar.",
		 		"Profissional atencioso e paciente. Formação em gerontologia com experiência em reabilitação física.",
		 		"Cuidador experiente em atendimento domiciliar. Conhecimento em primeiros socorros e emergências geriátricas."
		 	};
		 	
		 	for (int i = 0; i < cidades.length; i++) {
		 		String uname = "cuidador_teste" + (i + 1);
		 		Cuidador ct = new Cuidador();
		 		ct.setName("Cuidador Teste " + (i + 1));
		 		ct.setUsername(uname);
		 		ct.setEmail(uname + "@example.com");
		 		ct.setPassword(encoder.encode("123456"));
		 		ct.setRoles(Set.of("CAREHUB_CUIDADOR"));
		 		ct.setRole(cuidadorRole);
		 		ct.setTelefone("62970000" + (10 + i));
		 		ct.setAtivo(true);
		 		ct.setExperiencia(experienciasCuidadores[i]);
		 		ct.setBiografia(biografiasCuidadores[i]);
		 		ct.setCidade(cidades[i]);
		 		ct.setEstado("GO");
		 		ct.setDisponibilidade(i % 2 == 0);
		 		ct.setTaxaHora(new BigDecimal(30 + i * 5));
		 		// Adicionar especialidades variadas
		 		Set<Especialidade> espCt = new HashSet<>();
		 		espCt.add(especialidades.get(i % especialidades.size()));
		 		espCt.add(especialidades.get((i + 3) % especialidades.size()));
		 		espCt.add(especialidades.get((i + 7) % especialidades.size()));
		 		ct.setEspecialidades(espCt);
		 		cuidadorRepo.save(ct);
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
				cuidador.setAvaliacaoMedia(new BigDecimal(String.format(java.util.Locale.US, "%.2f", novoAvg)));
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
	
	/**
	 * Cria as especialidades padrão para cuidadores se não existirem.
	 * Retorna a lista de especialidades criadas/existentes.
	 */
	private List<Especialidade> criarEspecialidades(EspecialidadeRepository especialidadeRepo) {
		String[] nomesEspecialidades = {
			"Cuidados Domiciliares",
			"Acompanhamento Hospitalar",
			"Cuidados Paliativos",
			"Fisioterapia Geriátrica",
			"Enfermagem Geriátrica",
			"Alzheimer e Demência",
			"Parkinson",
			"Cuidados Pós-Operatórios",
			"Acompanhamento Noturno",
			"Auxílio à Mobilidade",
			"Cuidados com Diabetes",
			"Cuidados com Hipertensão",
			"Nutrição e Alimentação",
			"Higiene Pessoal",
			"Atividades Recreativas"
		};
		
		List<Especialidade> especialidades = new java.util.ArrayList<>();
		
		for (String nome : nomesEspecialidades) {
			Especialidade esp = especialidadeRepo.findByNomeIgnoreCase(nome).orElseGet(() -> {
				Especialidade nova = new Especialidade();
				nova.setNome(nome);
				return especialidadeRepo.save(nova);
			});
			especialidades.add(esp);
		}
		
		System.out.println("Especialidades criadas/verificadas: " + especialidades.size());
		return especialidades;
	}
	
	/**
	 * Atualiza os cuidadores existentes adicionando especialidades variadas.
	 * Cada cuidador receberá de 2 a 4 especialidades diferentes.
	 * Também atualiza biografias e experiências vazias.
	 */
	private void atualizarEspecialidadesCuidadores(CuidadorRepository cuidadorRepo, List<Especialidade> especialidades) {
		if (especialidades == null || especialidades.isEmpty()) {
			System.out.println("Nenhuma especialidade disponível para associar aos cuidadores.");
			return;
		}
		
		try {
			// Usar query específica para evitar LazyInitializationException
			var cuidadoresSemEspecialidades = cuidadorRepo.findCuidadoresSemEspecialidades();
			int index = 0;
			
			// Biografias para enriquecer os perfis dos cuidadores
			String[] biografias = {
				"Profissional dedicado com vasta experiência em cuidados geriátricos. Formação em enfermagem com especialização em saúde do idoso. Trabalho com amor e carinho.",
				"Cuidador certificado com experiência em hospitais e domicílios. Especialista em Alzheimer e demência, com formação continuada na área.",
				"Técnico de enfermagem apaixonado por ajudar idosos. Experiência em cuidados paliativos e acompanhamento hospitalar.",
				"Profissional atencioso e paciente. Formação em gerontologia com experiência em reabilitação física e acompanhamento diário.",
				"Cuidador experiente em atendimento domiciliar. Conhecimento em primeiros socorros e manejo de emergências geriátricas.",
				"Enfermeiro especializado em cuidados com idosos dependentes. Experiência em administração de medicamentos e monitoramento de sinais vitais.",
				"Profissional com formação em fisioterapia e cuidados geriátricos. Especialista em exercícios de mobilidade e prevenção de quedas.",
				"Cuidador dedicado com experiência em acompanhamento de idosos com doenças crônicas. Certificação em cuidados com diabetes e hipertensão."
			};
			
			// Experiências variadas para enriquecer os perfis
			String[] experiencias = {
				"5 anos de experiência em cuidados domiciliares com idosos",
				"8 anos trabalhando em hospitais e casas de repouso",
				"3 anos especializados em cuidados paliativos",
				"10 anos de experiência com pacientes com Alzheimer",
				"6 anos em atendimento domiciliar e acompanhamento hospitalar",
				"7 anos com idosos acamados e dependentes",
				"4 anos em fisioterapia e reabilitação geriátrica",
				"9 anos de experiência com pacientes diabéticos e hipertensos"
			};
			
			for (var cuidador : cuidadoresSemEspecialidades) {
				Set<Especialidade> especCuidador = new HashSet<>();
				
				// Adicionar de 2 a 4 especialidades (de forma rotativa)
				int numEspec = 2 + (index % 3); // 2, 3 ou 4 especialidades
				for (int i = 0; i < numEspec && i < especialidades.size(); i++) {
					int espIndex = (index + i * 2) % especialidades.size();
					especCuidador.add(especialidades.get(espIndex));
				}
				
				cuidador.setEspecialidades(especCuidador);
				
				// Adicionar biografia se estiver vazia
				if (cuidador.getBiografia() == null || cuidador.getBiografia().isBlank()) {
					cuidador.setBiografia(biografias[index % biografias.length]);
				}
				
				// Adicionar experiência se estiver vazia
				if (cuidador.getExperiencia() == null || cuidador.getExperiencia().isBlank()) {
					cuidador.setExperiencia(experiencias[index % experiencias.length]);
				}
				
				cuidadorRepo.save(cuidador);
				System.out.println("Cuidador '" + cuidador.getName() + "' atualizado com " + especCuidador.size() + " especialidades");
				index++;
			}
			
			// Atualizar TODOS os cuidadores para garantir que experiência e biografia estão preenchidas
			var todosCuidadores = cuidadorRepo.findAll();
			for (int i = 0; i < todosCuidadores.size(); i++) {
				var cuidador = todosCuidadores.get(i);
				boolean precisaAtualizar = false;
				
				if (cuidador.getBiografia() == null || cuidador.getBiografia().isBlank()) {
					cuidador.setBiografia(biografias[i % biografias.length]);
					precisaAtualizar = true;
				}
				
				if (cuidador.getExperiencia() == null || cuidador.getExperiencia().isBlank()) {
					cuidador.setExperiencia(experiencias[i % experiencias.length]);
					precisaAtualizar = true;
				}
				
				if (precisaAtualizar) {
					cuidadorRepo.save(cuidador);
					System.out.println("Cuidador '" + cuidador.getName() + "' teve biografia/experiência atualizada");
				}
			}
			
			System.out.println("Total de cuidadores atualizados com especialidades: " + index);
		} catch (Exception ex) {
			System.err.println("Aviso: Erro ao atualizar especialidades dos cuidadores: " + ex.getMessage());
			ex.printStackTrace();
		}
	}
	
	/**
	 * Popula avaliações variadas para os cuidadores, com notas realistas.
	 * Alguns cuidadores terão notas excelentes (4.5-5.0), outros boas (3.5-4.5),
	 * e alguns medianas (3.0-3.5) para criar diversidade.
	 */
	private void popularAvaliacoesVariadas(CuidadorRepository cuidadorRepo, 
											ClienteRepository clienteRepo,
											AgendamentoRepository agendamentoRepo,
											AvaliacaoRepository avaliacaoRepo) {
		try {
			var cuidadores = cuidadorRepo.findAll();
			var clientes = clienteRepo.findAll();
			
			if (cuidadores.isEmpty() || clientes.isEmpty()) {
				System.out.println("Sem cuidadores ou clientes para criar avaliações.");
				return;
			}
			
			// Comentários positivos (5 estrelas)
			String[] comentarios5 = {
				"Excelente profissional! Muito atencioso e dedicado.",
				"Recomendo muito! Cuidou da minha mãe com muito carinho.",
				"Profissional exemplar, pontual e muito competente.",
				"O melhor cuidador que já contratamos. Nota 10!",
				"Atendimento impecável, superou todas as expectativas."
			};
			
			// Comentários bons (4 estrelas)
			String[] comentarios4 = {
				"Muito bom profissional, atencioso e cuidadoso.",
				"Gostei bastante do atendimento, recomendo.",
				"Profissional competente e dedicado.",
				"Bom atendimento, apenas poderia ser mais comunicativo.",
				"Cuidou bem do meu pai, fiquei satisfeito."
			};
			
			// Comentários medianos (3 estrelas)
			String[] comentarios3 = {
				"Atendimento regular, mas cumpriu o básico.",
				"Poderia ser mais atencioso, mas foi adequado.",
				"Serviço ok, nada excepcional mas também nada ruim.",
				"Atendeu as necessidades básicas.",
				"Razoável, mas esperava um pouco mais."
			};
			
			// Distribuição de notas por cuidador (índice -> notas)
			// Gildenor (idx 1): Excelente - 4.8
			// João (idx 0): Muito bom - 4.5
			// Outros: variados
			int[][] notasPorCuidador = {
				{5, 5, 4, 4, 5},  // João - média 4.6
				{5, 5, 5, 5, 4},  // Gildenor - média 4.8
				{4, 4, 3, 4, 4},  // Cuidador Teste 1 - média 3.8
				{3, 4, 4, 3, 3},  // Cuidador Teste 2 - média 3.4
				{5, 4, 5, 4, 5},  // Cuidador Teste 3 - média 4.6
				{3, 3, 4, 3, 4},  // Cuidador Teste 4 - média 3.4
				{4, 5, 4, 4, 5},  // Cuidador Teste 5 - média 4.4
			};
			
			int cuidadorIndex = 0;
			for (var cuidador : cuidadores) {
				// Verificar se já tem avaliações suficientes
				long avaliacoesExistentes = avaliacaoRepo.countByCuidadorId(cuidador.getId());
				if (avaliacoesExistentes >= 3) {
					cuidadorIndex++;
					continue; // Já tem avaliações suficientes
				}
				
				// Pegar notas para este cuidador
				int[] notas = cuidadorIndex < notasPorCuidador.length 
					? notasPorCuidador[cuidadorIndex] 
					: new int[]{4, 4, 3, 4, 3}; // Padrão mediano
				
				int totalNotas = 0;
				int somaNotas = 0;
				int clienteIndex = 0;
				
				// Criar até 5 avaliações por cuidador
				for (int i = 0; i < Math.min(notas.length, clientes.size()); i++) {
					var cliente = clientes.get(clienteIndex % clientes.size());
					int nota = notas[i];
					
					// Verificar se já existe avaliação deste cliente para este cuidador
					boolean jaAvaliou = avaliacaoRepo.existsByClienteIdAndCuidadorId(cliente.getId(), cuidador.getId());
					if (jaAvaliou) {
						clienteIndex++;
						continue;
					}
					
					// Buscar ou criar agendamento concluído para esta avaliação
					var agendamentos = agendamentoRepo.findByCuidadorIdOrderByDataHoraInicioDesc(cuidador.getId());
					Agendamento agendamentoConcluido = agendamentos.stream()
						.filter(a -> a.getStatus() == Agendamento.StatusAgendamento.CONCLUIDO)
						.filter(a -> a.getCliente().getId().equals(cliente.getId()))
						.findFirst()
						.orElse(null);
					
					// Se não tem agendamento concluído, criar um fictício para a avaliação
					if (agendamentoConcluido == null) {
						agendamentoConcluido = new Agendamento();
						agendamentoConcluido.setCuidador(cuidador);
						agendamentoConcluido.setCliente(cliente);
						agendamentoConcluido.setDataHoraInicio(LocalDateTime.now().minusDays(10 + i * 3).withHour(9));
						agendamentoConcluido.setDataHoraFim(LocalDateTime.now().minusDays(10 + i * 3).withHour(12));
						agendamentoConcluido.setStatus(Agendamento.StatusAgendamento.CONCLUIDO);
						agendamentoConcluido.setTipoAtendimento(TipoAtendimento.DOMICILIO);
						agendamentoConcluido.setObservacoes("Atendimento para avaliação");
						agendamentoConcluido = agendamentoRepo.save(agendamentoConcluido);
					}
					
					// Selecionar comentário apropriado
					String comentario;
					if (nota == 5) {
						comentario = comentarios5[i % comentarios5.length];
					} else if (nota == 4) {
						comentario = comentarios4[i % comentarios4.length];
					} else {
						comentario = comentarios3[i % comentarios3.length];
					}
					
					// Criar avaliação
					Avaliacao avaliacao = new Avaliacao();
					avaliacao.setCuidador(cuidador);
					avaliacao.setCliente(cliente);
					avaliacao.setAgendamento(agendamentoConcluido);
					avaliacao.setNota(nota);
					avaliacao.setComentario(comentario);
					avaliacaoRepo.save(avaliacao);
					
					totalNotas++;
					somaNotas += nota;
					clienteIndex++;
				}
				
				// Atualizar média do cuidador
				if (totalNotas > 0) {
					double mediaAnterior = cuidador.getAvaliacaoMedia() == null ? 0.0 : cuidador.getAvaliacaoMedia().doubleValue();
					int totalAnterior = cuidador.getTotalAvaliacoes() == null ? 0 : cuidador.getTotalAvaliacoes();
					
					int novoTotal = totalAnterior + totalNotas;
					double novaMedia = (mediaAnterior * totalAnterior + somaNotas) / novoTotal;
					
					// Usar Locale.US para garantir ponto como separador decimal
					cuidador.setAvaliacaoMedia(new BigDecimal(String.format(java.util.Locale.US, "%.2f", novaMedia)));
					cuidador.setTotalAvaliacoes(novoTotal);
					cuidadorRepo.save(cuidador);
					
					System.out.println("Cuidador '" + cuidador.getName() + "' - " + totalNotas + " avaliações, média: " + String.format(java.util.Locale.US, "%.2f", novaMedia));
				}
				
				cuidadorIndex++;
			}
			
			System.out.println("Avaliações populadas com sucesso!");
		} catch (Exception ex) {
			System.err.println("Aviso: Erro ao popular avaliações: " + ex.getMessage());
			ex.printStackTrace();
		}
	}
	
	/**
	 * Cria o agendamento específico para a apresentação.
	 * Dona Maria com Gildenor às 19h do dia 11/12/2025 até 21h.
	 */
	private void criarAgendamentoApresentacao(ClienteRepository clienteRepo, 
											   CuidadorRepository cuidadorRepo, 
											   AgendamentoRepository agendamentoRepo) {
		try {
			// Buscar Dona Maria
			var mariaOpt = clienteRepo.findByUsername("maria");
			if (mariaOpt.isEmpty()) {
				System.out.println("Cliente 'maria' não encontrado para criar agendamento da apresentação.");
				return;
			}
			
			// Buscar Gildenor
			var gildenorOpt = cuidadorRepo.findByUsername("gildenor");
			if (gildenorOpt.isEmpty()) {
				System.out.println("Cuidador 'gildenor' não encontrado para criar agendamento da apresentação.");
				return;
			}
			
			Cliente maria = mariaOpt.get();
			Cuidador gildenor = gildenorOpt.get();
			
			// Data específica: 11/12/2025 às 19h até 21h
			LocalDateTime dataInicio = LocalDateTime.of(2025, 12, 11, 19, 0);
			LocalDateTime dataFim = LocalDateTime.of(2025, 12, 11, 21, 0);
			
			// Verificar se já existe um agendamento nesta data e horário
			var agendamentosExistentes = agendamentoRepo.findAll();
			boolean jaExiste = agendamentosExistentes.stream().anyMatch(a -> 
				a.getCliente().getId().equals(maria.getId()) &&
				a.getCuidador().getId().equals(gildenor.getId()) &&
				a.getDataHoraInicio().equals(dataInicio)
			);
			
			if (jaExiste) {
				System.out.println("Agendamento da apresentação já existe.");
				return;
			}
			
			// Criar o agendamento para a apresentação
			Agendamento agendamentoApresentacao = new Agendamento();
			agendamentoApresentacao.setCliente(maria);
			agendamentoApresentacao.setCuidador(gildenor);
			agendamentoApresentacao.setDataHoraInicio(dataInicio);
			agendamentoApresentacao.setDataHoraFim(dataFim);
			agendamentoApresentacao.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);
			agendamentoApresentacao.setTipoAtendimento(TipoAtendimento.DOMICILIO);
			agendamentoApresentacao.setObservacoes("Atendimento especial - Visita domiciliar para acompanhamento e auxílio com medicação");
			
			agendamentoRepo.save(agendamentoApresentacao);
			
			System.out.println("✅ Agendamento da apresentação criado: " + 
				maria.getName() + " com " + gildenor.getName() + 
				" em 11/12/2025 das 19h às 21h");
				
		} catch (Exception ex) {
			System.err.println("Aviso: Erro ao criar agendamento da apresentação: " + ex.getMessage());
			ex.printStackTrace();
		}
	}
}
