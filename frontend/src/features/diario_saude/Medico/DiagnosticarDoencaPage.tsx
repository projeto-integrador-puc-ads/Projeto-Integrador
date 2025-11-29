import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import ListItemCard from "../components/ListItemCard";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doencaApi } from "../api/doencaApi";
import { usuarioDoencaApi } from "../api/usuarioDoencaApi";

export default function DiagnosticarDoencaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const paciente = location.state?.paciente;
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [doencaSelecionada, setDoencaSelecionada] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!paciente?.id_usuario) {
    navigate("/medico", { replace: true });
    return null;
  }

  const pacienteId = paciente.id_usuario;

  // --- QUERIES DE LEITURA (REACT QUERY) ---

  // 1. LISTA DOENÇAS DO SISTEMA
  const { data: listaDoencasSistema = [] } = useQuery({
    queryKey: ["doencas", "sistema"],
    queryFn: () => doencaApi.listar(),
  });

  // 2. LISTA DOENÇAS DO PACIENTE
  const { data: doencasPaciente = [] } = useQuery({
    queryKey: ["usuario", pacienteId, "doencas"],
    queryFn: () => usuarioDoencaApi.listar(pacienteId),
    enabled: !!pacienteId,
  });

  // --- MUTAÇÕES (REACT QUERY) ---

  // ADICIONAR DOENÇA
  const addDoencaMutation = useMutation({
    mutationFn: ({ usuarioId, doencaId }: { usuarioId: number; doencaId: number }) =>
      usuarioDoencaApi.adicionar(usuarioId, doencaId),
    onSuccess: () => {
      // Invalida a query do paciente para buscar a lista atualizada
      queryClient.invalidateQueries(["usuario", pacienteId, "doencas"]);
      setDialogOpen(false);
      setDoencaSelecionada(null);
    },
  });

  const handleAddDoenca = () => {
    if (!doencaSelecionada) return alert("Selecione uma doença.");
    // O pacienteId está garantido pela checagem inicial
    addDoencaMutation.mutate({ usuarioId: pacienteId, doencaId: doencaSelecionada.id });
  };

  // REMOVER DOENÇA
  const removeDoencaMutation = useMutation({
    mutationFn: ({ usuarioId, doencaId }: { usuarioId: number; doencaId: number }) =>
      usuarioDoencaApi.remover(usuarioId, doencaId),
    onSuccess: () => 
      // Invalida a query do paciente para buscar a lista atualizada
      queryClient.invalidateQueries(["usuario", pacienteId, "doencas"]),
  });

  const handleRemoveDoenca = (id: number) => {
    removeDoencaMutation.mutate({ usuarioId: pacienteId, doencaId: id });
  };

  // --- RENDERIZAÇÃO ---
  return (
    <PageContainer>
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
        fullWidth={isMobile}
        sx={{ mb: 2, textTransform: "none" }}
      >
        Voltar
      </Button>

      <PageTitle>Doenças do Paciente</PageTitle>

      <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 2 }}>
        Paciente: <strong>{paciente.nome}</strong>
      </Typography>

      <SectionTitle>Doenças cadastradas</SectionTitle>

      {doencasPaciente.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          Nenhuma doença cadastrada para este paciente.
        </Typography>
      ) : (
        doencasPaciente.map((d) => (
          <ListItemCard
            key={d.id || d.doenca?.id}
            title={d.nome || d.doenca?.nome}
            // Passamos o ID da doença/associação para a remoção
            onDelete={() => handleRemoveDoenca(d.id || d.doenca?.id)}
          />
        ))
      )}

      <Button
        startIcon={<AddIcon />}
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setDialogOpen(true)}
      >
        Adicionar Doença
      </Button>

      <Box textAlign="center" mt={6}>
        <Typography variant={isMobile ? "body1" : "h6"}>{usuario?.nome}</Typography>
        <Typography variant="body2">{new Date().toLocaleDateString("pt-BR")}</Typography>
      </Box>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: isMobile ? "1.2rem" : "1.4rem" }}>Adicionar Doença</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaDoencasSistema}
              getOptionLabel={(option: any) => option.nome}
              isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
              onChange={(e, v) => setDoencaSelecionada(v)}

              renderOption={(props, option: any) => (
                <li {...props} key={option.id}>
                  {option.nome}
                </li>
              )}

              renderInput={(params) => (
                <TextField {...params} label="Pesquise a doença" fullWidth />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
                variant="contained"
                onClick={handleAddDoenca}
                disabled={addDoencaMutation.isLoading}
            >
            {addDoencaMutation.isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}