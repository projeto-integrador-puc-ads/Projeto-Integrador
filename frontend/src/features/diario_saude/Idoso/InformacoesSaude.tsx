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

  const pacienteId = usuarioLogado?.id_usuario;

  const [usuario, setUsuario] = useState(null);
  const [editData, setEditData] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    alergias: ""
  });

  // ==========================
  // ESTADOS DOENÇAS
  // ==========================
  const [listaDoencasSistema, setListaDoencasSistema] = useState([]);
  const [doencasUsuario, setDoencasUsuario] = useState([]);
  const [dialogDoencaOpen, setDialogDoencaOpen] = useState(false);
  const [doencaSelecionada, setDoencaSelecionada] = useState(null);

  // ==========================
  // ESTADOS ALERGIAS
  // ==========================
  const [listaAlergiasSistema, setListaAlergiasSistema] = useState([]);
  const [alergiasUsuario, setAlergiasUsuario] = useState([]);
  const [dialogAlergiaOpen, setDialogAlergiaOpen] = useState(false);
  const [alergiaSelecionada, setAlergiaSelecionada] = useState(null);

  // ==========================
  // DADOS DO USUÁRIO
  // ==========================
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

  // ==========================
  // ALTERAR CAMPOS
  // ==========================
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
        alert("Erro ao salvar informações.");
      }
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  };

  // ==========================
  // CARREGAR LISTA DOENÇAS SISTEMA
  // ==========================
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/doencas/listar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setListaDoencasSistema(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao listar doenças:", err));
  }, [token]);

  // ==========================
  // CARREGAR DOENÇAS DO USUÁRIO
  // ==========================
  const loadDoencasUsuario = () => {
    fetch(`http://localhost:8080/usuario-doenca/usuario/${pacienteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDoencasUsuario(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar doenças:", err));
  };

  useEffect(() => {
    if (pacienteId) loadDoencasUsuario();
  }, [pacienteId]);

  const handleAddDoenca = async () => {
    if (!doencaSelecionada) {
      alert("Selecione uma doença.");
      return;
    }

    await fetch(
      `http://localhost:8080/usuario-doenca/add?usuarioId=${pacienteId}&doencaId=${doencaSelecionada.id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setDialogDoencaOpen(false);
    setDoencaSelecionada(null);
    loadDoencasUsuario();
  };

  const handleRemoveDoenca = async (id) => {
    await fetch(
      `http://localhost:8080/usuario-doenca/delete?usuarioId=${pacienteId}&doencaId=${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    loadDoencasUsuario();
  };

  // ==========================
  // ALERGIAS - LISTA SISTEMA
  // ==========================
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/diario_saude/alergia/listar", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setListaAlergiasSistema(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao listar alergias:", err));
  }, [token]);

  // ==========================
  // ALERGIAS DO USUÁRIO
  // ==========================
  const loadAlergiasUsuario = () => {
    fetch(`http://localhost:8080/api/diario_saude/usuario-alergia/usuario/${pacienteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setAlergiasUsuario(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar alergias:", err));
  };

  useEffect(() => {
    if (pacienteId) loadAlergiasUsuario();
  }, [pacienteId]);

  const handleAddAlergia = async () => {
    if (!alergiaSelecionada) {
      alert("Selecione uma alergia.");
      return;
    }

    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-alergia/add?usuarioId=${pacienteId}&alergiaId=${alergiaSelecionada.id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setDialogAlergiaOpen(false);
    setAlergiaSelecionada(null);
    loadAlergiasUsuario();
  };

  const handleRemoveAlergia = async (id) => {
    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-alergia/delete?usuarioId=${pacienteId}&alergiaId=${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    loadAlergiasUsuario();
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        Voltar
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
          Informações de Saúde
        </Typography>

        {/* DADOS DO PACIENTE */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Dados do Paciente
        </Typography>

        <Stack spacing={2}>
          <TextField label="Nome" name="nome" value={editData.nome} onChange={handleChange} fullWidth />
          <TextField label="Idade" name="idade" type="number" value={editData.idade} onChange={handleChange} fullWidth />
          <TextField label="Peso (kg)" name="peso" type="number" value={editData.peso} onChange={handleChange} fullWidth />
          <TextField label="Altura (m)" name="altura" type="number" value={editData.altura} onChange={handleChange} fullWidth />
          <TextField label="Alergias (texto)" name="alergias" value={editData.alergias} onChange={handleChange} fullWidth multiline />
        </Stack>

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={salvarAlteracoes}>
          Salvar Alterações
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* DOENÇAS */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Doenças Cadastradas
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
                flexDirection: "column",
                alignItems: "flex-start"
              }}
            >
              <ListItemText primary={d.nome} />
              <Box sx={{ width: "100%", textAlign: "right", mt: 1 }}>
                <DeleteIcon
                  onClick={() => handleRemoveDoenca(d.id)}
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
          onClick={() => setDialogDoencaOpen(true)}
        >
          Adicionar Doença
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* ALERGIAS */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Alergias Cadastradas
        </Typography>

        <List dense>
          {alergiasUsuario.map((a) => (
            <ListItem
              key={a.id}
              sx={{
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                mb: 1,
                px: 2,
                flexDirection: "column",
                alignItems: "flex-start"
              }}
            >
              <ListItemText primary={a.nome} />
              <Box sx={{ width: "100%", textAlign: "right", mt: 1 }}>
                <DeleteIcon
                  onClick={() => handleRemoveAlergia(a.id)}
                  style={{ color: "#d32f2f", cursor: "pointer" }}
                  fontSize="medium"
                />
              </Box>
            </ListItem>
          ))}

          {alergiasUsuario.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
              Nenhuma alergia cadastrada.
            </Typography>
          )}
        </List>

        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          onClick={() => setDialogAlergiaOpen(true)}
        >
          Adicionar Alergia
        </Button>
      </Paper>

      {/* DIALOG DOENÇAS */}
      <Dialog open={dialogDoencaOpen} fullWidth onClose={() => setDialogDoencaOpen(false)}>
        <DialogTitle>Adicionar Doença</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaDoencasSistema}
              getOptionLabel={(op) => op?.nome || ""}
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
          <Button onClick={() => setDialogDoencaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddDoenca}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG ALERGIAS */}
      <Dialog open={dialogAlergiaOpen} fullWidth onClose={() => setDialogAlergiaOpen(false)}>
        <DialogTitle>Adicionar Alergia</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaAlergiasSistema}
              getOptionLabel={(op) => op?.nome || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, v) => setAlergiaSelecionada(v)}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.nome}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Selecione a alergia" />}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogAlergiaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddAlergia}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
