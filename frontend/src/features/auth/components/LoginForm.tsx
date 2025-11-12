import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { setAuthToken } from '@/lib/http';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Mock de autenticação: em produção, chame a API.
      await new Promise((r) => setTimeout(r, 500));
      setAuthToken('demo-token');
      enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
      navigate('/home', { replace: true });
    } catch (err) {
      enqueueSnackbar('Falha ao autenticar. Tente novamente.', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Card sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3" component="h1" gutterBottom>
              Entrar
            </Typography>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
            >
              {submitting ? 'Entrando…' : 'Entrar'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

