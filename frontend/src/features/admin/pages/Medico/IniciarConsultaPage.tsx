import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';

// Lista mock de pacientes
const PACIENTES = [
  { id: 1, nome: 'João da Silva' },
  { id: 2, nome: 'Maria Souza' },
  { id: 3, nome: 'Carlos Santos' },
];

export default function IniciarConsulta() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState('');

  // Filtra pacientes pelo nome
  const filtered = PACIENTES.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartConsulta = () => {
    if (!selectedPaciente) return;
    // Redireciona para ReceituarioPage passando o paciente
    navigate('/atendimento/dashboard', { state: { paciente: selectedPaciente } });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" mb={3}>Iniciar Consulta</Typography>

        <TextField
          fullWidth
          label="Buscar Paciente"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <List>
          {filtered.map(p => (
            <ListItemButton
              key={p.id}
              selected={selectedPaciente === p.nome}
              onClick={() => setSelectedPaciente(p.nome)}
            >
              <ListItemText primary={p.nome} />
            </ListItemButton>
          ))}
          {filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhum paciente encontrado.
            </Typography>
          )}
        </List>

        <Box mt={3}>
          <Button
            variant="contained"
            size="large"
            disabled={!selectedPaciente}
            onClick={handleStartConsulta}
          >
            Iniciar Consulta
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
