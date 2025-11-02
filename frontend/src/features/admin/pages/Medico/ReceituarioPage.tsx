import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

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
  const pacienteSelecionado = location.state?.paciente || 'João da Silva';
  const [paciente] = useState(pacienteSelecionado);
  const [medico] = useState("Dr. Fulano de Tal");
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

  function handleAddMedicamento() {
    setMedList((prev) => [...prev, form]);
    setForm({ nome: "", principio: "", concentracao: "", via: "", tipo: "" });
    setDialogOpen(false);
  }

  const dataHoje = new Date().toLocaleDateString("pt-BR");

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#f9fafc",
        }}
      >
        {/* Botão Voltar */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none", mb: 2 }}
        >
          Voltar
        </Button>

        {/* Título */}
        <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
          RECEITUÁRIO
        </Typography>

        {/* Paciente */}
        <Typography variant="h6" sx={{ textAlign: "left", mb: 3 }}>
          Paciente: {paciente}
        </Typography>

        {/* Lista Medicamentos */}
        <Typography variant="h6" mb={1}>
          Medicamentos:
        </Typography>

        <List dense>
          {medList.map((m, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText
                primary={`${m.nome} (${m.principio}) - ${m.concentracao} - ${m.via} - ${m.tipo}`}
              />
            </ListItem>
          ))}
        </List>

        <IconButton size="small" onClick={() => setDialogOpen(true)}>
          <AddIcon /> <Typography ml={1}>Adicionar Medicamento</Typography>
        </IconButton>

        {/* Campo Orientações */}
        <TextField
          label="Orientações"
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 3 }}
          value={orientacoes}
          onChange={(e) => setOrientacoes(e.target.value)}
        />

        {/* Campo Sinais de Alarme */}
        <TextField
          label="Sinais de Alarme"
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 3 }}
          value={sinaisAlarme}
          onChange={(e) => setSinaisAlarme(e.target.value)}
        />

        {/* Assinatura */}
        <Box textAlign="center" mt={6}>
          <Typography variant="h6">{medico}</Typography>
          <Typography variant="body2">{dataHoje}</Typography>
        </Box>
      </Paper>

      {/* Popup Adicionar Medicamento */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>Adicionar Medicamento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Nome do Medicamento" fullWidth value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <TextField label="Princípio Ativo" fullWidth value={form.principio}
              onChange={(e) => setForm({ ...form, principio: e.target.value })} />
            <TextField label="Concentração" fullWidth value={form.concentracao}
              onChange={(e) => setForm({ ...form, concentracao: e.target.value })} />
            <TextField label="Via de Administração" fullWidth value={form.via}
              onChange={(e) => setForm({ ...form, via: e.target.value })} />
            <TextField label="Tipo de Receita" fullWidth value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
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
