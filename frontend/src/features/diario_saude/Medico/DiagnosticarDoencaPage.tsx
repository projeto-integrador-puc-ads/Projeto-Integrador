import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  useMediaQuery
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { useTheme } from "@mui/material/styles";

export default function DoencasPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const paciente = location.state?.paciente;

  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  const [listaDoencasSistema, setListaDoencasSistema] = useState([]);
  const [doencasPaciente, setDoencasPaciente] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [doencaSelecionada, setDoencaSelecionada] = useState(null);

  // RESPONSIVIDADE MUI
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // LISTA TODAS AS DOENÇAS DO SISTEMA
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/doencas/listar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setListaDoencasSistema(data))
      .catch(err => console.error("Erro ao buscar doenças:", err));
  }, [token]);

  // BUSCA AS DOENÇAS DO PACIENTE
  const loadDoencasPaciente = () => {
    if (!paciente) return;

    fetch(`http://localhost:8080/usuario-doenca/usuario/${paciente.id_usuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDoencasPaciente(data))
      .catch(err => console.error("Erro ao buscar doenças do paciente:", err));
  };

  useEffect(() => {
    loadDoencasPaciente();
  }, [paciente]);

  // ADICIONAR
  const handleAddDoenca = async () => {
    if (!doencaSelecionada) {
      alert("Selecione uma doença antes de adicionar.");
      return;
    }

    try {
      await fetch(
        `http://localhost:8080/usuario-doenca/add?usuarioId=${paciente.id_usuario}&doencaId=${doencaSelecionada.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDialogOpen(false);
      setDoencaSelecionada(null);
      loadDoencasPaciente();
    } catch (err) {
      console.error("Erro ao adicionar doença:", err);
    }
  };

  // REMOVER
  const handleRemoveDoenca = async (idDoenca) => {
    try {
      await fetch(
        `http://localhost:8080/usuario-doenca/delete?usuarioId=${paciente.id_usuario}&doencaId=${idDoenca}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      loadDoencasPaciente();
    } catch (err) {
      console.error("Erro ao remover doença:", err);
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
        {/* BOTÃO VOLTAR */}
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
          Doenças do Paciente
        </Typography>

        {/* PACIENTE */}
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{ mb: 2, textAlign: isMobile ? "center" : "left" }}
        >
          Paciente: <strong>{paciente?.nome}</strong>
        </Typography>

        {/* LISTA */}
        <Typography
          variant={isMobile ? "body1" : "h6"}
          mb={1}
        >
          Doenças cadastradas:
        </Typography>

        <List dense sx={{ width: "100%" }}>
          {doencasPaciente.map((d) => (
            <ListItem
              key={d.id}
              sx={{
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? 1 : 0,
                borderBottom: "1px solid #e0e0e0",
              }}
              secondaryAction={
                <Button
                  color="error"
                  onClick={() => handleRemoveDoenca(d.id)}
                  size={isMobile ? "small" : "medium"}
                >
                  Remover
                </Button>
              }
            >
              <ListItemText
                primary={d.nome}
                primaryTypographyProps={{
                  fontSize: isMobile ? "0.95rem" : "1rem",
                }}
              />
            </ListItem>
          ))}

          {doencasPaciente.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ mt: 1, textAlign: "center" }}
            >
              Nenhuma doença cadastrada para este paciente.
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
          Adicionar Doença
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth={isMobile ? "xs" : "sm"}
      >
        <DialogTitle sx={{ fontSize: isMobile ? "1.2rem" : "1.4rem" }}>
          Adicionar Doença
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaDoencasSistema}
              getOptionLabel={(option) => option.nome}
              onChange={(e, v) => setDoencaSelecionada(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pesquise a doença"
                  fullWidth
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddDoenca}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
