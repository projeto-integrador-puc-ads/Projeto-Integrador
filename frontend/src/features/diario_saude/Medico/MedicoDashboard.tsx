import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Container,
} from "@mui/material";
import { ModuleGridMedico } from "@/features/diario_saude/components/ModuleGridMedico";
import { useLocation, useNavigate } from "react-router-dom";

import { usuarioAlergiaApi } from "../api/usuarioAlergiaApi";
import { usuarioDoencaApi } from "../api/usuarioDoencaApi";
import { questionarioApi } from "../api/questionarioApi";
import type { Alergia, Doenca } from "../api/types";

// Componentes reutilizáveis
function PageContainer({ children }: { children: React.ReactNode }) {
  return <Container maxWidth="xl" sx={{ py: 5 }}>{children}</Container>; // xl para mais espaço horizontal
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h4" fontWeight="bold" mb={4} align="center">
      {children}
    </Typography>
  );
}

export default function DashboardMedico() {
  const location = useLocation();
  const navigate = useNavigate();

  const paciente = location.state?.paciente;
  const prescricao = location.state?.prescricao;

  if (!paciente || !prescricao) {
    navigate("/medico");
    return null;
  }

  const [idade, setIdade] = useState(paciente.idade);
  const [peso, setPeso] = useState(paciente.peso);
  const [altura, setAltura] = useState(paciente.altura);

  const [doencas, setDoencas] = useState<Doenca[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);

  const [pontuacao, setPontuacao] = useState<number | null>(null);
  const [interpretacao, setInterpretacao] = useState<string>("");

  useEffect(() => {
    if (!paciente?.id_usuario) return;

    usuarioDoencaApi.listar(paciente.id_usuario).then(setDoencas);
    usuarioAlergiaApi.listar(paciente.id_usuario).then(setAlergias);

    questionarioApi.obterRespostas(paciente.id_usuario).then((respostas) => {
      const respostasOrdenadas = respostas.slice().sort(
        (a, b) => a.perguntaId - b.perguntaId
      );
      const total = respostasOrdenadas.reduce((acc, r) => acc + r.peso, 0);
      setPontuacao(total);

      let interp = "";
      if (total <= 6) interp = "baixa vulnerabilidade clínico funcional";
      else if (total <= 10) interp = "moderada vulnerabilidade clínico funcional";
      else interp = "alta vulnerabilidade clínico funcional";

      setInterpretacao(interp);
    });
  }, [paciente?.id_usuario]);

  const handleSalvar = () => {
    alert("Dados do paciente atualizados (simulação).");
  };

  return (
    <PageContainer>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <PageTitle>Dashboard Médico</PageTitle>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            width: "100%",
          }}
        >
          {/* Painel do Paciente - Grid de 2 colunas */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              flex: "1 1 600px", // maior espaço horizontal
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              minWidth: 500, // garante mais espaço
            }}
          >
            {/* Coluna 1: Informações + Questionário */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                Informações do Paciente
              </Typography>

              <Typography variant="body1">
                Paciente: <strong>{paciente.nome}</strong>
              </Typography>

              <TextField
                label="Idade"
                type="number"
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Peso (kg)"
                type="number"
                value={peso}
                onChange={(e) => setPeso(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Altura (m)"
                type="number"
                value={altura}
                onChange={(e) => setAltura(Number(e.target.value))}
                fullWidth
              />

              <Button variant="contained" color="primary" onClick={handleSalvar}>
                Salvar
              </Button>

              {pontuacao !== null && (
                <Box
                  sx={{
                    mt: 2,
                    p: 3,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    bgcolor: "#f5f5f5", // fundo destacado
                  }}
                >
                  <Typography variant="h6">Pontuação do Questionário</Typography>
                  <Typography fontWeight="bold" fontSize="1.2rem">
                    Total: {pontuacao} pontos
                  </Typography>
                  <Typography color="text.secondary">{interpretacao}</Typography>
                </Box>
              )}
            </Box>

            {/* Coluna 2: Doenças e Alergias */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Doenças
                </Typography>
                <List dense>
                  {doencas.length ? (
                    doencas.map((d) => (
                      <ListItem key={d.id}>
                        <ListItemText primary={d.nome} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Nenhuma doença cadastrada.</Typography>
                  )}
                </List>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Alergias
                </Typography>
                <List dense>
                  {alergias.length ? (
                    alergias.map((a) => (
                      <ListItem key={a.id}>
                        <ListItemText primary={a.nome} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Nenhuma alergia cadastrada.</Typography>
                  )}
                </List>
              </Box>
            </Box>
          </Paper>

          {/* Painel Modular */}
          <Box sx={{ flex: "3 1 700px" }}> {/* mais espaço para o módulo */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Funções
            </Typography>
            <ModuleGridMedico paciente={paciente} prescricao={prescricao} />
          </Box>
        </Box>
      </Paper>
    </PageContainer>
  );
}
