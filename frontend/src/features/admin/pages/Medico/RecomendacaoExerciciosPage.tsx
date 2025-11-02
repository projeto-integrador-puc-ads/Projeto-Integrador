import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RecomendacaoExerciciosPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pacienteNome = location.state?.paciente || 'Paciente não selecionado';

  const [exercicios, setExercicios] = useState<string[]>([]);
  const [novoExercicio, setNovoExercicio] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddExercicio = () => {
    if (!novoExercicio.trim()) return;
    setExercicios(prev => [...prev, novoExercicio.trim()]);
    setNovoExercicio('');
    setDialogOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', mb: 2 }}
        >
          Voltar
        </Button>

        <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
          Recomendação de Exercícios
        </Typography>

        <Typography variant="h6" mb={2}>
          Paciente: {pacienteNome}
        </Typography>

        <List>
          {exercicios.map((e, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText primary={e} />
            </ListItem>
          ))}
        </List>

        <IconButton onClick={() => setDialogOpen(true)} size="small">
          <AddIcon /> <Typography ml={1}>Adicionar Exercício</Typography>
        </IconButton>

        {/* Popup para adicionar exercício */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
          <DialogTitle>Adicionar Exercício</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome do Exercício"
              fullWidth
              value={novoExercicio}
              onChange={(e) => setNovoExercicio(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleAddExercicio}>
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}
