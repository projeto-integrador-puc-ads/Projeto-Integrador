import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Switch,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import http from '@/lib/http';
import { adminUsersApi, type AdminUser, type UpdateUserPayload } from '../api/users';

type RoleOption = { id: number; name: string; code?: string };

function roleLabel(role: RoleOption) {
  const code = (role.code || role.name || '').toUpperCase();
  if (code.includes('ROLE_USER') || code === 'USER') return 'Idoso';
  if (code.includes('ROLE_ADMIN') || code === 'ADMIN') return 'Administrador';
  return role.name || '';
}

export default function EditUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const userId = useMemo(() => Number(id), [id]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [form, setForm] = useState<UpdateUserPayload>({
    name: '',
    email: '',
    username: '',
    roleId: undefined,
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
    if (!userId) return;
    loadRoles();
    loadUser();
  }, [userId]);

  async function loadRoles() {
    try {
      const { data } = await http.get<RoleOption[]>('/api/roles');
      setRoles(data);
    } catch {
      enqueueSnackbar('Nao foi possivel carregar perfis.', { variant: 'warning' });
    }
  }

  async function loadUser() {
    setLoading(true);
    try {
      const data = await adminUsersApi.porId(userId);
      setForm({
        name: data.name || '',
        email: data.email || '',
        username: data.username || '',
        roleId: data.role?.id,
        crm: data.crm || '',
        certificacao: data.certificacao || '',
        experiencia: data.experiencia || '',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao carregar usuario.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function handleChange<K extends keyof UpdateUserPayload>(key: K, value: UpdateUserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const selectedRole = roles.find((role) => role.id === form.roleId);
  const roleCode = (selectedRole?.code || selectedRole?.name || '').toUpperCase();
  const isMedico = roleCode.includes('ROLE_MEDICO') || roleCode === 'MEDICO';
  const isCuidador = roleCode.includes('ROLE_CUIDADOR') || roleCode === 'CUIDADOR';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.roleId) {
      enqueueSnackbar('Selecione um perfil (role).', { variant: 'warning' });
      return;
    }
    if (isMedico && !form.crm) {
      enqueueSnackbar('Informe o CRM para medicos.', { variant: 'warning' });
      return;
    }
    if (isCuidador && (!form.certificacao || !form.experiencia)) {
      enqueueSnackbar('Informe certificacao e experiencia para cuidadores.', { variant: 'warning' });
      return;
    }
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
    setLoading(true);
    try {
      const payload: UpdateUserPayload = {
        ...form,
        roleId: form.roleId,
        crm: isMedico ? form.crm : undefined,
        certificacao: isCuidador ? form.certificacao : undefined,
        experiencia: isCuidador ? form.experiencia : undefined,
      };
      if (changePassword) {
        payload.password = password;
      }
      await adminUsersApi.atualizar(userId, payload);
      enqueueSnackbar('Usuario atualizado com sucesso.', { variant: 'success' });
      navigate('/admin/usuarios');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao atualizar usuario.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3">Editar Usuario #{userId}</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2} maxWidth={640}>
          <TextField
            select
            label="Perfil (role)"
            value={form.roleId ?? ''}
            onChange={(e) => {
              const roleId = e.target.value ? Number(e.target.value) : undefined;
              setForm((prev) => ({
                ...prev,
                roleId,
                crm: '',
                certificacao: '',
                experiencia: '',
              }));
            }}
            required
            disabled={loading}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {roleLabel(role)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Nome"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Username"
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            fullWidth
            disabled={loading}
          />

          {isMedico && (
            <TextField
              label="CRM (medico)"
              value={form.crm}
              onChange={(e) => handleChange('crm', e.target.value)}
              required
              fullWidth
              disabled={loading}
            />
          )}
          {isCuidador && (
            <>
              <TextField
                label="Certificacao (cuidador)"
                value={form.certificacao}
                onChange={(e) => handleChange('certificacao', e.target.value)}
                required
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Experiencia (cuidador)"
                value={form.experiencia}
                onChange={(e) => handleChange('experiencia', e.target.value)}
                required
                fullWidth
                disabled={loading}
              />
            </>
          )}

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
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
