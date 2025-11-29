import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { setAuthToken } from '@/lib/http';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function LoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await authApi.login({ usernameOrEmail, password });
      
      // Salvar token no interceptor HTTP
      setAuthToken(response.accessToken);
      
      // Opcional: Salvar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify({
        userId: response.userId,
        username: response.username,
        email: response.email,
        name: response.name,
        roleName: response.roleName,
        roleCode: response.roleCode,
        permissions: response.permissions,
      }));
      
      enqueueSnackbar(`Bem-vindo(a), ${response.name}!`, { variant: 'success' });
      navigate('/home', { replace: true });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
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
              label="E-mail ou Usuário"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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

