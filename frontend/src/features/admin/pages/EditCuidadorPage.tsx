import { Box, Button, Container, IconButton, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditCuidadorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const estados = useMemo(() => ['SP', 'RJ', 'MG', 'BA', 'RS', 'PR'], []);
  const cidadesPorEstado: Record<string, string[]> = {
    SP: ['São Paulo', 'Campinas', 'Santos'],
    RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
    MG: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora'],
    BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
    RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
    PR: ['Curitiba', 'Londrina', 'Maringá'],
  };

  const [estado, setEstado] = useState('SP');
  const [cidade, setCidade] = useState('São Paulo');
  const [certificacao, setCertificacao] = useState('Cuidador Nível 1');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    enqueueSnackbar('Cuidador salvo (mock)', { variant: 'success' });
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <IconButton onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3">Editar Cuidador #{id}</Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2} maxWidth={640}>
          <TextField name="nome" label="Nome" defaultValue="Maria Souza" required fullWidth />
          <TextField name="documento" label="Documento" defaultValue="222.333.444-55" required sx={{ maxWidth: 260 }} />
          <TextField
            select
            name="certificacao"
            label="Certificação"
            value={certificacao}
            onChange={(e) => setCertificacao(e.target.value)}
            sx={{ minWidth: 260 }}
          >
            {['Cuidador Nível 1', 'Cuidador Nível 2', 'Técnico de Enfermagem'].map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <TextField name="endereco" label="Endereço" defaultValue="Rua Principal, 50" fullWidth />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              name="estado"
              label="Estado"
              value={estado}
              onChange={(e) => {
                const uf = e.target.value;
                setEstado(uf);
                setCidade((cidadesPorEstado[uf] ?? [])[0] ?? '');
              }}
              sx={{ minWidth: 160 }}
            >
              {estados.map((uf) => (
                <MenuItem key={uf} value={uf}>{uf}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="cidade"
              label="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              {(cidadesPorEstado[estado] ?? []).map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch name="ativo" defaultChecked />
            <Typography>Ativo</Typography>
          </Stack>

          <Button type="submit" variant="contained">Salvar</Button>
        </Stack>
      </Box>
    </Container>
  );
}
