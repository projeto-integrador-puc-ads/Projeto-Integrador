import {
  AppBar,
  Avatar,
  Box,
  Container,
  Modal,
  Toolbar,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Switch,
  Divider,
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import logo_unati_horizontal from '../assets/logo_unati_horizontal.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import { adminUsersApi, type UpdateUserPayload } from '../features/admin/api/users';

export default function AppLayout() {
  const [openProfile, setOpenProfile] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [userInfo, setUserInfo] = useState<{ id: number | null; name: string; username: string }>({
    id: null,
    name: '',
    username: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [form, setForm] = useState<UpdateUserPayload>({
    name: '',
    username: '',
    email: '',
    crm: '',
    certificacao: '',
    experiencia: '',
  });
  const [changePassword, setChangePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setUserInfo({
        id: parsed?.userId ?? null,
        name: parsed?.name ?? '',
        username: parsed?.username ?? '',
      });
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (openProfile && userInfo.id) {
      loadProfile();
    }
  }, [openProfile, userInfo.id]);

  const userInitial = useMemo(() => {
    const name = userInfo.name?.trim();
    if (name) return name.charAt(0).toUpperCase();
    const username = userInfo.username?.trim();
    if (username) return username.charAt(0).toUpperCase();
    return 'M';
  }, [userInfo.name, userInfo.username]);

  async function loadProfile() {
    if (!userInfo.id) return;
    setLoadingProfile(true);
    try {
      const data = await adminUsersApi.porId(userInfo.id);
      setForm({
        name: data.name || '',
        username: data.username || '',
        email: data.email || '',
        crm: data.crm || '',
        certificacao: data.certificacao || '',
        experiencia: data.experiencia || '',
      });
      setChangePassword(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao carregar perfil.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoadingProfile(false);
    }
  }

  function handleChange<K extends keyof UpdateUserPayload>(key: K, value: UpdateUserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userInfo.id) return;
    if (changePassword) {
      if (!password || !confirmPassword) {
        enqueueSnackbar('Informe a senha e a confirmacao.', { variant: 'warning' });
        return;
      }
      if (password !== confirmPassword) {
        enqueueSnackbar('As senhas nao conferem.', { variant: 'warning' });
        return;
      }
    }
    setLoadingProfile(true);
    try {
      const payload: UpdateUserPayload = { ...form };
      if (changePassword) payload.password = password;
      await adminUsersApi.atualizar(userInfo.id, payload);
      enqueueSnackbar('Perfil atualizado com sucesso.', { variant: 'success' });
      setOpenProfile(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao salvar perfil.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoadingProfile(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: '1px solid #e5eaf2',
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255,255,255,0.85)',
        }}
      >
        <Toolbar>
          <Box component={RouterLink as any} to="/home" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
            <Box component="img" src={logo_unati_horizontal} alt="Logo UNATI" sx={{ height: 48 }} />
          </Box>
          <Box sx={{ flex: 1 }} />

          <Button
            variant="outlined"
            color="primary"
            component={RouterLink as any}
            to="/admin"
            sx={{ mr: 2 }}
          >
            Area do administrador
          </Button>

          <Avatar
            sx={{
              bgcolor: deepPurple[500],
              cursor: 'pointer',
            }}
            onClick={() => setOpenProfile(true)}
          >
            {userInitial}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>

      <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: 24,
            width: { xs: '92vw', sm: 520, md: 640 },
            maxWidth: '92vw',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2}>
            Meu Perfil
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box component="form" onSubmit={handleSave} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                fullWidth
                disabled={loadingProfile}
              />
              <TextField
                label="Username"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                fullWidth
                disabled={loadingProfile}
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                fullWidth
                disabled={loadingProfile}
              />
              <TextField
                label="CRM (medico)"
                value={form.crm}
                onChange={(e) => handleChange('crm', e.target.value)}
                fullWidth
                disabled={loadingProfile}
              />
              <TextField
                label="Certificacao (cuidador)"
                value={form.certificacao}
                onChange={(e) => handleChange('certificacao', e.target.value)}
                fullWidth
                disabled={loadingProfile}
              />
              <TextField
                label="Experiencia (cuidador)"
                value={form.experiencia}
                onChange={(e) => handleChange('experiencia', e.target.value)}
                fullWidth
                disabled={loadingProfile}
              />

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Switch
                  checked={changePassword}
                  onChange={() => {
                    setChangePassword((v) => {
                      const next = !v;
                      if (next) {
                        setPassword('');
                        setConfirmPassword('');
                      }
                      return next;
                    });
                  }}
                  color="success"
                  disabled={loadingProfile}
                />
                <Typography variant="body1">Alterar senha</Typography>
              </Stack>

              {changePassword && (
                <>
                  <TextField
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    disabled={loadingProfile}
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
                  <TextField
                    label="Confirme a senha"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    disabled={loadingProfile}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end">
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => setOpenProfile(false)} fullWidth disabled={loadingProfile}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" fullWidth disabled={loadingProfile}>
                  {loadingProfile ? 'Salvando...' : 'Salvar'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
