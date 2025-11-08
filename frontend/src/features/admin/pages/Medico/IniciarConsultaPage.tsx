import { useState, useEffect } from 'react';
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

export default function IniciarConsulta() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState(null);

  // Simula usuário logado no localStorage
  useEffect(() => {
    const usuarioSimulado = {
      id_usuario: 1,
      nome: "Dr. Lucas Gabriel",
      email: "lucas@email.com",
      role: "MEDICO"
    };
    const tokenSimulado = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtYXJpYUBlbWFpbC5jb20iLCJpYXQiOjE3NjI1MzcxOTMsImV4cCI6MTc2MzE0MTk5M30.yE5nfEbrvnsnfZfte-mi1VRFnEyLdI77SLH4RmIsEo8P2Hd46lWACmCzEsWiUc0g";

    if (!localStorage.getItem('usuarioLogado')) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSimulado));
    }
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', tokenSimulado);
    }
  }, []);

  const token = localStorage.getItem('token');

  const API_URL = "http://localhost:8080/api/diario_saude/usuario";

  //Buscar pacientes da API ao carregar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();
        setPacientes(result);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (token) fetchData();
  }, [token]);

  //Filtrar
  const filtered = pacientes.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartConsulta = () => {
    if (!selectedPaciente) return;
    navigate('/atendimento/dashboard', { state: { paciente: selectedPaciente } });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" mb={3}>Iniciar Consulta</Typography>

        {error && (
          <Typography color="error" mb={2}>
            Erro ao carregar pacientes: {error}
          </Typography>
        )}

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
              key={p.id_usuario}
              selected={selectedPaciente?.id_usuario === p.id_usuario}
              onClick={() => setSelectedPaciente(p)}
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
