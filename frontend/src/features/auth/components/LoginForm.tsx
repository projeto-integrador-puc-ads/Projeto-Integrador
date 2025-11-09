import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography, Alert } from '@mui/material';
import { login, TEST_USERS } from '@/lib/auth';
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
      // ✅ Login real via API
      await login({
        usernameOrEmail: email,
        password: password
      });
      
      // 🔧 WORKAROUND: Como backend ainda não retorna userId/role,
      // vamos identificar pelo email e salvar manualmente
      let userId: number | null = null;
      let userRole: string | null = null;
      
      if (email === TEST_USERS.admin.email) {
        userId = 1;
        userRole = 'ADMIN';
      } else if (email === TEST_USERS.cliente.email) {
        userId = TEST_USERS.cliente.id;
        userRole = TEST_USERS.cliente.role;
      } else if (email === TEST_USERS.cuidador.email) {
        userId = TEST_USERS.cuidador.id;
        userRole = TEST_USERS.cuidador.role;
      }
      
      // Salvar userId e role manualmente (temporário até backend ser atualizado)
      if (userId && userRole) {
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('username', email);
        console.log(`🔧 WORKAROUND: Manually set userId=${userId}, role=${userRole}`);
      }
      
      enqueueSnackbar(
        `✅ Bem-vindo! Logado como: ${userRole || 'usuário'}`, 
        { variant: 'success' }
      );
      
      // Redirecionar baseado no role
      if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/carehub', { replace: true });
      }
    } catch (err: any) {
      enqueueSnackbar(
        err.message || 'Falha ao autenticar. Verifique suas credenciais.', 
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  }
  
  // Quick login buttons for testing
  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Card sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h3" component="h1" gutterBottom>
              🏥 CareHub Login
            </Typography>
            
            <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
              <strong>Usuários de Teste:</strong><br/>
              👤 Cliente: maria@example.com / 123456<br/>
              👨‍⚕️ Cuidador: joao@example.com / 123456<br/>
              🔧 Admin: admin@carehub.test / admin123
            </Alert>
            
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
              fullWidth
            >
              {submitting ? 'Entrando…' : 'Entrar'}
            </Button>
            
            {/* Quick Login Buttons (DEV ONLY) */}
            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => quickLogin(TEST_USERS.cliente.email, TEST_USERS.cliente.password)}
                disabled={submitting}
                fullWidth
              >
                👤 Cliente
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => quickLogin(TEST_USERS.cuidador.email, TEST_USERS.cuidador.password)}
                disabled={submitting}
                fullWidth
              >
                👨‍⚕️ Cuidador
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => quickLogin(TEST_USERS.admin.email, TEST_USERS.admin.password)}
                disabled={submitting}
                fullWidth
              >
                🔧 Admin
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

