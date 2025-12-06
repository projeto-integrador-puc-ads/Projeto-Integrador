import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack';
import http from '@/lib/http';
import { adminUsersApi, type CreateUserPayload } from '../api/users';

type RoleOption = { id: number; name: string; code?: string };

function roleLabel(role: RoleOption) {
  const code = (role.code || role.name || '').toUpperCase();
  if (code.includes('ROLE_USER') || code === 'USER') return 'Idoso';
  if (code.includes('ROLE_ADMIN') || code === 'ADMIN') return 'Administrador';
  return role.name || '';
}

export default function AdminUsuarioCreatePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [form, setForm] = useState<CreateUserPayload>({
    name: '',
    username: '',
    email: '',
    password: '',
    roleId: undefined,
    crm: '',
    certificacao: '',
    experiencia: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const { data } = await http.get<RoleOption[]>('/api/roles');
      setRoles(data);
    } catch {
      enqueueSnackbar('Nao foi possivel carregar perfis. Tente novamente.', { variant: 'warning' });
    }
  }

  function handleChange<K extends keyof CreateUserPayload>(key: K, value: CreateUserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const selectedRole = roles.find((role) => role.id === form.roleId);
  const roleCode = (selectedRole?.code || selectedRole?.name || '').toUpperCase();
  const isMedico = roleCode.includes('ROLE_MEDICO') || roleCode === 'MEDICO';
  const isCuidador = roleCode.includes('ROLE_CUIDADOR') || roleCode === 'CUIDADOR';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.roleId) {
        enqueueSnackbar('Selecione um perfil (role) para o usuario.', { variant: 'warning' });
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
      const payload: CreateUserPayload = {
        ...form,
        roleId: form.roleId ? Number(form.roleId) : undefined,
        crm: isMedico ? form.crm : undefined,
        certificacao: isCuidador ? form.certificacao : undefined,
        experiencia: isCuidador ? form.experiencia : undefined,
      };
      await adminUsersApi.criar(payload);
      enqueueSnackbar('Usuario criado com sucesso.', { variant: 'success' });
      navigate('/admin/usuarios');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao criar usuario.';
      enqueueSnackbar(message, { variant: 'error' });
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
        <Typography variant="h3">Novo Usuario</Typography>
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
          />
          <TextField
            label="Username"
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            fullWidth
          />
          {isMedico && (
            <TextField
              label="CRM (medico)"
              value={form.crm}
              onChange={(e) => handleChange('crm', e.target.value)}
              required
              fullWidth
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
              />
              <TextField
                label="Experiencia (cuidador)"
                value={form.experiencia}
                onChange={(e) => handleChange('experiencia', e.target.value)}
                required
                fullWidth
              />
            </>
          )}

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Salvando...' : 'Registrar'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
