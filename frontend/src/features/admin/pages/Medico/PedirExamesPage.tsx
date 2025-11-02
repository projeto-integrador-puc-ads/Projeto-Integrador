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

export default function PedirExamesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pacienteNome = location.state?.paciente || 'Paciente não selecionado';

  const [exames, setExames] = useState<string[]>([]);
  const [novoExame, setNovoExame] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddExame = () => {
    if (!novoExame.trim()) return;
    setExames(prev => [...prev, novoExame.trim()]);
    setNovoExame('');
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
          Pedir Exames
        </Typography>

        <Typography variant="h6" mb={2}>
          Paciente: {pacienteNome}
        </Typography>

        <List>
          {exames.map((e, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText primary={e} />
            </ListItem>
          ))}
        </List>

        <IconButton onClick={() => setDialogOpen(true)} size="small">
          <AddIcon /> <Typography ml={1}>Adicionar Exame</Typography>
        </IconButton>

        {/* Popup para adicionar exame */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
          <DialogTitle>Adicionar Exame</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome do Exame"
              fullWidth
              value={novoExame}
              onChange={(e) => setNovoExame(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleAddExame}>
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}
