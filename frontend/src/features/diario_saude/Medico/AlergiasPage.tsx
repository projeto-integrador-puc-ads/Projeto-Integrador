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
  useMediaQuery,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// 🔹 Componentes
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import ListItemCard from "../components/ListItemCard";

export default function AlergiasPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const paciente = location.state?.paciente;
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  const [listaAlergiasSistema, setListaAlergiasSistema] = useState<any[]>([]);
  const [alergiasPaciente, setAlergiasPaciente] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alergiaSelecionada, setAlergiaSelecionada] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // REDIRECIONA SE NÃO HOUVER PACIENTE
  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  // LISTAR TODAS AS ALERGIAS DO SISTEMA
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/diario_saude/alergia/listar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setListaAlergiasSistema(data))
      .catch(console.error);
  }, [token]);

  // LISTAR ALERGIAS DO PACIENTE
  const loadAlergiasPaciente = () => {
    if (!paciente) return;
    fetch(`http://localhost:8080/api/diario_saude/usuario-alergia/usuario/${paciente.id_usuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAlergiasPaciente(data))
      .catch(console.error);
  };

  useEffect(() => { loadAlergiasPaciente(); }, [paciente]);

  // ADICIONAR ALERGIA
  const handleAddAlergia = async () => {
    if (!alergiaSelecionada) return alert("Selecione uma alergia antes de adicionar.");

    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-alergia/add?usuarioId=${paciente.id_usuario}&alergiaId=${alergiaSelecionada.id}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );

    setDialogOpen(false);
    setAlergiaSelecionada(null);
    loadAlergiasPaciente();
  };

  // REMOVER ALERGIA
  const handleRemoveAlergia = async (id: number) => {
    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-alergia/delete?usuarioId=${paciente.id_usuario}&alergiaId=${id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    );
    loadAlergiasPaciente();
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

      {alergiasPaciente.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          Nenhuma alergia cadastrada para este paciente.
        </Typography>
      )}

      {alergiasPaciente.map((a) => (
        <ListItemCard key={a.id} title={a.nome} onDelete={() => handleRemoveAlergia(a.id)} />
      ))}

      <Button
        startIcon={<AddIcon />}
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setDialogOpen(true)}
      >
        Adicionar Alergia
      </Button>

      <Box textAlign="center" mt={6}>
        <Typography variant={isMobile ? "body1" : "h6"}>{usuario?.nome}</Typography>
        <Typography variant="body2">{new Date().toLocaleDateString("pt-BR")}</Typography>
      </Box>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: isMobile ? "1.2rem" : "1.4rem" }}>Adicionar Alergia</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaAlergiasSistema}
              getOptionLabel={(option) => option.nome}
              onChange={(e, v) => setAlergiaSelecionada(v)}
              renderInput={(params) => <TextField {...params} label="Pesquise a alergia" fullWidth />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddAlergia}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
