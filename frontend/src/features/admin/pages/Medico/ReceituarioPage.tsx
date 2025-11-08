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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

type Paciente = {
  id_usuario: number;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  alergias?: string;
};

type Medicamento = {
  id_medicamento?: number;
  nome: string;
  principio: string;
  concentracao: string;
  via: string;
  tipo: string;
};

export default function ReceituarioPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paciente = location.state?.paciente as Paciente | undefined;

  // Redireciona se paciente não existir
  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  // Simula login
  useEffect(() => {
    const usuarioSimulado = {
      id_usuario: 1,
      nome: "Dr. Lucas Gabriel",
      email: "lucas@email.com",
      role: "MEDICO",
    };
    const tokenSimulado =
      "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtYXJpYUBlbWFpbC5jb20iLCJpYXQiOjE3NjI1MzcxOTMsImV4cCI6MTc2MzE0MTk5M30.yE5nfEbrvnsnfZfte-mi1VRFnEyLdI77SLH4RmIsEo8P2Hd46lWACmCzEsWiUc0g";

    if (!localStorage.getItem("usuarioLogado"))
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioSimulado));
    if (!localStorage.getItem("token")) localStorage.setItem("token", tokenSimulado);
  }, []);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  const token = localStorage.getItem("token");

  const [orientacoes, setOrientacoes] = useState("");
  const [sinaisAlarme, setSinaisAlarme] = useState("");
  const [medList, setMedList] = useState<Medicamento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState<Medicamento>({
    nome: "",
    principio: "",
    concentracao: "",
    via: "",
    tipo: "",
  });

  const [listaMedicamentos, setListaMedicamentos] = useState<Medicamento[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/diario_saude/medicamentos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setListaMedicamentos(data))
      .catch((err) => console.error("Erro ao buscar medicamentos:", err));
  }, [token]);

  const listaVias = ["Oral", "Intravenosa", "Intramuscular", "Inalatória", "Sublingual", "Tópica"];
  const listaTipos = ["Simples", "Controlada", "Retida", "Psicotrópica"];

  const handleAddMedicamento = () => {
    if (!form.nome || !form.concentracao || !form.via) {
      alert("Preencha nome, concentração e via do medicamento");
      return;
    }
    setMedList([...medList, form]);
    setForm({ nome: "", principio: "", concentracao: "", via: "", tipo: "" });
    setDialogOpen(false);
  };

  const handleSaveReceita = async () => {
    if (!token) {
      alert("Token não encontrado.");
      return;
    }

    try {
      // Cria prescrição médica
      const prescricaoResp = await fetch(
        "http://localhost:8080/api/diario_saude/prescricao",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_medico: usuario.id_usuario,
            id_usuario: paciente.id_usuario,
            descricao: `Orientações: ${orientacoes}\nSinais de Alarme: ${sinaisAlarme}`,
          }),
        }
      );

      if (!prescricaoResp.ok) throw new Error("Erro ao criar prescrição médica");
      const prescricaoData = await prescricaoResp.json();
      const prescricaoId = prescricaoData.id_prescricao;

      // Insere medicamentos na tabela prescricao_medicamento
      for (const med of medList) {
        await fetch("http://localhost:8080/api/diario_saude/prescricao_medicamento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_prescricao: prescricaoId,
            id_medicamento: med.id_medicamento || null,
            dosagem: med.concentracao,
            frequencia: med.tipo,
            via: med.via,
          }),
        });
      }

      alert("✅ Receita salva com sucesso!");
      navigate(-1);
    } catch (err) {
      console.error("❌ Erro ao salvar receita:", err);
      alert("Erro ao salvar a receita.");
    }
  };

  const dataHoje = new Date().toLocaleDateString("pt-BR");

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9fafc" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ textTransform: "none", mb: 2 }}>
          Voltar
        </Button>

        <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
          RECEITUÁRIO
        </Typography>

        <Typography variant="h6" sx={{ textAlign: "left", mb: 3 }}>
          Paciente: <strong>{paciente?.nome}</strong>
        </Typography>

        <Typography variant="h6" mb={1}>Medicamentos:</Typography>

        <List dense>
          {medList.map((m, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText primary={`${m.nome} (${m.principio}) - ${m.concentracao} - ${m.via} - ${m.tipo}`} />
            </ListItem>
          ))}
        </List>

        <IconButton size="small" onClick={() => setDialogOpen(true)}>
          <AddIcon /> <Typography ml={1}>Adicionar Medicamento</Typography>
        </IconButton>

        <TextField
          label="Orientações"
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 3 }}
          value={orientacoes}
          onChange={(e) => setOrientacoes(e.target.value)}
        />

        <TextField
          label="Sinais de Alarme"
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 3 }}
          value={sinaisAlarme}
          onChange={(e) => setSinaisAlarme(e.target.value)}
        />

        <Box textAlign="center" mt={6}>
          <Typography variant="h6">{usuario?.nome || "Profissional de Saúde"}</Typography>
          <Typography variant="body2">{dataHoje}</Typography>
        </Box>

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 4 }} onClick={handleSaveReceita}>
          Salvar Receita
        </Button>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>Adicionar Medicamento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={listaMedicamentos}
              getOptionLabel={(option) => option.nome}
              onChange={(event, newValue) => {
                if (newValue) setForm(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Nome do Medicamento" fullWidth />}
            />

            <TextField
              label="Princípio Ativo"
              fullWidth
              value={form.principio}
              onChange={(e) => setForm({ ...form, principio: e.target.value })}
            />

            <TextField
              label="Concentração"
              fullWidth
              value={form.concentracao}
              onChange={(e) => setForm({ ...form, concentracao: e.target.value })}
            />

            <Autocomplete
              options={listaVias}
              value={form.via}
              onChange={(e, newValue) => setForm({ ...form, via: newValue ?? "" })}
              renderInput={(params) => <TextField {...params} label="Via de Administração" fullWidth />}
            />

            <Autocomplete
              options={listaTipos}
              value={form.tipo}
              onChange={(e, newValue) => setForm({ ...form, tipo: newValue ?? "" })}
              renderInput={(params) => <TextField {...params} label="Tipo de Receita" fullWidth />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddMedicamento}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
