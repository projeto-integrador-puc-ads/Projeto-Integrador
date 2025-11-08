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

  if (!paciente) {
    navigate("/medico");
    return null;
  }

  // Simula usuário logado no localStorage
  useEffect(() => {
    const usuarioSimulado = {
      id_usuario: 1,
      nome: "Dr. Lucas Gabriel",
      email: "lucas@email.com",
      role: "MEDICO",
    };
    const tokenSimulado = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtYXJpYUBlbWFpbC5jb20iLCJpYXQiOjE3NjI1MzcxOTMsImV4cCI6MTc2MzE0MTk5M30.yE5nfEbrvnsnfZfte-mi1VRFnEyLdI77SLH4RmIsEo8P2Hd46lWACmCzEsWiUc0g";

    if (!localStorage.getItem("usuarioLogado")) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioSimulado));
    }
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", tokenSimulado);
    }
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

  const listaMedicamentos = [
    { nome: "Dipirona", principio: "Dipirona Sódica", concentracao: "500mg", via: "Oral", tipo: "Simples" },
    { nome: "Amoxicilina", principio: "Amoxicilina Tri-Hidratada", concentracao: "500mg", via: "Oral", tipo: "Controlada" },
    { nome: "Ibuprofeno", principio: "Ibuprofeno", concentracao: "400mg", via: "Oral", tipo: "Simples" },
  ];

  const listaVias = ["Oral", "Intravenosa", "Intramuscular", "Inalatória", "Sublingual", "Tópica"];
  const listaTipos = ["Simples", "Controlada", "Retida", "Psicotrópica"];

  const receitaTexto = `
        Paciente: ${paciente.nome}
        Medicamentos:
        ${medList.map(m => `- ${m.nome} (${m.concentracao}) - ${m.via} (${m.tipo})`).join("\n")}

        Orientações:
        ${orientacoes}

        Sinais de Alarme:
        ${sinaisAlarme}
        `;

  const handleAddMedicamento = () => {
    setMedList([...medList, form]);
    setForm({ nome: "", principio: "", concentracao: "", via: "", tipo: "" });
    setDialogOpen(false);
  };

  const handleSaveReceita = async () => {
    if (!token) {
      alert("Token não encontrado. Faça login primeiro.");
      return;
    }

    const payload = {
      id_medico: usuario.id_usuario,
      id_usuario: paciente.id_usuario,
      descricao: receitaTexto,
    };

    try {
      const response = await fetch("http://localhost:8080/api/diario_saude/prescricao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
      
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
          Paciente: <strong>{paciente.nome}</strong>
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

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 4 }} 
          onClick={handleSaveReceita}
        >
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
                if (newValue) {
                  setForm({
                    nome: newValue.nome,
                    principio: newValue.principio,
                    concentracao: newValue.concentracao,
                    via: newValue.via,
                    tipo: newValue.tipo,
                  });
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Nome do Medicamento" fullWidth />
              )}
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
              renderInput={(params) => (
                <TextField {...params} label="Via de Administração" fullWidth />
              )}
            />

            <Autocomplete
              options={listaTipos}
              value={form.tipo}
              onChange={(e, newValue) => setForm({ ...form, tipo: newValue ?? "" })}
              renderInput={(params) => (
                <TextField {...params} label="Tipo de Receita" fullWidth />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddMedicamento}>Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
