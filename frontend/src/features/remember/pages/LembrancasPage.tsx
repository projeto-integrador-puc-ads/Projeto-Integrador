import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSnackbar } from 'notistack';
import { lembrancasApi, type Lembranca } from '../api/lembrancas';
import LembrancaCard from '../components/LembrancaCard';
import LembrancaModal from '../components/LembrancaModal';

interface LembrancasPageProps {
    usuarioId: number;
}

export default function LembrancasPage({ usuarioId }: LembrancasPageProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [lembrancas, setLembrancas] = useState<Lembranca[]>([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA EDIÇÃO ---
    const [modalOpen, setModalOpen] = useState(false);
    const [lembrancaEditando, setLembrancaEditando] = useState<Lembranca | null>(null);

    useEffect(() => {
        if (usuarioId) {
            carregarLembrancas();
        }
    }, [usuarioId]);

    async function carregarLembrancas() {
        setLoading(true);
        try {
            const dados = await lembrancasApi.listarPorUsuario(usuarioId);
            setLembrancas(dados);
        } catch (error) {
            enqueueSnackbar('Erro ao carregar suas lembranças.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    // --- ABRIR EDIÇÃO ---
    const handleEditLembranca = (id: number) => {
        const item = lembrancas.find(l => l.identificadorLembranca === id);
        if (item) {
            setLembrancaEditando(item);
            setModalOpen(true);
        }
    };

    // --- EXCLUIR LEMBRANÇA ---
    const handleDeleteLembranca = async (id: number) => {
        try {
            await lembrancasApi.remover(id);
            enqueueSnackbar('Lembrança excluída com sucesso!', { variant: 'success' });
            // Atualiza a lista localmente removendo o item
            setLembrancas((prev) => prev.filter(l => l.identificadorLembranca !== id));
        } catch (error) {
            enqueueSnackbar('Erro ao excluir lembrança.', { variant: 'error' });
        }
    };

    // --- MODAL ---
    const handleCloseModal = () => {
        setModalOpen(false);
        setLembrancaEditando(null);
    };

    const handleSuccess = () => {
        carregarLembrancas();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress sx={{ color: '#ed6c02' }} />
            </Box>
        );
    }

    return (
        <>
            {lembrancas.length === 0 ? (
                <Box textAlign="center" py={8} sx={{ opacity: 0.7 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Nenhuma lembrança registrada ainda.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Clique em "Novo Registro" para eternizar um momento especial.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {lembrancas.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.identificadorLembranca}>
                            <LembrancaCard
                                lembranca={item}
                                onClick={handleEditLembranca}   // Clicar no card edita
                                onDelete={handleDeleteLembranca} // Clicar na lixeira deleta
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* MODAL DE EDIÇÃO */}
            <LembrancaModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                usuarioId={usuarioId}
                lembrancaParaEditar={lembrancaEditando}
            />
        </>
    );
}