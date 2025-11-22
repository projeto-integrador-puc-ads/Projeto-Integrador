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

  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  // LISTA DOENÇAS DO SISTEMA
  const { data: listaDoencasSistema = [] } = useQuery({
    queryKey: ["doencas", "sistema"],
    queryFn: () => doencaApi.listar(),
  });

  // LISTA DOENÇAS DO PACIENTE
  const { data: doencasPaciente = [] } = useQuery({
    queryKey: ["usuario", paciente?.id_usuario, "doencas"],
    queryFn: () => usuarioDoencaApi.listar(paciente.id_usuario),
    enabled: !!paciente?.id_usuario,
  });

  // ADICIONAR DOENÇA
  const addDoencaMutation = useMutation({
    mutationFn: ({ usuarioId, doencaId }: { usuarioId: number; doencaId: number }) =>
      usuarioDoencaApi.adicionar(usuarioId, doencaId),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuario", paciente?.id_usuario, "doencas"]);
      setDialogOpen(false);
      setDoencaSelecionada(null);
    },
  });

  const handleAddDoenca = () => {
    if (!doencaSelecionada || !paciente) return alert("Selecione uma doença.");
    addDoencaMutation.mutate({ usuarioId: paciente.id_usuario, doencaId: doencaSelecionada.id });
  };

  // REMOVER DOENÇA
  const removeDoencaMutation = useMutation({
    mutationFn: ({ usuarioId, doencaId }: { usuarioId: number; doencaId: number }) =>
      usuarioDoencaApi.remover(usuarioId, doencaId),
    onSuccess: () => queryClient.invalidateQueries(["usuario", paciente?.id_usuario, "doencas"]),
  });

  const handleRemoveDoenca = (id: number) => {
    if (!paciente) return;
    removeDoencaMutation.mutate({ usuarioId: paciente.id_usuario, doencaId: id });
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

      <PageTitle>Doenças do Paciente</PageTitle>

      <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 2 }}>
        Paciente: <strong>{paciente?.nome}</strong>
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
              getOptionLabel={(option) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, v) => setDoencaSelecionada(v)}
              
              renderOption={(props, option) => (
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
          <Button variant="contained" onClick={handleAddDoenca} disabled={addDoencaMutation.isLoading}>
            {addDoencaMutation.isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
