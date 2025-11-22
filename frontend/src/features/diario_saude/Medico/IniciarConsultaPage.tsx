import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { Prescricao } from "../api/prescricaoApi";
import http from "@/lib/http";

// --------------------------
// Componentes reutilizáveis
// --------------------------
function PageContainer({ children }: { children: React.ReactNode }) {
  return <Container maxWidth="sm" sx={{ py: 5 }}>{children}</Container>;
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return <Typography variant="h4" mb={3} textAlign="center">{children}</Typography>;
}

// --------------------------
// API de pacientes
// --------------------------
const usuarioApi = {
  listar: async (): Promise<any[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get("/api/diario_saude/usuario", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : [];
  },
};

// --------------------------
// Página
// --------------------------
export default function IniciarConsulta() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);

  // --------------------------
  // Buscar pacientes via React Query
  // --------------------------
  const { data: pacientes = [], error } = useQuery({
    queryKey: ["pacientes"],
    queryFn: usuarioApi.listar,
    enabled: !!token,
  });

  const filtered = pacientes.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------
  // Criar prescricao
  // --------------------------
  const startConsultaMutation = useMutation({
    mutationFn: async (pacienteSelecionado: any) => {
      if (!usuario) throw new Error("Usuário não logado");

      const payload = {
        id_medico: usuario.id_usuario,
        id_usuario: pacienteSelecionado.id_usuario,
        descricao: "Consulta iniciada",
      };

      const { data } = await http.post("/api/diario_saude/prescricao", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data as Prescricao;
    },
    onSuccess: (prescricao, pacienteSelecionado) => {
      navigate("/atendimento/dashboard", { state: { paciente: pacienteSelecionado, prescricao } });
    },
    onError: (err) => {
      console.error("❌ Erro ao iniciar consulta:", err);
      alert("Erro ao iniciar a consulta.");
    },
  });

  const handleStartConsulta = () => {
    if (selectedPaciente) startConsultaMutation.mutate(selectedPaciente);
  };

  // --------------------------
  // Render
  // --------------------------
  return (
    <PageContainer>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <PageTitle>Iniciar Consulta</PageTitle>

        {error && (
          <Typography color="error" mb={2}>
            Erro ao carregar pacientes
          </Typography>
        )}

        <TextField
          fullWidth
          label="Buscar Paciente"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <List>
          {filtered.map(p => (
            <ListItemButton
              key={p.id_usuario}
              selected={selectedPaciente?.id_usuario === p.id_usuario}
              onClick={() => setSelectedPaciente(p)}
            >
              <ListItemText primary={p.nome} />
            </ListItemButton>
          ))}
          {filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhum paciente encontrado.
            </Typography>
          )}
        </List>

        <Box mt={3}>
          <Button
            variant="contained"
            size="large"
            disabled={!selectedPaciente || startConsultaMutation.isLoading}
            onClick={handleStartConsulta}
          >
            {startConsultaMutation.isLoading ? "Iniciando..." : "Iniciar Consulta"}
          </Button>
        </Box>
      </Paper>
    </PageContainer>
  );
}
