import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Stack,
    Paper,
    Avatar
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'; // Ícone de Medalha
import { useSnackbar } from 'notistack';
import { conquistasUsuarioApi, type UsuarioConquistaDTO, type RankingItem } from '../api/conquistasUsuario';
import ConquistaCard from '../components/ConquistaCard';

interface ConquistasUsuarioPageProps {
    usuarioId: number;
}

export default function ConquistasUsuarioPage({ usuarioId }: ConquistasUsuarioPageProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [items, setItems] = useState<UsuarioConquistaDTO[]>([]);
    const [ranking, setRanking] = useState<RankingItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Calcula total de pontos do usuário logado
    const totalPontos = items
        .filter(item => item.dataObtencao)
        .reduce((acc, curr) => acc + curr.conquista.pontos, 0);

    const totalConquistas = items.filter(item => item.dataObtencao).length;

    useEffect(() => {
        if (usuarioId) {
            carregarDados();
        }
    }, [usuarioId]);

    async function carregarDados() {
        setLoading(true);
        try {
            // Carrega em paralelo: Conquistas do usuário E o Ranking geral
            const [dadosConquistas, dadosRanking] = await Promise.all([
                conquistasUsuarioApi.listarProgresso(usuarioId),
                conquistasUsuarioApi.buscarRanking()
            ]);

            setItems(dadosConquistas);
            setRanking(dadosRanking);
        } catch (error) {
            enqueueSnackbar('Erro ao carregar dados.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    // Função auxiliar para cor da medalha
    const getMedalColor = (index: number) => {
        switch(index) {
            case 0: return '#FFD700'; // Ouro
            case 1: return '#C0C0C0'; // Prata
            case 2: return '#CD7F32'; // Bronze
            default: return '#e0e0e0';
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" py={10}><CircularProgress color="warning" /></Box>;
    }

    if (items.length === 0 && ranking.length === 0) {
        return (
            <Box textAlign="center" py={8} sx={{ opacity: 0.7 }}>
                <EmojiEventsIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Nenhuma conquista disponível ainda.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 1 }}>

            {/* DASHBOARD PRINCIPAL */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: '#fff8e1',
                    border: '1px solid #ffe082',
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, // Em celular empilha, em PC fica lado a lado
                    alignItems: 'center',
                    justifyContent: 'space-between', // Espalha os itens
                    gap: 3
                }}
            >
                {/* 1. SUAS CONQUISTAS (Esquerda) */}
                <Stack alignItems="center" sx={{ flex: 1 }}>
                    <Typography variant="h6" color="text.secondary">Suas Conquistas</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <EmojiEventsIcon color="warning" fontSize="large" />
                        <Typography variant="h3" fontWeight="bold" color="text.primary">
                            {totalConquistas}
                        </Typography>
                    </Stack>
                </Stack>

                {/* 2. RANKING (Centro - Substituindo a barra) */}
                <Box
                    sx={{
                        flex: 1.5, // Ocupa um pouco mais de espaço
                        borderLeft: { md: '1px solid #ffe082' },
                        borderRight: { md: '1px solid #ffe082' },
                        borderTop: { xs: '1px solid #ffe082', md: 'none' },
                        borderBottom: { xs: '1px solid #ffe082', md: 'none' },
                        px: { md: 4 },
                        py: { xs: 2, md: 0 },
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                        🏆 Top 3 Ranking
                    </Typography>

                    <Stack spacing={1} sx={{ width: '100%', maxWidth: 450 }}>
                        {ranking.map((rank, index) => (
                            <Stack
                                key={index}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.6)',
                                    p: 0.5,
                                    borderRadius: 2,
                                    pl: 1, pr: 2
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {/* Medalha */}
                                    <WorkspacePremiumIcon sx={{ color: getMedalColor(index) }} />
                                    {/* Nome */}
                                    <Typography variant="body2" fontWeight="bold" sx={{
                                        maxWidth: 120,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {rank.nomeUsuario}
                                    </Typography>
                                </Stack>
                                {/* Pontos */}
                                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                    {rank.totalPontos} pts
                                </Typography>
                            </Stack>
                        ))}
                        {ranking.length === 0 && (
                            <Typography variant="caption" color="text.disabled" align="center">
                                Seja o primeiro a pontuar!
                            </Typography>
                        )}
                    </Stack>
                </Box>

                {/* 3. PONTUAÇÃO TOTAL (Direita) */}
                <Stack alignItems="center" sx={{ flex: 1 }}>
                    <Typography variant="h6" color="text.secondary">Pontuação Total</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <StarIcon sx={{ color: '#ff9800', fontSize: 40 }} />
                        <Typography variant="h3" fontWeight="bold" color="text.primary">
                            {totalPontos}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            {/* GRID DE MEDALHAS */}
            <Grid container spacing={3}>
                {items.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={item.conquista.identificadorConquista || index}>
                        <ConquistaCard item={item} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}