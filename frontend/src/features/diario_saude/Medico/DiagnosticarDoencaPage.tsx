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

//Componentes
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import ListItemCard from "../components/ListItemCard";

export default function DoencasPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const paciente = location.state?.paciente;
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  const [listaDoencasSistema, setListaDoencasSistema] = useState<any[]>([]);
  const [doencasPaciente, setDoencasPaciente] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [doencaSelecionada, setDoencaSelecionada] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // REDIRECIONA SE NÃO HOUVER PACIENTE
  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  // LISTA TODAS AS DOENÇAS DO SISTEMA
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/diario_saude/doencas/listar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setListaDoencasSistema(data))
      .catch(console.error);
  }, [token]);

  // LISTA AS DOENÇAS DO PACIENTE
  const loadDoencasPaciente = () => {
    if (!paciente) return;
    fetch(`http://localhost:8080/api/diario_saude/usuario-doenca/usuario/${paciente.id_usuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDoencasPaciente(data))
      .catch(console.error);
  };

  useEffect(() => { loadDoencasPaciente(); }, [paciente]);

  // ADICIONAR DOENÇA
  const handleAddDoenca = async () => {
    if (!doencaSelecionada) return alert("Selecione uma doença antes de adicionar.");

    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-doenca/add?usuarioId=${paciente.id_usuario}&doencaId=${doencaSelecionada.id}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );

    setDialogOpen(false);
    setDoencaSelecionada(null);
    loadDoencasPaciente();
  };

  // REMOVER DOENÇA
  const handleRemoveDoenca = async (id: number) => {
    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-doenca/delete?usuarioId=${paciente.id_usuario}&doencaId=${id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    );
    loadDoencasPaciente();
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

      {doencasPaciente.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          Nenhuma doença cadastrada para este paciente.
        </Typography>
      )}

      {doencasPaciente.map((d) => (
        <ListItemCard key={d.id} title={d.nome} onDelete={() => handleRemoveDoenca(d.id)} />
      ))}

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
              onChange={(e, v) => setDoencaSelecionada(v)}
              renderInput={(params) => <TextField {...params} label="Pesquise a doença" fullWidth />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddDoenca}>Adicionar</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
