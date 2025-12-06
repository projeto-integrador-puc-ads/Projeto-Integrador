import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { setAuthToken } from '@/lib/http';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function LoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      localStorage.setItem('token', response.accessToken);

      // Salvar dados do usuario no localStorage
      localStorage.setItem('user', JSON.stringify({
        userId: response.userId,
        username: response.username,
        email: response.email,
        name: response.name,
        roleName: response.roleName,
        roleCode: response.roleCode,
        permissions: response.permissions,
        accessToken: response.accessToken,
      }));

      enqueueSnackbar(`Bem-vindo(a), ${response.name}!`, { variant: 'success' });
      navigate('/home', { replace: true });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Credenciais invalidas. Tente novamente.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Card
        sx={{
          width: '100%',
          mx: 'auto',
          boxShadow: '0 16px 40px rgba(17,34,51,0.08)',
          borderRadius: 4,
          overflow: 'hidden',
          backdropFilter: 'blur(6px)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" color="primary" letterSpacing={1}>
                Acesso restrito
              </Typography>
              <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 0.5 }}>
                Entrar na plataforma
              </Typography>
            </Box>
            <Divider />
            <TextField
              label="E-mail ou Usuario"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              sx={{ mt: 1.5 }}
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

