import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button
} from '@mui/material';
import { ModuleGridMedico } from '@/features/diario_saude/components/ModuleGridMedico';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DashboardMedico() {
  const location = useLocation();
  const navigate = useNavigate();

  const paciente = location.state?.paciente;
  const prescricao = location.state?.prescricao;

  if (!paciente || !prescricao) {
    navigate('/medico');
    return null;
  }

  const token = localStorage.getItem("token");

  // Estados para edição
  const [idade, setIdade] = useState(paciente.idade);
  const [peso, setPeso] = useState(paciente.peso);
  const [altura, setAltura] = useState(paciente.altura);

  // Estado para armazenar doenças
  const [doencas, setDoencas] = useState([]);

  // Buscar doenças do paciente via API
  useEffect(() => {
    fetch(`http://localhost:8080/usuario-doenca/usuario/${paciente.id_usuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDoencas(data))
      .catch(err => console.error("Erro ao buscar doenças do paciente:", err));
  }, [paciente.id_usuario, token]);

  // Função para salvar alterações (chamada ao clicar em "Salvar")
  const handleSalvar = () => {
    // Aqui você pode chamar seu endpoint PUT para atualizar o paciente
    alert('Dados do paciente atualizados (simulação).');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          align="center"
        >
          Dashboard Médico
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>

          {/* Painel do Paciente */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, flex: '1 1 300px', minWidth: 250 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Informações do Paciente
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Nome como texto simples em negrito */}
              <Typography variant="body1">
                Paciente: <strong>{paciente.nome}</strong>
              </Typography>

              <TextField
                label="Idade"
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                fullWidth
              />
              <TextField
                label="Peso (kg)"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                fullWidth
              />
              <TextField
                label="Altura (m)"
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleSalvar}
                sx={{ mt: 2 }}
              >
                Salvar
              </Button>
            </Box>

            {/* Lista de doenças */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Doenças
              </Typography>
              <List dense>
                {doencas.length ? (
                  doencas.map((d) => (
                    <ListItem key={d.id}>
                      <ListItemText primary={d.nome} />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Nenhuma doença cadastrada.
                  </Typography>
                )}
              </List>
            </Box>
          </Paper>

          {/* Painel Modular */}
          <Box sx={{ flex: '2 1 600px' }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Funções
            </Typography>

            <ModuleGridMedico paciente={paciente} prescricao={prescricao} />
          </Box>

        </Box>
      </Paper>
    </Container>
  );
}
