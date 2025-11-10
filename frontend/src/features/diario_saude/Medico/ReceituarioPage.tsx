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
  nome_medicamento: string;
  principio_ativo: string;
  concentracao: string;
  via: string;
};

export default function ReceituarioPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paciente = location.state?.paciente as Paciente | undefined;
  const prescricaoExistente = location.state?.prescricao;

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
    
    if (!localStorage.getItem("usuarioLogado"))
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioSimulado));
  }, []);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  const token = localStorage.getItem("token");

  const [orientacoes, setOrientacoes] = useState("");
  const [sinaisAlarme, setSinaisAlarme] = useState("");
  const [medList, setMedList] = useState<Medicamento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState<Medicamento>({
    nome_medicamento: "",
    principio_ativo: "",
    concentracao: "",
    via: "",
  });

  const [listaMedicamentos, setListaMedicamentos] = useState<Medicamento[]>([]);
  const listaVias = ["Oral", "Intravenosa", "Intramuscular", "Inalatória", "Sublingual", "Tópica"];

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/diario_saude/medicamentos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setListaMedicamentos(data))
      .catch((err) => console.error("Erro ao buscar medicamentos:", err));
  }, [token]);

  const handleAddMedicamento = () => {
    if (!form.nome_medicamento || !form.concentracao || !form.via) {
      alert("Preencha nome, concentração e via do medicamento");
      return;
    }
    setMedList([...medList, form]);
    setForm({ nome_medicamento: "", principio_ativo: "", concentracao: "", via: "" });
    setDialogOpen(false);
  };

  const handleSaveReceita = async () => {
    if (!token) {
      alert("Token não encontrado.");
      return;
    }
    if (!prescricaoExistente?.id_prescricao) {
      alert("⚠ Nenhuma prescrição iniciada! Volte para a tela de Atendimento.");
      return;
    }

    try {
      for (const med of medList) {
        await fetch("http://localhost:8080/api/diario_saude/prescricao_medicamento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_prescricao: prescricaoExistente.id_prescricao,
            id_medicamento: med.id_medicamento || null,
            nome_medicamento: med.nome_medicamento,
            concentracao: med.concentracao,
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
              <ListItemText
                primary={`${m.nome_medicamento} (${m.principio_ativo}) - ${m.concentracao} - ${m.via}`}
              />
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
                if (newValue)
                  setForm({
                    ...form,
                    id_medicamento: newValue.id_medicamento,
                    nome_medicamento: newValue.nome,
                    principio_ativo: newValue.principio_ativo,
                  });
              }}
              renderInput={(params) => <TextField {...params} label="Nome do Medicamento" fullWidth />}
            />

            <TextField
              label="Princípio Ativo"
              fullWidth
              value={form.principio_ativo || ""}
              onChange={(e) => setForm({ ...form, principio_ativo: e.target.value })}
            />

            <TextField
              label="Concentração"
              fullWidth
              value={form.concentracao || ""}
              onChange={(e) => setForm({ ...form, concentracao: e.target.value })}
            />

            <Autocomplete
              options={listaVias}
              value={form.via || ""}
              onChange={(event, newValue) => setForm({ ...form, via: newValue || "" })}
              renderInput={(params) => <TextField {...params} label="Via de Administração" fullWidth />}
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
