import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link as MLink,
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { adminUsersApi, type AdminUser } from '../api/users';

function roleLabel(role?: AdminUser['role']) {
  if (!role) return '-';
  const code = (role.code || role.name || '').toUpperCase();
  if (code.includes('ROLE_USER') || code === 'USER') return 'Idoso';
  if (code.includes('ROLE_ADMIN') || code === 'ADMIN') return 'Administrador';
  return role.name || '-';
}

export default function AdminUsuariosPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await adminUsersApi.listar();
      setRows(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao carregar usuarios.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function handleMenu(e: React.MouseEvent<HTMLButtonElement>, row: AdminUser) {
    setSelected(row);
    setAnchorEl(e.currentTarget);
  }
  function closeMenu() { setAnchorEl(null); }

  function goEdit(row: AdminUser) { navigate(`/admin/usuarios/${row.id}/edit`); }

  async function handleDelete() {
    if (!selected) return closeMenu();
    try {
      await adminUsersApi.remover(selected.id);
      setRows((prev) => prev.filter((r) => r.id !== selected.id));
      enqueueSnackbar('Usuario removido.', { variant: 'success' });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao remover usuario.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      closeMenu();
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h3" sx={{ flex: 1 }}>Usuarios</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => navigate('/admin/usuarios/novo')}>
            Registrar
          </Button>
        </Stack>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Perfil</TableCell>
              <TableCell align="right">Acoes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>Carregando usuarios...</TableCell>
              </TableRow>
            )}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>Nenhum usuario encontrado.</TableCell>
              </TableRow>
            )}
            {!loading && rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MLink underline="hover" onClick={() => goEdit(row)} sx={{ cursor: 'pointer' }}>
                      {row.name || '-'}
                    </MLink>
                  </Stack>
                </TableCell>
                <TableCell>{row.username || '-'}</TableCell>
                <TableCell>{row.email || '-'}</TableCell>
                <TableCell>{roleLabel(row.role)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleMenu(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={openMenu} onClose={closeMenu} keepMounted>
        <MenuItem onClick={() => selected && goEdit(selected)}>Editar</MenuItem>
        <MenuItem onClick={handleDelete}>Excluir</MenuItem>
      </Menu>
    </Container>
  );
}
