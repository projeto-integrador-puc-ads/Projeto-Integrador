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
import type { Alergia, Doenca } from "../api/types";

// Componentes reutilizáveis
function PageContainer({ children }: { children: React.ReactNode }) {
  return <Container maxWidth="lg" sx={{ py: 5 }}>{children}</Container>;
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

  // Estados para edição de informações básicas
  const [idade, setIdade] = useState(paciente.idade);
  const [peso, setPeso] = useState(paciente.peso);
  const [altura, setAltura] = useState(paciente.altura);

  // Estados para doenças e alergias
  const [doencas, setDoencas] = useState<Doenca[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);

  // Buscar doenças e alergias do paciente
  useEffect(() => {
    if (!paciente?.id_usuario) return;

    usuarioDoencaApi.listar(paciente.id_usuario).then(setDoencas);
    usuarioAlergiaApi.listar(paciente.id_usuario).then(setAlergias);
  }, [paciente?.id_usuario]);

  // Função para salvar alterações (simulação)
  const handleSalvar = () => {
    alert("Dados do paciente atualizados (simulação).");
  };

  return (
    <PageContainer>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <PageTitle>Dashboard Médico</PageTitle>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Painel do Paciente */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, flex: "1 1 300px", minWidth: 250 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Informações do Paciente
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

              <Button variant="contained" color="primary" onClick={handleSalvar} sx={{ mt: 2 }}>
                Salvar
              </Button>
            </Box>

            {/* Lista de doenças */}
            <Box sx={{ mt: 4 }}>
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

            {/* Lista de alergias */}
            <Box sx={{ mt: 4 }}>
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
          </Paper>

          {/* Painel Modular */}
          <Box sx={{ flex: "2 1 600px" }}>
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
