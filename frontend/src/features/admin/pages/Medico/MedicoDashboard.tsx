import React from 'react';
import { Box, Container, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { ModuleGridMedico } from '@/components/ModuleGridMedico';
import { useLocation, useNavigate } from 'react-router-dom';

type Paciente = {
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  alergias: string;
  doencas: string;
};

export default function DashboardMedico() {
  const location = useLocation();
  const navigate = useNavigate();

  const pacienteNome = location.state?.paciente || 'Paciente não selecionado';

  // Paciente simulado
  const paciente = {
    nome: pacienteNome,
    idade: 68,
    peso: 72,
    altura: 1.72,
    alergias: 'Nenhuma',
    doencas: 'Hipertensão',
  };

  // Redireciona se nenhum paciente selecionado
  if (!location.state?.paciente) {
    navigate('/medico');
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          align="center" // centraliza o texto
        >
          Dashboard Médico
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Painel do Paciente */}
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 3, flex: '1 1 300px', minWidth: 250 }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Informações do Paciente
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary={`Nome: ${paciente.nome}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Idade: ${paciente.idade} anos`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Peso: ${paciente.peso} kg`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Altura: ${paciente.altura} m`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Alergias: ${paciente.alergias}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Doenças: ${paciente.doencas}`} />
              </ListItem>
            </List>
          </Paper>

          {/* Painel de Funções / Módulos */}
          <Box sx={{ flex: '2 1 600px' }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Funções
            </Typography>
            <ModuleGridMedico paciente={paciente.nome} />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
