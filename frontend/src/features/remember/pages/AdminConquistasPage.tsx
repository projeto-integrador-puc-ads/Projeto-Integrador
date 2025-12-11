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
    Stack,
    Avatar,
    Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Importando a API que criamos acima
import { adminConquistasApi, type Conquista } from '../api/conquistas';

export default function AdminConquistasPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    // Estados
    const [rows, setRows] = useState<Conquista[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<Conquista | null>(null);

    const openMenu = Boolean(anchorEl);

    // Carrega dados ao montar o componente
    useEffect(() => {
        loadConquistas();
    }, []);

    async function loadConquistas() {
        setLoading(true);
        try {
            const data = await adminConquistasApi.listar();
            setRows(data);
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Erro ao carregar conquistas.';
            enqueueSnackbar(message, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    // Controle do Menu de Ações
    function handleMenu(e: React.MouseEvent<HTMLButtonElement>, row: Conquista) {
        setSelected(row);
        setAnchorEl(e.currentTarget);
    }

    function closeMenu() {
        setAnchorEl(null);
        // Não limpa o selected imediatamente para evitar erros visuais durante o fade out do menu
        setTimeout(() => setSelected(null), 200);
    }

    // Navegação
    function goNew() {
        navigate('/admin/conquistas/novo');
    }

    function goEdit(row: Conquista) {
        navigate(`/admin/conquistas/${row.identificadorConquista}/edit`);
    }

    // Ação de Deletar
    async function handleDelete() {
        if (!selected) return closeMenu();

        // Opcional: Adicionar um window.confirm aqui se quiser confirmação extra
        // if (!window.confirm('Tem certeza que deseja excluir esta conquista?')) return closeMenu();

        try {
            await adminConquistasApi.remover(selected.identificadorConquista);

            // Atualiza a lista localmente removendo o item
            setRows((prev) => prev.filter((r) => r.identificadorConquista !== selected.identificadorConquista));

            enqueueSnackbar('Conquista removida com sucesso.', { variant: 'success' });
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Erro ao remover conquista.';
            enqueueSnackbar(message, { variant: 'error' });
        } finally {
            closeMenu();
        }
    }

    return (
        <Container sx={{ py: 3 }}>
            {/* Cabeçalho da Página */}
            <Box display="flex" alignItems="center" mb={3}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                    <EmojiEventsIcon color="primary" fontSize="large" />
                    <Typography variant="h3">Conquistas</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={goNew}>
                        Nova Conquista
                    </Button>
                </Stack>
            </Box>

            {/* Tabela de Dados */}
            <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell width={80}>ID</TableCell>
                            <TableCell width={80}>Ícone</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell width={100} align="right">Pontos</TableCell>
                            <TableCell width={80} align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    Carregando conquistas...
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    Nenhuma conquista encontrada.
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && rows.map((row) => (
                            <TableRow key={row.identificadorConquista} hover>
                                <TableCell>{row.identificadorConquista}</TableCell>
                                <TableCell>
                                    {/* Renderiza o ícone (seja URL ou Base64) */}
                                    <Avatar
                                        src={row.icone}
                                        alt={row.nome}
                                        variant="rounded"
                                        sx={{ width: 32, height: 32, bgcolor: '#eee' }}
                                    >
                                        <EmojiEventsIcon fontSize="small" />
                                    </Avatar>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{row.nome}</TableCell>
                                <TableCell
                                    sx={{
                                        maxWidth: 500,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {row.descricao}
                                </TableCell>
                                <TableCell align="right">
                                    <Box
                                        component="span"
                                        sx={{
                                            bgcolor: '#e8f5e9',
                                            color: '#2e7d32',
                                            py: 0.5,
                                            px: 1,
                                            borderRadius: 1,
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {row.pontos}
                                    </Box>
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

            {/* Menu de Ações (Editar/Excluir) */}
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={closeMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => { if(selected) { goEdit(selected); closeMenu(); } }}>
                    <EditIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    Editar
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Excluir
                </MenuItem>
            </Menu>
        </Container>
    );
}