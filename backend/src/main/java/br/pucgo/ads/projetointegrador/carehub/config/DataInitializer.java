package br.pucgo.ads.projetointegrador.carehub.config;

import br.pucgo.ads.projetointegrador.carehub.entity.Administrador;
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;
import br.pucgo.ads.projetointegrador.carehub.entity.Avaliacao;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.entity.Mensagem;
import br.pucgo.ads.projetointegrador.carehub.entity.Prontuario;
import br.pucgo.ads.projetointegrador.carehub.entity.RegistroAcompanhamento;
import br.pucgo.ads.projetointegrador.carehub.entity.Usuario;
import br.pucgo.ads.projetointegrador.carehub.repository.AdministradorRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.AvaliacaoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.MensagemRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ProntuarioRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.RegistroAcompanhamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

	@Bean
	CommandLineRunner seedCarehubData(UsuarioRepository usuarioRepo,
									  ClienteRepository clienteRepo,
									  CuidadorRepository cuidadorRepo,
									  AdministradorRepository adminRepo,
									  ProntuarioRepository prontuarioRepo,
									  AgendamentoRepository agendamentoRepo,
									  AvaliacaoRepository avaliacaoRepo,
									  MensagemRepository mensagemRepo,
									  RegistroAcompanhamentoRepository registroRepo,
									  PasswordEncoder encoder) {
		return args -> {
			if (usuarioRepo.count() > 0) {
				return;
			}

			Administrador admin = new Administrador();
			admin.setNome("Admin CareHub");
			admin.setEmail("admin@carehub.test");
			admin.setSenha(encoder.encode("admin123"));
			admin.setPerfil(Usuario.Perfil.ADMIN);
			admin.setDepartamento("Operacoes");
			admin.setNivelAcesso("TOTAL");
			admin.setSuperAdmin(true);
			adminRepo.save(admin);

			Cliente cliente = new Cliente();
			cliente.setNome("Dona Maria");
			cliente.setEmail("maria@example.com");
			cliente.setSenha(encoder.encode("123456"));
			cliente.setPerfil(Usuario.Perfil.CLIENTE);
			cliente.setTelefone("62999990000");
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

			Cuidador cuidador = new Cuidador();
			cuidador.setNome("Joao Cuidador");
			cuidador.setEmail("joao@example.com");
			cuidador.setSenha(encoder.encode("123456"));
			cuidador.setPerfil(Usuario.Perfil.CUIDADOR);
			cuidador.setTelefone("62911112222");
			cuidador.setExperiencia("5 anos com idosos acamados");
			cuidador.setCidade("Goiania");
			cuidador.setEstado("GO");
			cuidador.setDisponibilidade(true);
			cuidador.setTaxaHora(new BigDecimal("35.00"));
			cuidador = cuidadorRepo.save(cuidador);

			Agendamento agendamento = new Agendamento();
			agendamento.setCuidador(cuidador);
			agendamento.setCliente(cliente);
			agendamento.setDataHoraInicio(LocalDateTime.now().plusDays(1).withHour(9).withMinute(0));
			agendamento.setDataHoraFim(LocalDateTime.now().plusDays(1).withHour(12).withMinute(0));
			agendamento.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);
			agendamento.setObservacoes("Primeira visita");
			agendamento.setTipoAtendimento("Acompanhamento");
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

			Mensagem mensagem = new Mensagem();
			mensagem.setRemetente(cliente);
			mensagem.setDestinatario(cuidador);
			mensagem.setConteudo("Ola Joao, combinado para amanha?");
			mensagemRepo.save(mensagem);
		};
	}
}
