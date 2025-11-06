import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

//Lista de médicos
const MEDICOS_MOCK = [
  { id: 11, nome: 'Dra. Ana Pereira' },
  { id: 12, nome: 'Dr. Bruno Lima' },
  { id: 13, nome: 'Dr. Carlos Mendes' },
  { id: 14, nome: 'Dra. Fernanda Silva' },
];

// lista de sintomas para o menu
const SINTOMAS_DISPONIVEIS = [
  'Febre',
  'Dor de cabeça',
  'Tosse',
  'Dor de garganta',
  'Cansaço',
  'Dores musculares',
  'Falta de ar',
  'Náusea',
  'Vômito',
  'Tontura',
  'Coriza',
  'Fadiga',
];

export default function AtendimentoMedico() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    paciente: '',
    data: '',
    medico: '',
    sintomas: '',
    diagnostico: '',
    prescricao: '',
  });

  // controle do modal de busca de médicos (o seu de antes)
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ NOVO: controle do menu de SINTOMAS (estilo do print)
  const [sintomaAnchor, setSintomaAnchor] = useState<null | HTMLElement>(null);

  const handleSelectMedico = (nome: string) => {
    setForm({ ...form, medico: nome });
    setOpenDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Dados do atendimento:', form);

    enqueueSnackbar('Atendimento salvo com sucesso!', {
      variant: 'success',
      autoHideDuration: 3000,
    });

    setForm({
      paciente: '',
      data: '',
      medico: '',
      sintomas: '',
      diagnostico: '',
      prescricao: '',
    });
  };

  // médicos filtrados (usado no modal)
  const filteredMedicos = MEDICOS_MOCK.filter((m) =>
    m.nome.toLowerCase().includes(search.toLowerCase())
  );

  // 👇 abre o menu de sintomas (estilo do print)
  const abrirMenuSintomas = (event: React.MouseEvent<HTMLElement>) => {
    setSintomaAnchor(event.currentTarget);
  };

  const fecharMenuSintomas = () => {
    setSintomaAnchor(null);
  };

  const selecionarSintoma = (sintoma: string) => {
    const atuais = form.sintomas ? form.sintomas.split(', ') : [];
    // permite vários sintomas
    if (!atuais.includes(sintoma)) {
      const novo = [...atuais, sintoma].join(', ');
      setForm({ ...form, sintomas: novo });
    }
    fecharMenuSintomas();
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#f9fafc',
        }}
      >
        {/*Botão Voltar */}
        <Box display="flex" alignItems="center" mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/home')}
            sx={{
              textTransform: 'none',
              color: 'primary.main',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Voltar
          </Button>
        </Box>

        <Typography variant="h5" fontWeight="bold" mb={4} color="primary">
          Registro de Atendimento
        </Typography>

        <Typography variant="h6" color="text.secondary" mb={1}>
          Preencha abaixo as informações do seu atendimento médico.
        </Typography>

        <Typography variant="h6" fontWeight="medium" color="text.secondary" mb={1}>
          Os dados ajudam a manter um histórico atualizado e completo das suas consultas.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Paciente */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nome do Paciente"
                name="paciente"
                value={form.paciente}
                onChange={(e) =>
                  setForm({ ...form, paciente: e.target.value })
                }
              />
            </Grid>

            {/* Data */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Data da Consulta"
                name="data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </Grid>

            {/* Sintomas */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sintomas"
                value={form.sintomas}
                placeholder="Selecione sintomas"
                onClick={abrirMenuSintomas}
                InputProps={{
                  readOnly: true,
                  sx: {
                    cursor: 'pointer',
                    minHeight: 60,
                    borderRadius: 9999,
                    pl: 2,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 9999,
                  },
                }}
              />

              <Menu
                anchorEl={sintomaAnchor}
                open={Boolean(sintomaAnchor)}
                onClose={fecharMenuSintomas}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 4,
                    minWidth: 240,
                    maxHeight: 300,
                    overflowY: 'auto',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  },
                }}
              >
                {SINTOMAS_DISPONIVEIS.map((s) => (
                  <MenuItem
                    key={s}
                    onClick={() => selecionarSintoma(s)}
                    sx={{ py: 1, fontWeight: 500 }}
                  >
                    {s}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>

            {/* Botão salvar */}
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Salvar Atendimento
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
