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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { medicamentoApi } from "../api/medicamentoApi";
import { prescricaoMedicamentoApi } from "../api/prescricaoMedicamentoApi";

type Paciente = {
  id_usuario: number;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
};

type Medicamento = {
  id_medicamento?: number;
  nome: string;
  principio_ativo: string;
  concentracao: string;
  via: string;
  dosagem?: string;
  frequencia?: string;
};

export default function ReceituarioPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paciente = location.state?.paciente as Paciente | undefined;
  const prescricaoExistente = location.state?.prescricao;

  const queryClient = useQueryClient();

  const [medList, setMedList] = useState<Medicamento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Medicamento>({
    nome: "",
    principio_ativo: "",
    concentracao: "",
    via: "",
    dosagem: "",
    frequencia: "",
  });

  const listaVias = ["Oral", "Intravenosa", "Intramuscular", "Inalatória", "Sublingual", "Tópica"];

  useEffect(() => {
    if (!paciente) navigate("/medico");
  }, [paciente, navigate]);

  // Buscar todos os medicamentos do sistema
  const { data: listaMedicamentos = [] } = useQuery({
    queryKey: ["medicamentos"],
    queryFn: () => medicamentoApi.listar(),
  });

  // Mutação para adicionar medicamento à prescrição
  const addMedicamentoMutation = useMutation({
    mutationFn: (med: Medicamento) =>
      prescricaoMedicamentoApi.adicionar(prescricaoExistente.id_prescricao, med),
    onSuccess: () => queryClient.invalidateQueries(["prescricao", prescricaoExistente.id_prescricao]),
  });

  const handleAddMedicamento = () => {
    if (!form.nome || !form.concentracao || !form.via || !form.dosagem || !form.frequencia) {
      return alert("Preencha todos os campos do medicamento!");
    }
    setMedList([...medList, form]);
    setForm({ nome: "", principio_ativo: "", concentracao: "", via: "", dosagem: "", frequencia: "" });
    setDialogOpen(false);
  };

  const handleRemoveMedicamento = (index: number) => {
    setMedList(medList.filter((_, i) => i !== index));
  };

  const handleSaveReceita = async () => {
    if (!prescricaoExistente?.id_prescricao) return alert("Nenhuma prescrição iniciada!");

    try {
      for (const med of medList) {
        await addMedicamentoMutation.mutateAsync(med);
      }
      alert("Receita salva com sucesso!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar a receita.");
    }
  };

  const dataHoje = new Date().toLocaleDateString("pt-BR");

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9fafc" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none", mb: 2 }}
        >
          Voltar
        </Button>

        <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
          RECEITUÁRIO
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Paciente: <strong>{paciente?.nome}</strong>
        </Typography>

        <Typography variant="h6" mb={1}>Medicamentos:</Typography>
        <List dense>
          {medList.map((m, i) => (
            <ListItem key={`${m.nome}-${i}`} disableGutters
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveMedicamento(i)}>
                  <AddIcon sx={{ transform: "rotate(45deg)" }} />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${m.nome} (${m.principio_ativo}) - ${m.concentracao} - ${m.via}`}
                secondary={`Dosagem: ${m.dosagem}, Frequência: ${m.frequencia}`}
              />
            </ListItem>
          ))}
        </List>

        <Button startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} sx={{ mt: 2 }}>
          Adicionar Medicamento
        </Button>

        <Box textAlign="center" mt={6}>
          <Typography variant="h6">Dr. Lucas Gabriel</Typography>
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
                if (newValue) setForm({
                  ...form,
                  nome: newValue.nome,
                  principio_ativo: newValue.principio_ativo,
                  id_medicamento: newValue.id_medicamento,
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
              onChange={(e, v) => setForm({ ...form, via: v || "" })}
              renderInput={(params) => <TextField {...params} label="Via de Administração" fullWidth />}
            />
            <TextField
              label="Dosagem"
              fullWidth
              value={form.dosagem || ""}
              onChange={(e) => setForm({ ...form, dosagem: e.target.value })}
            />
            <TextField
              label="Frequência"
              fullWidth
              value={form.frequencia || ""}
              onChange={(e) => setForm({ ...form, frequencia: e.target.value })}
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
