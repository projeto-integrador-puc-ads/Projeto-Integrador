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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

export default function InformacoesSaudePage() {
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!usuarioLogado) navigate("/login");
  }, [usuarioLogado, navigate]);

  const pacienteId = usuarioLogado?.id_usuario; // <-- idoso

  const [usuario, setUsuario] = useState(null);
  const [editData, setEditData] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    alergias: ""
  });

  const [listaDoencasSistema, setListaDoencasSistema] = useState([]);
  const [doencasUsuario, setDoencasUsuario] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [doencaSelecionada, setDoencaSelecionada] = useState(null);

  // Buscar informações do usuário (IDOSO)
  useEffect(() => {
    if (!pacienteId || !token) return;

    fetch(`http://localhost:8080/api/diario_saude/usuario/${pacienteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);
        setEditData({
          nome: data.nome || "",
          idade: data.idade || "",
          peso: data.peso || "",
          altura: data.altura || "",
          alergias: data.alergias || ""
        });
      })
      .catch((err) => console.error("Erro ao buscar usuário:", err));
  }, [pacienteId, token]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const salvarAlteracoes = async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/diario_saude/usuario", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: pacienteId,
          ...editData
        })
      });

      if (resp.ok) {
        alert("Informações atualizadas!");

        const atualizado = { ...usuarioLogado, ...editData };
        localStorage.setItem("usuario", JSON.stringify(atualizado));

        setUsuario(atualizado);
      } else {
        alert("Erro ao salvar alterações.");
      }
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  };

  // Carrega lista geral de doenças
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/doencas/listar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setListaDoencasSistema(data))
      .catch((err) => console.error("Erro ao listar doenças:", err));
  }, [token]);

  // Carrega doenças do idoso
  const loadDoencasUsuario = () => {
    fetch(`http://localhost:8080/usuario-doenca/usuario/${pacienteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDoencasUsuario(data))
      .catch((err) => console.error("Erro ao carregar doenças do usuário:", err));
  };

  useEffect(() => {
    if (pacienteId) loadDoencasUsuario();
  }, [pacienteId]);

  const handleAddDoenca = async () => {
    if (!doencaSelecionada) {
      alert("Selecione uma doença.");
      return;
    }

    try {
      await fetch(
        `http://localhost:8080/usuario-doenca/add?usuarioId=${pacienteId}&doencaId=${doencaSelecionada.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDialogOpen(false);
      setDoencaSelecionada(null);
      loadDoencasUsuario();
    } catch (err) {
      console.error("Erro ao adicionar doença:", err);
    }
  };

  const handleRemove = async (doencaId) => {
    try {
      await fetch(
        `http://localhost:8080/usuario-doenca/delete?usuarioId=${pacienteId}&doencaId=${doencaId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      loadDoencasUsuario();
    } catch (err) {
      console.error("Erro ao remover doença:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
          Informações de Saúde
        </Typography>

        {/* SEÇÃO EDITÁVEL DO USUÁRIO */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Dados do Paciente
          </Typography>

          <Stack spacing={2}>
            <TextField label="Nome" name="nome" value={editData.nome} onChange={handleChange} fullWidth />
            <TextField label="Idade" name="idade" type="number" value={editData.idade} onChange={handleChange} fullWidth />
            <TextField label="Peso (kg)" name="peso" type="number" value={editData.peso} onChange={handleChange} fullWidth />
            <TextField label="Altura (m)" name="altura" type="number" value={editData.altura} onChange={handleChange} fullWidth />
            <TextField label="Alergias" name="alergias" value={editData.alergias} onChange={handleChange} fullWidth multiline />
          </Stack>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={salvarAlteracoes}
          >
            Salvar Alterações
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* SEÇÃO DOENÇAS */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Doenças cadastradas
        </Typography>

        <List dense>
          {doencasUsuario.map((d) => (
            <ListItem
            key={d.id}
            sx={{
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                mb: 1,
                px: 2,
                flexDirection: "column",   // 👈 torna vertical
                alignItems: "flex-start"
            }}
            >
            <ListItemText primary={d.nome} />

            {/* Linha da lixeira separada */}
            <Box sx={{ width: "100%", textAlign: "right", mt: 1 }}>
                <DeleteIcon
                onClick={() => handleRemove(d.id)}
                style={{ color: "#d32f2f", cursor: "pointer" }}
                fontSize="medium"
                />
            </Box>
            </ListItem>
          ))}

          {doencasUsuario.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
              Nenhuma doença cadastrada.
            </Typography>
          )}
        </List>

        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          onClick={() => setDialogOpen(true)}
        >
          Adicionar Doença
        </Button>
      </Paper>

      {/* DIALOG */}
      <Dialog open={dialogOpen} fullWidth onClose={() => setDialogOpen(false)}>
        <DialogTitle>Adicionar Doença</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
            options={listaDoencasSistema}
            getOptionLabel={(op) => op.nome}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, v) => setDoencaSelecionada(v)}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                {option.nome}
                </li>
            )}
            renderInput={(params) => <TextField {...params} label="Selecione a doença" />}
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
