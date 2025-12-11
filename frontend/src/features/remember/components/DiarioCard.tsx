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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Diario } from '../api/diarios';

interface DiarioCardProps {
    diario: Diario;
    onClick: (id: number) => void;
    onDelete: (id: number) => void; // Nova prop para deletar
}

export default function DiarioCard({ diario, onClick, onDelete }: DiarioCardProps) {
    const dataFormatada = new Date(diario.dataEscrita).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });

    // Função para evitar que o clique na lixeira abra o card
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(diario.identificadorDiario);
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
                borderLeft: '6px solid #1976d2',
                borderRadius: 2,
                position: 'relative' // Necessário para posicionamento absoluto se preferir, mas usaremos Flex
            }}
        >
            <CardActionArea
                onClick={() => onClick(diario.identificadorDiario)}
                sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
            >
                <CardContent sx={{ width: '100%' }}>

                    {/* CABEÇALHO: Data (Esquerda) e Lixeira (Direita) */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1.5}
                    >
                        {/* Data */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CalendarTodayIcon fontSize="small" color="primary" sx={{ opacity: 0.8 }} />
                            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                                {dataFormatada}
                            </Typography>
                        </Stack>

                        {/* Botão de Excluir */}
                        <Tooltip title="Excluir este diário">
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                sx={{
                                    color: 'text.disabled',
                                    '&:hover': {
                                        color: 'error.main',
                                        backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                    },
                                    mt: -1, // Pequeno ajuste visual para alinhar topo
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
                            mb: 1
                        }}
                    >
                        {diario.titulo || 'Sem título'}
                    </Typography>

                    {/* CONTEÚDO (Preview) */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                        }}
                    >
                        {diario.conteudo}
                    </Typography>

                </CardContent>
            </CardActionArea>
        </Card>
    );
}