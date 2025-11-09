import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, IconButton, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditUsuarioPage() {
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
  const [tipo, setTipo] = useState<'idoso' | 'admin'>('idoso');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    enqueueSnackbar('Usuário salvo (mock)', { variant: 'success' });
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <IconButton onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3">Editar Usuário #{id}</Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2} maxWidth={640}>
          <TextField name="nome" label="Nome" defaultValue="João da Silva" required fullWidth />
          <TextField name="email" label="Email" defaultValue="joao.silva@example.com" required fullWidth />
          <TextField name="telefone" label="Telefone" defaultValue="(11) 99888-7766" fullWidth />
          <TextField name="endereco" label="Endereço" defaultValue="Av. Paulista, 1000" fullWidth />

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

          <TextField
            select
            name="tipo"
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'idoso' | 'admin')}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="idoso">idoso</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </TextField>

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
