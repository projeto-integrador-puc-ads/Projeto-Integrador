import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    IconButton,
    Grid,
    Stack,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useSnackbar } from 'notistack';
import { adminConquistasApi, type UpdateConquistaPayload } from '../api/conquistas';

interface ConquistaFormData {
    nome: string;
    descricao: string;
    pontos: number;
    meta: number;
    tipo: string | number;
    iconeBase64: string;
}

export default function AdminEditConquistaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const conquistaId = useMemo(() => Number(id), [id]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<ConquistaFormData>({
        nome: '',
        descricao: '',
        pontos: 0,
        meta: 0,
        tipo: '',
        iconeBase64: '',
    });

    useEffect(() => {
        if (conquistaId) {
            loadConquista();
        }
    }, [conquistaId]);

    async function loadConquista() {
        setLoading(true);
        try {
            const data = await adminConquistasApi.porId(conquistaId);

            setForm({
                nome: data.nome || '',
                descricao: data.descricao || '',
                pontos: data.pontos || 0,
                meta: data.meta || 0,
                tipo: data.tipo,
                iconeBase64: data.icone || '',
            });
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao carregar conquista.';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    function handleChange<K extends keyof ConquistaFormData>(key: K, value: ConquistaFormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!form.nome) {
            enqueueSnackbar('O Nome é obrigatório.', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const payload: UpdateConquistaPayload = {
                nome: form.nome,
                descricao: form.descricao,
            };

            await adminConquistasApi.atualizar(conquistaId, payload);

            enqueueSnackbar('Conquista atualizada com sucesso!', { variant: 'success' });
            navigate('/admin/conquistas');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao atualizar conquista.';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    const iconSource = form.iconeBase64 || '';

    return (
        <Container sx={{ py: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <IconButton onClick={() => navigate(-1)} aria-label="Voltar">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h3">Editar Conquista #{conquistaId}</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={0} justifyContent="center">
                    <Grid item xs={12} md={8} lg={8}>

                        <Stack spacing={3} component={Paper} sx={{ p: 4, borderRadius: 2 }}>

                            <Typography variant="h5" color="primary">
                                Dados da Conquista
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                                <Box
                                    sx={{
                                        // MUDANÇA AQUI: Aumentado para 300x300
                                        width: 300, height: 300, bgcolor: '#f5f5f5',
                                        borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden', border: '1px solid #ddd',
                                    }}
                                >
                                    {iconSource ? (
                                        <img
                                            src={iconSource}
                                            alt={form.nome}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        // Aumentei o ícone padrão também para ficar proporcional
                                        <EmojiEventsIcon sx={{ fontSize: 150, color: 'text.disabled' }} />
                                    )}
                                </Box>
                            </Box>

                            <TextField
                                label="Nome"
                                value={form.nome}
                                onChange={(e) => handleChange('nome', e.target.value)}
                                required
                                fullWidth
                                disabled={loading}
                            />

                            <TextField
                                label="Descrição"
                                value={form.descricao}
                                onChange={(e) => handleChange('descricao', e.target.value)}
                                required
                                fullWidth
                                multiline
                                rows={3}
                                disabled={loading}
                            />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <TextField
                                    label="Pontuação"
                                    value={form.pontos}
                                    fullWidth
                                    disabled={true}
                                    variant="filled"
                                />

                                <TextField
                                    label="Meta"
                                    value={form.meta}
                                    fullWidth
                                    disabled={true}
                                    variant="filled"
                                />

                                <TextField
                                    label="Tipo"
                                    value={form.tipo}
                                    fullWidth
                                    disabled={true}
                                    variant="filled"
                                />
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ pt: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}