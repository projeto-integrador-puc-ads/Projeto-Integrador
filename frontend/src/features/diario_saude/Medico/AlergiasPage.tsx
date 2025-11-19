import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function AlergiasPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const paciente = location.state?.paciente;

  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  const [listaAlergiasSistema, setListaAlergiasSistema] = useState([]);
  const [alergiasPaciente, setAlergiasPaciente] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alergiaSelecionada, setAlergiaSelecionada] = useState(null);

  // RESPONSIVIDADE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // LISTAR TODAS AS ALERGIAS DO SISTEMA
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/diario_saude/alergia/listar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setListaAlergiasSistema(data))
      .catch(err => console.error("Erro ao carregar alergias:", err));
  }, [token]);

  // LISTAR ALERGIAS DO PACIENTE
  const loadAlergiasPaciente = () => {
    if (!paciente) return;

    fetch(`http://localhost:8080/api/diario_saude/usuario-alergia/usuario/${paciente.id_usuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAlergiasPaciente(data))
      .catch(err => console.error("Erro ao carregar alergias do paciente:", err));
  };

  useEffect(() => {
    loadAlergiasPaciente();
  }, [paciente]);

  // ADICIONAR ALERGIA
  const handleAddAlergia = async () => {
    if (!alergiaSelecionada) {
      alert("Selecione uma alergia antes de adicionar.");
      return;
    }

    try {
      await fetch(
        `http://localhost:8080/api/diario_saude/usuario-alergia/add?usuarioId=${paciente.id_usuario}&alergiaId=${alergiaSelecionada.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDialogOpen(false);
      setAlergiaSelecionada(null);
      loadAlergiasPaciente();
    } catch (err) {
      console.error("Erro ao adicionar alergia:", err);
    }
  };

  // REMOVER ALERGIA
  const handleRemoveAlergia = async (idAlergia) => {
    try {
      await fetch(
        `http://localhost:8080/api/diario_saude/usuario-alergia/delete?usuarioId=${paciente.id_usuario}&alergiaId=${idAlergia}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      loadAlergiasPaciente();
    } catch (err) {
      console.error("Erro ao remover alergia:", err);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: isMobile ? 2 : 5,
        px: isMobile ? 1 : 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 3,
        }}
      >
        {/* VOLTAR */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          fullWidth={isMobile}
          sx={{
            textTransform: "none",
            mb: isMobile ? 1 : 2,
            fontSize: isMobile ? "0.85rem" : "1rem",
          }}
        >
          Voltar
        </Button>

        {/* TÍTULO */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          fontWeight="bold"
          mb={3}
        >
          Alergias do Paciente
        </Typography>

        {/* PACIENTE */}
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{ mb: 2, textAlign: isMobile ? "center" : "left" }}
        >
          Paciente: <strong>{paciente?.nome}</strong>
        </Typography>

        {/* LISTA */}
        <Typography variant={isMobile ? "body1" : "h6"} mb={1}>
          Alergias cadastradas:
        </Typography>

        <List dense sx={{ width: "100%" }}>
          {alergiasPaciente.map((a) => (
            <ListItem
              key={a.id}
              sx={{
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? 1 : 0,
                borderBottom: "1px solid #e0e0e0",
              }}
              secondaryAction={
                <Button
                  color="error"
                  onClick={() => handleRemoveAlergia(a.id)}
                  size={isMobile ? "small" : "medium"}
                >
                  Remover
                </Button>
              }
            >
              <ListItemText
                primary={a.nome}
                primaryTypographyProps={{
                  fontSize: isMobile ? "0.95rem" : "1rem",
                }}
              />
            </ListItem>
          ))}

          {alergiasPaciente.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
              Nenhuma alergia cadastrada para este paciente.
            </Typography>
          )}
        </List>

        {/* BOTÃO ADICIONAR */}
        <Button
          startIcon={<AddIcon />}
          fullWidth={isMobile}
          sx={{ mt: 2 }}
          onClick={() => setDialogOpen(true)}
        >
          Adicionar Alergia
        </Button>

        {/* RODAPÉ */}
        <Box textAlign="center" mt={6}>
          <Typography variant={isMobile ? "body1" : "h6"}>
            {usuario?.nome}
          </Typography>
          <Typography variant="body2">
            {new Date().toLocaleDateString("pt-BR")}
          </Typography>
        </Box>
      </Paper>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: isMobile ? "1.2rem" : "1.4rem" }}>
          Adicionar Alergia
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaAlergiasSistema}
              getOptionLabel={(option) => option.nome}
              onChange={(e, v) => setAlergiaSelecionada(v)}
              renderInput={(params) => (
                <TextField {...params} label="Pesquise a alergia" fullWidth />
              )}
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
    </Container>
  );
}
