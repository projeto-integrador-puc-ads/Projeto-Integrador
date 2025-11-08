package br.pucgo.ads.projetointegrador.carehub;

import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.avaliacao.AvaliacaoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.registro.RegistroAcompanhamentoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SuppressWarnings("null")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class CarehubApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Test
    void healthCheckAndCoreFlows() throws Exception {
        mockMvc.perform(get("/api/carehub/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        Cliente cliente = clienteRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Seed client not found"));

        Cuidador cuidador = cuidadorRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Seed caregiver not found"));

        mockMvc.perform(get("/api/carehub/cuidadores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value(cuidador.getNome()));

        AgendamentoRequestDTO agendamentoRequest = new AgendamentoRequestDTO(
                cuidador.getId(),
                cliente.getId(),
                LocalDateTime.now().plusDays(2),
                LocalDateTime.now().plusDays(2).plusHours(2),
                "Agenda criada via teste",
                "Atendimento domiciliar"
        );

        String agendamentoPayload = objectMapper.writeValueAsString(agendamentoRequest);

        JsonNode agendamentoNode = objectMapper.readTree(
                mockMvc.perform(post("/api/carehub/agendamentos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(agendamentoPayload))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id").isNumber())
                        .andReturn()
                        .getResponse()
                        .getContentAsString()
        );

        long agendamentoId = agendamentoNode.get("id").asLong();

        RegistroAcompanhamentoRequestDTO registroRequest = new RegistroAcompanhamentoRequestDTO(
                agendamentoId,
                LocalDateTime.now(),
                "120/80",
                "95",
                "Losartana 50mg",
                "Dieta leve",
                "Caminhada guiada",
                "Paciente colaborou com todas as atividades",
                "Nenhuma",
                "PA 120/80, 92 bpm"
        );

        mockMvc.perform(post("/api/carehub/registros")
                        .header("X-User-Id", cuidador.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registroRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sinaisVitais").value(Matchers.containsString("PA 120/80")));

        mockMvc.perform(get("/api/carehub/registros/cliente/" + cliente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].clienteId").value(cliente.getId()));

        MensagemRequestDTO mensagemRequest = new MensagemRequestDTO(
                cuidador.getId(),
                "Mensagem automatizada do teste"
        );

        mockMvc.perform(post("/api/carehub/mensagens")
                        .header("X-User-Id", cliente.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mensagemRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conteudo").value("Mensagem automatizada do teste"));

        mockMvc.perform(get("/api/carehub/mensagens/conversa/" + cuidador.getId())
                        .header("X-User-Id", cliente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].destinatarioId").value(cuidador.getId()));

        AvaliacaoRequestDTO avaliacaoRequest = new AvaliacaoRequestDTO(
                cuidador.getId(),
                5,
                "Excelente profissional"
        );

        mockMvc.perform(post("/api/carehub/avaliacoes")
                        .header("X-User-Id", cliente.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(avaliacaoRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nota").value(5));

        mockMvc.perform(get("/api/carehub/avaliacoes/cuidador/" + cuidador.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cuidadorId").value(cuidador.getId()));

        mockMvc.perform(put("/api/carehub/agendamentos/{id}/status?status=CONCLUIDO", agendamentoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONCLUIDO"));

        mockMvc.perform(delete("/api/carehub/agendamentos/{id}", agendamentoId))
                .andExpect(status().isNoContent());

        assertThat(agendamentoId).isPositive();
    }
}
