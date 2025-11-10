import React from 'react';
import { Box, Container, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { ModuleGridMedico } from '@/features/diario_saude/components/ModuleGridMedico';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DashboardMedico() {
  const location = useLocation();
  const navigate = useNavigate();

  const paciente = location.state?.paciente;
  const prescricao = location.state?.prescricao; // ✅ PEGOU A PRESCRIÇÃO

  if (!paciente || !prescricao) { // ✅ Verificação ajustada
    navigate('/medico');
    return null;
  }

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
            <List dense>
              <ListItem><ListItemText primary={`Nome: ${paciente.nome}`} /></ListItem>
              <ListItem><ListItemText primary={`Idade: ${paciente.idade} anos`} /></ListItem>
              <ListItem><ListItemText primary={`Peso: ${paciente.peso} kg`} /></ListItem>
              <ListItem><ListItemText primary={`Altura: ${paciente.altura} m`} /></ListItem>
              <ListItem><ListItemText primary={`Alergias: ${paciente.alergias || "Nenhuma"}`} /></ListItem>
            </List>
          </Paper>

          {/* Painel Modular */}
          <Box sx={{ flex: '2 1 600px' }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Funções
            </Typography>

            {/* ✅ Agora o grid recebe a prescrição corretamente */}
            <ModuleGridMedico paciente={paciente} prescricao={prescricao} />
          </Box>

        </Box>
      </Paper>
    </Container>
  );
}
