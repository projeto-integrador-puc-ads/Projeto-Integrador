import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

type Consulta = {
  medico: string;
  data: string;
};

export default function HistoricoConsultasPage() {
  const location = useLocation();
  const pacienteNome = location.state?.paciente || 'Paciente não selecionado';

  const [consultas] = useState<Consulta[]>([
    { medico: 'Dr. Carlos Mendes', data: '01/10/2025' },
    { medico: 'Dra. Ana Pereira', data: '15/09/2025' },
    { medico: 'Dr. Bruno Lima', data: '30/08/2025' },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);

  const handleClickConsulta = (consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setConsultaSelecionada(null);
  };

  // Dados simulados para o popup
  const medicamentosSimulados = ['Dipirona 500mg', 'Losartana 50mg'];
  const examesSimulados = ['Hemograma completo', 'ECG', 'Raio-X tórax'];
  const exerciciosSimulados = ['Caminhada 30min', 'Alongamento diário'];

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
        Histórico de Consultas
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Paciente: {pacienteNome}
        </Typography>

        <List>
          {consultas.map((c, i) => (
            <ListItemButton key={i} onClick={() => handleClickConsulta(c)}>
              <ListItemText primary={c.medico} secondary={`Data: ${c.data}`} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Popup para detalhes da consulta */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {consultaSelecionada?.medico} - {consultaSelecionada?.data}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" fontWeight="bold">Receituário:</Typography>
          <List dense>
            {medicamentosSimulados.map((m, i) => (
              <ListItemText key={i} primary={m} />
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">Exames:</Typography>
          <List dense>
            {examesSimulados.map((e, i) => (
              <ListItemText key={i} primary={e} />
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">Exercícios:</Typography>
          <List dense>
            {exerciciosSimulados.map((ex, i) => (
              <ListItemText key={i} primary={ex} />
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
