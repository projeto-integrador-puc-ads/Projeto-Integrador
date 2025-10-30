import { useState } from 'react';
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

type Row = { id: number; nome: string; documento: string };
const MOCK_ROWS: Row[] = [
  { id: 11, nome: 'Dra. Ana Pereira', documento: 'CRM 123456-SP' },
  { id: 12, nome: 'Dr. Bruno Lima', documento: 'CRM 654321-RJ' },
];

export default function AdminMedicosPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>(MOCK_ROWS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Row | null>(null);

  const openMenu = Boolean(anchorEl);
  function handleMenu(e: React.MouseEvent<HTMLButtonElement>, row: Row) {
    setSelected(row);
    setAnchorEl(e.currentTarget);
  }
  function closeMenu() { setAnchorEl(null); }

  function goEdit(row: Row) { navigate(`/admin/medicos/${row.id}/edit`); }
  function handleDelete() {
    if (!selected) return closeMenu();
    setRows((prev) => prev.filter((r) => r.id !== selected.id));
    enqueueSnackbar('Registro removido (mock)', { variant: 'success' });
    closeMenu();
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h3" sx={{ flex: 1 }}>Admin · Médicos</Typography>
        <Button variant="contained" onClick={() => enqueueSnackbar('Registrar (mock)', { variant: 'info' })}>
          Registrar
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MLink underline="hover" onClick={() => goEdit(row)} sx={{ cursor: 'pointer' }}>
                      {row.nome}
                    </MLink>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MLink underline="hover" onClick={() => goEdit(row)} sx={{ cursor: 'pointer' }}>
                      {row.documento}
                    </MLink>
                  </Stack>
                </TableCell>
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
