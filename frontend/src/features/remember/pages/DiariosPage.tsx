import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useSnackbar } from 'notistack';
import { diariosApi, type Diario } from '../api/diarios';
import DiarioCard from '../components/DiarioCard';
import DiarioModal from '../components/DiarioModal';

interface DiariosPageProps {
    usuarioId: number;
}

export default function DiariosPage({ usuarioId }: DiariosPageProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [diarios, setDiarios] = useState<Diario[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para controlar a EDIÇÃO
    const [modalOpen, setModalOpen] = useState(false);
    const [diarioEditando, setDiarioEditando] = useState<Diario | null>(null);

    useEffect(() => {
        if (usuarioId) {
            carregarDiarios();
        }
    }, [usuarioId]);

    async function carregarDiarios() {
        setLoading(true);
        try {
            const dados = await diariosApi.listarPorUsuario(usuarioId);
            setDiarios(dados);
        } catch (error) {
            enqueueSnackbar('Erro ao carregar diários.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    // --- ABRIR EDIÇÃO ---
    const handleEditDiario = (id: number) => {
        const diarioEncontrado = diarios.find(d => d.identificadorDiario === id);
        if (diarioEncontrado) {
            setDiarioEditando(diarioEncontrado);
            setModalOpen(true);
        }
    };

    // --- EXCLUIR DIÁRIO ---
    const handleDeleteDiario = async (id: number) => {
        try {
            await diariosApi.remover(id);
            enqueueSnackbar('Diário excluído com sucesso!', { variant: 'success' });
            // Remove da lista localmente para não precisar recarregar tudo do servidor
            setDiarios((prev) => prev.filter(d => d.identificadorDiario !== id));
        } catch (error) {
            enqueueSnackbar('Erro ao excluir diário.', { variant: 'error' });
        }
    };

    // --- CALLBACKS DO MODAL ---
    const handleCloseModal = () => {
        setModalOpen(false);
        setDiarioEditando(null);
    };

    const handleSuccess = () => {
        carregarDiarios(); // Recarrega a lista após salvar/editar
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {diarios.length === 0 ? (
                <Box textAlign="center" py={8} sx={{ opacity: 0.7 }}>
                    <MenuBookIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Nenhum diário encontrado.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Clique em "Novo Registro" acima para começar a escrever.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {diarios.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.identificadorDiario}>
                            <DiarioCard
                                diario={item}
                                onClick={handleEditDiario}   // Clicar no card edita
                                onDelete={handleDeleteDiario} // Clicar na lixeira deleta
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Modal de Edição (Invisível até clicar no card) */}
            <DiarioModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                usuarioId={usuarioId}
                diarioParaEditar={diarioEditando}
            />
        </>
    );
}