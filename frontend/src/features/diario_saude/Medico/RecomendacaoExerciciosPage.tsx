import { useState } from 'react';
import {
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
  TextField,
  Button,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';

// 🔹 Componentes reutilizáveis
function PageContainer({ children }: { children: React.ReactNode }) {
  return <Container maxWidth="md" sx={{ py: 5 }}>{children}</Container>;
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
      {children}
    </Typography>
  );
}

export default function RecomendacaoExerciciosPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const paciente = location.state?.paciente;
  const pacienteNome = paciente?.nome || 'Paciente não selecionado';

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
    <PageContainer>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', mb: 2 }}
        >
          Voltar
        </Button>

        <PageTitle>Recomendação de Exercícios</PageTitle>

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
          <ArrowForwardIcon /> <Typography ml={1}>Adicionar Exercício</Typography>
        </IconButton>

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
    </PageContainer>
  );
}
