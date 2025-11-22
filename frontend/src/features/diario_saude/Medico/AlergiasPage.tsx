import { useState, useEffect } from "react";
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
import { alergiaApi } from "../api/alergiaApi";
import { usuarioAlergiaApi } from "../api/usuarioAlergiaApi";

import type { Alergia } from "../api/types";

export default function AlergiasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const paciente = location.state?.paciente;
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const pacienteId = paciente?.id_usuario;

  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  // LISTAR TODAS AS ALERGIAS
  const { data: listaAlergiasSistema = [] } = useQuery<Alergia[]>({
    queryKey: ["alergias", "sistema"],
    queryFn: () => alergiaApi.listarSistema(),
  });

  // LISTAR ALERGIAS DO PACIENTE
  const { data: alergiasPaciente = [] } = useQuery<Alergia[]>({
    queryKey: ["usuario", pacienteId, "alergias"],
    queryFn: () => usuarioAlergiaApi.listar(pacienteId!),
    enabled: !!pacienteId,
  });

  // MUTAÇÕES
  const addAlergiaMutation = useMutation({
    mutationFn: ({ usuarioId, alergiaId }: { usuarioId: number; alergiaId: number }) =>
      usuarioAlergiaApi.adicionar(usuarioId, alergiaId),
    onSuccess: () => queryClient.invalidateQueries(["usuario", pacienteId, "alergias"]),
  });

  const removeAlergiaMutation = useMutation({
    mutationFn: ({ usuarioId, alergiaId }: { usuarioId: number; alergiaId: number }) =>
      usuarioAlergiaApi.remover(usuarioId, alergiaId),
    onSuccess: () => queryClient.invalidateQueries(["usuario", pacienteId, "alergias"]),
  });

  const [dialogAlergiaOpen, setDialogAlergiaOpen] = useState(false);
  const [alergiaSelecionada, setAlergiaSelecionada] = useState<Alergia | null>(null);

  const handleAddAlergia = () => {
    if (!alergiaSelecionada || !pacienteId) return alert("Selecione uma alergia.");
    addAlergiaMutation.mutate({ usuarioId: pacienteId, alergiaId: alergiaSelecionada.id });
    setDialogAlergiaOpen(false);
    setAlergiaSelecionada(null);
  };

  const handleRemoveAlergia = (id: number) => {
    if (!pacienteId) return;
    removeAlergiaMutation.mutate({ usuarioId: pacienteId, alergiaId: id });
  };

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

      <PageTitle>Alergias do Paciente</PageTitle>
      <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 2 }}>
        Paciente: <strong>{paciente?.nome}</strong>
      </Typography>

      <SectionTitle>Alergias cadastradas</SectionTitle>

      {alergiasPaciente.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          Nenhuma alergia cadastrada para este paciente.
        </Typography>
      ) : (
        alergiasPaciente.map((a) => (
          <ListItemCard key={a.id} title={a.nome} onDelete={() => handleRemoveAlergia(a.id)} />
        ))
      )}

      <Button
        startIcon={<AddIcon />}
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setDialogAlergiaOpen(true)}
      >
        Adicionar Alergia
      </Button>

      {/* DIALOG */}
      <Dialog open={dialogAlergiaOpen} onClose={() => setDialogAlergiaOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: isMobile ? "1.2rem" : "1.4rem" }}>Adicionar Alergia</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaAlergiasSistema}
              getOptionLabel={(option) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              onChange={(e, v) => setAlergiaSelecionada(v)}
              renderInput={(params) => <TextField {...params} label="Selecione a alergia" fullWidth />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAlergiaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddAlergia} disabled={addAlergiaMutation.isLoading}>
            {addAlergiaMutation.isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box textAlign="center" mt={6}>
        <Typography variant={isMobile ? "body1" : "h6"}>{usuarioLogado?.nome}</Typography>
        <Typography variant="body2">{new Date().toLocaleDateString("pt-BR")}</Typography>
      </Box>
    </PageContainer>
  );
}
