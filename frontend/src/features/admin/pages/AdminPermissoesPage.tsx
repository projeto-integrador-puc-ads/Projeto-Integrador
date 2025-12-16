import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { adminPermissionsApi, type Permission } from '../api/permissions';

function formatDate(value?: string) {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('pt-BR');
}

export default function AdminPermissoesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('');

  useEffect(() => {
    loadPermissions();
  }, []);

  async function loadPermissions() {
    setLoading(true);
    try {
      const data = await adminPermissionsApi.listar();
      setRows(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao carregar permissoes.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const moduleOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((p) => {
      const value = p.moduleId !== undefined && p.moduleId !== null
        ? String(p.moduleId)
        : (p.moduleName || 'none');
      const label = p.moduleName
        ? p.moduleName
        : (p.moduleId !== undefined && p.moduleId !== null ? `Modulo ${p.moduleId}` : 'Sem módulo');
      if (!map.has(value)) map.set(value, label);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (!selectedModule) return rows;
    if (selectedModule === 'none') {
      return rows.filter((p) => p.moduleId === undefined || p.moduleId === null);
    }
    return rows.filter((p) => String(p.moduleId ?? p.moduleName) === selectedModule);
  }, [rows, selectedModule]);

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h3" sx={{ flex: 1 }}>Permissões</Typography>
        <Stack direction="row" spacing={1}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="module-filter-label">Filtrar por módulo</InputLabel>
            <Select
              labelId="module-filter-label"
              label="Filtrar por módulo"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              {moduleOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadPermissions} disabled={loading}>
            Atualizar
          </Button>
        </Stack>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Modulo</TableCell>
              <TableCell>Criado em</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4}>Carregando permissoes...</TableCell>
              </TableRow>
            )}
            {!loading && filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>Nenhuma permissão encontrada.</TableCell>
              </TableRow>
            )}
            {!loading && filteredRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name || '-'}</TableCell>
                <TableCell>{row.moduleName || row.moduleId || '-'}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
