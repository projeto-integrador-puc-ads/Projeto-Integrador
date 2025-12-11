import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Lembranca } from '../api/lembrancas';

interface LembrancaCardProps {
    lembranca: Lembranca;
    onClick: (id: number) => void;
    onDelete: (id: number) => void; // Nova prop
}

export default function LembrancaCard({ lembranca, onClick, onDelete }: LembrancaCardProps) {

    const dataFormatada = new Date(lembranca.dataAcontecimento).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    const themeColor = '#ed6c02';

    // Evita abrir o modal de edição ao clicar na lixeira
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(lembranca.identificadorLembranca);
    };

    return (
        <Card
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                },
                borderLeft: `6px solid ${themeColor}`,
                borderRadius: 2
            }}
        >
            <CardActionArea
                onClick={() => onClick(lembranca.identificadorLembranca)}
                sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
            >
                <CardContent sx={{ width: '100%' }}>

                    {/* CABEÇALHO: Data (Esq) e Lixeira (Dir) */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1.5}
                    >
                        {/* Lado Esquerdo: Ícone + Data */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AutoAwesomeIcon sx={{ fontSize: 20, color: themeColor, opacity: 0.8 }} />
                            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                                {dataFormatada}
                            </Typography>
                        </Stack>

                        {/* Lado Direito: Botão Excluir */}
                        <Tooltip title="Excluir esta lembrança">
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                sx={{
                                    color: 'text.disabled',
                                    '&:hover': {
                                        color: 'error.main',
                                        backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                    },
                                    mt: -1,
                                    mr: -1
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    {/* TÍTULO */}
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{
                            lineHeight: 1.3,
                            fontWeight: 600,
                            mb: 1,
                            color: '#333'
                        }}
                    >
                        {lembranca.titulo || 'Memória sem título'}
                    </Typography>

                    {/* LOCAL */}
                    {lembranca.local && (
                        <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
                            <PlaceIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                                {lembranca.local}
                            </Typography>
                        </Stack>
                    )}

                    {/* HISTÓRIA */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            fontStyle: 'italic'
                        }}
                    >
                        "{lembranca.historia}"
                    </Typography>

                </CardContent>
            </CardActionArea>
        </Card>
    );
}