import { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, List, ListItemButton, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Prescricao = {
  id_prescricao: number;
  data_prescricao: string;
  nomeMedico: string;
  medicamentos: string[];
  exames: string[];
};

export default function HistoricoConsultasPage() {

  const navigate = useNavigate();

  // Recuperando usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");

  // Se não tiver usuário logado → redireciona
  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/login");
    }
  }, [usuarioLogado, navigate]);

  const pacienteNome = usuarioLogado?.nome || "Paciente";
  const pacienteId = usuarioLogado?.id_usuario;

  const [consultas, setConsultas] = useState<Prescricao[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Prescricao | null>(null);

  useEffect(() => {
    if (!pacienteId) return; // Evita buscar antes do login

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/diario_saude/prescricao/usuario/${pacienteId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setConsultas(Array.isArray(data) ? data : []))
      .catch(() => setConsultas([]));

  }, [pacienteId]);

  const handleClickConsulta = (consulta: Prescricao) => {
    setConsultaSelecionada(consulta);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setConsultaSelecionada(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
        Histórico de Consultas
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Paciente: {pacienteNome}
        </Typography>

        {consultas.length === 0 ? (
          <Typography color="text.secondary" align="center" mt={2}>
            Nenhuma consulta encontrada.
          </Typography>
        ) : (
          <List>
            {consultas.map((c) => (
              <ListItemButton key={c.id_prescricao} onClick={() => handleClickConsulta(c)}>
                <ListItemText
                  primary={c.nomeMedico}
                  secondary={`Data: ${c.data_prescricao}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>

      {/* Popup */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {consultaSelecionada?.nomeMedico} - {consultaSelecionada?.data_prescricao}
        </DialogTitle>
        <DialogContent dividers>

          <Typography variant="subtitle1" fontWeight="bold">Medicamentos:</Typography>
          <List dense>
            {consultaSelecionada?.medicamentos.map((m, i) => (
              <ListItemText key={i} primary={m} />
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold">Exames:</Typography>
          <List dense>
            {consultaSelecionada?.exames.map((e, i) => (
              <ListItemText key={i} primary={e} />
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
