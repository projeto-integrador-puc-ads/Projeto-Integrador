import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardContent,
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { usuariosApi } from '@/features/grupo1/api/usuarios';
import type { UsuarioDTO, TipoUsuario } from '@/shared/types/usuario';

type Props = {
  title: string;
  routeBase: 'usuarios' | 'medicos' | 'cuidadores';
  tipo?: TipoUsuario; // Filtro opcional
};

export default function AdminUsersTable({ title, routeBase, tipo }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<UsuarioDTO[]>({
    queryKey: ['admin', 'lista', tipo ?? 'todos'],
    queryFn: () => (tipo ? usuariosApi.porTipo(tipo) : usuariosApi.listar()),
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<UsuarioDTO | null>(null);

  const openMenu = Boolean(anchorEl);
  function handleMenu(e: React.MouseEvent<HTMLButtonElement>, row: UsuarioDTO) {
    setSelected(row);
    setAnchorEl(e.currentTarget);
  }
  function closeMenu() {
    setAnchorEl(null);
  }

  async function handleDelete() {
    if (!selected?.id) return closeMenu();
    const ok = confirm('Deseja realmente excluir este registro?');
    if (!ok) return;
    await usuariosApi.remover(selected.id);
    await qc.invalidateQueries({ queryKey: ['admin'] });
    closeMenu();
  }

  function handleEdit() {
    if (!selected?.id) return closeMenu();
    navigate(`/admin/${routeBase}/${selected.id}/edit`);
    closeMenu();
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        {isLoading && <Typography>Carregando…</Typography>}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Ativo</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row.id ?? `${row.email}-${row.nome}`} hover>
                  <TableCell>
                    <MLink
                      component={RouterLink}
                      to={`/admin/${routeBase}/${row.id}/edit`}
                      underline="hover"
                    >
                      {row.nome}
                    </MLink>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.telefone}</TableCell>
                  <TableCell>{row.tipoUsuario}</TableCell>
                  <TableCell>{row.ativo ? 'Sim' : 'Não'}</TableCell>
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
          <MenuItem onClick={handleEdit}>Editar</MenuItem>
          <MenuItem onClick={handleDelete}>Excluir</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}

