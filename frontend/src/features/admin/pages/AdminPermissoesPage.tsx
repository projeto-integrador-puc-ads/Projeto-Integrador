import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { adminPermissionsApi, type Permission, type PermissionPayload } from '../api/permissions';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [formValues, setFormValues] = useState<{ name: string; moduleId: string }>({
    name: '',
    moduleId: '',
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; moduleId?: string }>({});

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
        : (p.moduleId !== undefined && p.moduleId !== null ? `Modulo ${p.moduleId}` : 'Sem modulo');
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

  function openCreateDialog() {
    setEditing(null);
    setFormValues({ name: '', moduleId: '' });
    setFormErrors({});
    setDialogOpen(true);
  }

  function openEditDialog(row: Permission) {
    setEditing(row);
    setFormValues({
      name: row.name || '',
      moduleId: row.moduleId !== undefined && row.moduleId !== null ? String(row.moduleId) : '',
    });
    setFormErrors({});
    setDialogOpen(true);
  }

  function closeDialog() {
    if (saving) return;
    setDialogOpen(false);
    setEditing(null);
    setFormErrors({});
  }

  function validateForm() {
    const errors: { name?: string; moduleId?: string } = {};
    if (!formValues.name.trim()) {
      errors.name = 'Informe o nome da permissao.';
    }

    if (formValues.moduleId.trim()) {
      const parsed = Number(formValues.moduleId);
      if (Number.isNaN(parsed)) {
        errors.moduleId = 'Use apenas numeros ou deixe em branco.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function buildPayload(): PermissionPayload | null {
    if (!validateForm()) return null;
    const trimmedName = formValues.name.trim();
    const moduleIdValue = formValues.moduleId.trim();
    const moduleId = moduleIdValue === '' ? null : Number(moduleIdValue);

    return { name: trimmedName, moduleId };
  }

  async function handleSavePermission() {
    const payload = buildPayload();
    if (!payload) return;

    setSaving(true);
    try {
      if (editing) {
        const updated = await adminPermissionsApi.atualizar(editing.id, payload);
        setRows((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        enqueueSnackbar('Permissao atualizada com sucesso.', { variant: 'success' });
      } else {
        const created = await adminPermissionsApi.criar(payload);
        setRows((prev) => [created, ...prev]);
        enqueueSnackbar('Permissao criada com sucesso.', { variant: 'success' });
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao salvar permissao.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePermission(row: Permission) {
    const confirmed = window.confirm(`Remover a permissao "${row.name}"?`);
    if (!confirmed) return;

    setDeletingId(row.id);
    try {
      await adminPermissionsApi.remover(row.id);
      setRows((prev) => prev.filter((p) => p.id !== row.id));
      enqueueSnackbar('Permissao removida.', { variant: 'success' });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao remover permissao.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h3" sx={{ flex: 1 }}>Permissoes</Typography>
        <Stack direction="row" spacing={1}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="module-filter-label">Filtrar por modulo</InputLabel>
            <Select
              labelId="module-filter-label"
              label="Filtrar por modulo"
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            disabled={loading}
          >
            Nova permissao
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
              <TableCell align="right">Acoes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5}>Carregando permissoes...</TableCell>
              </TableRow>
            )}
            {!loading && filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>Nenhuma permissao encontrada.</TableCell>
              </TableRow>
            )}
            {!loading && filteredRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name || '-'}</TableCell>
                <TableCell>{row.moduleName || row.moduleId || '-'}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      size="small"
                      aria-label="Editar"
                      onClick={() => openEditDialog(row)}
                      disabled={loading}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remover"
                      onClick={() => handleDeletePermission(row)}
                      disabled={deletingId === row.id || loading}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar permissao' : 'Nova permissao'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSavePermission();
            }}
          >
            <Stack spacing={2} mt={1}>
              <TextField
                label="Nome da permissao"
                value={formValues.name}
                onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                required
                fullWidth
                autoFocus
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
              />
              <TextField
                label="ID do modulo (opcional)"
                value={formValues.moduleId}
                onChange={(e) => setFormValues((prev) => ({ ...prev, moduleId: e.target.value }))}
                fullWidth
                type="text"
                inputMode="numeric"
                error={Boolean(formErrors.moduleId)}
                helperText={formErrors.moduleId || 'Deixe em branco para nenhuma associacao.'}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSavePermission} variant="contained" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
