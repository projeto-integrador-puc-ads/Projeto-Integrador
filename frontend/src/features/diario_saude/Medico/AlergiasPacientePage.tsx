import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  IconButton,
} from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface Alergia {
  id: number;
  tipo: string;
  descricao: string;
  reacao: string;
}

export default function AlergiasPacientePage() {
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [reacao, setReacao] = useState('');
  const [alergias, setAlergias] = useState<Alergia[]>([]);

  function handleAdicionarAlergia(e: React.FormEvent) {
    e.preventDefault();

    if (!tipo.trim() && !descricao.trim()) return;

    const novaAlergia: Alergia = {
      id: Date.now(),
      tipo: tipo.trim(),
      descricao: descricao.trim(),
      reacao: reacao.trim(),
    };

    setAlergias((prev) => [...prev, novaAlergia]);
    setTipo('');
    setDescricao('');
    setReacao('');
  }

  function handleRemoverAlergia(id: number) {
    setAlergias((prev) => prev.filter((a) => a.id !== id));
  }

  function handleSalvar() {
    // aqui depois você integra com o backend (POST/PUT)
    console.log('Alergias salvas:', alergias);
    alert('Alergias salvas (apenas front-end por enquanto).');
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', py: 4 }}>
      {/* Cabeçalho */}
      <Stack direction="row" spacing={2} alignItems="center" mb={4}>
        <CoronavirusIcon color="warning" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Alergias do Paciente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registre aqui as alergias conhecidas do paciente, bem como o tipo e
            as reações observadas.
          </Typography>
        </Box>
      </Stack>

      {/* Card: Nova alergia */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Nova alergia
        </Typography>

        <Box component="form" onSubmit={handleAdicionarAlergia}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tipo da alergia"
                placeholder="Ex.: Medicamentosa, Alimentar..."
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Reação"
                placeholder="Ex.: urticária, falta de ar, edema..."
                value={reacao}
                onChange={(e) => setReacao(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Detalhes / Observações"
                placeholder="Informe detalhes importantes, medicamentos contraindicados etc."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                size="small"
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained">
              Adicionar alergia
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Card: Alergias cadastradas */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Alergias cadastradas
          </Typography>
          <Button variant="contained" color="success" onClick={handleSalvar}>
            Salvar alterações
          </Button>
        </Box>

        {alergias.length === 0 ? (
          <Typography variant="body2" color="text.secondary" mt={2}>
            Nenhuma alergia cadastrada ainda. Utilize o formulário acima para adicionar.
          </Typography>
        ) : (
          <Stack spacing={2} mt={2}>
            {alergias.map((alergia) => (
              <Box
                key={alergia.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    {alergia.tipo || 'Alergia sem tipo'}
                  </Typography>
                  {alergia.reacao && (
                    <Typography variant="body2" color="text.secondary">
                      Reação: {alergia.reacao}
                    </Typography>
                  )}
                  {alergia.descricao && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {alergia.descricao}
                    </Typography>
                  )}
                </Box>

                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemoverAlergia(alergia.id)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
