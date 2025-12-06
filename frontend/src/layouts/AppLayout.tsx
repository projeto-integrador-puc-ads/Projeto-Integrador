import {
  AppBar,
  Avatar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import logo_unati_horizontal from '../assets/logo_unati_horizontal.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import { adminUsersApi, type UpdateUserPayload } from '../features/admin/api/users';
import { setAuthToken } from '@/lib/http';

export default function AppLayout() {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [userInfo, setUserInfo] = useState<{ id: number | null; name: string; username: string }>({
    id: null,
    name: '',
    username: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  function handleOpenMenu(e: React.MouseEvent<HTMLElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handleCloseMenu() {
    setAnchorEl(null);
  }
  function handleEditProfile() {
    handleCloseMenu();
    setOpenProfile(true);
  }
  function handleLogout() {
    handleCloseMenu();
    setAuthToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
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
            onClick={handleOpenMenu}
          >
            {userInitial}
          </Avatar>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} keepMounted>
            <MenuItem onClick={handleEditProfile}>Editar perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>

      <Dialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Meu Perfil</DialogTitle>
        <Box component="form" onSubmit={handleSave} noValidate>
          <DialogContent dividers>
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
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Stack direction="row" spacing={1} width="100%">
              <Button variant="outlined" onClick={() => setOpenProfile(false)} fullWidth disabled={loadingProfile}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={loadingProfile}>
                {loadingProfile ? 'Salvando...' : 'Salvar'}
              </Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
