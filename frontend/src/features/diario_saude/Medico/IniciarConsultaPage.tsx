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
    if (!localStorage.getItem('usuarioLogado')) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSimulado));
    }
  }, []);

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || "null");

  const API_URL = "http://localhost:8080/api/diario_saude/usuario";

  // Buscar pacientes da API ao carregar
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

  // Filtrar pacientes
  const filtered = pacientes.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Iniciar consulta: criar prescrição e redirecionar
  const handleStartConsulta = async () => {
    if (!selectedPaciente) return;

    if (!token) {
      alert("Token não encontrado. Faça login primeiro.");
      return;
    }

    try {
      const payload = {
        id_medico: usuario.id_usuario,
        id_usuario: selectedPaciente.id_usuario,
        descricao: "Consulta iniciada", // texto inicial
      };

      const response = await fetch("http://localhost:8080/api/diario_saude/prescricao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
      
      const prescricao = await response.json();

      // Redireciona para o dashboard, passando paciente e prescrição
      navigate('/atendimento/dashboard', { state: { paciente: selectedPaciente, prescricao } });

    } catch (err) {
      console.error("❌ Erro ao iniciar consulta:", err);
      alert("Erro ao iniciar a consulta.");
    }
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
