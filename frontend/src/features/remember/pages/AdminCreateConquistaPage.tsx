import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSnackbar } from 'notistack';
// IMPORTANDO O PAYLOAD CORRETO
import { adminConquistasApi, type CreateConquistaPayload } from '../api/conquistas';

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const TIPOS_CONQUISTA = [
    { codigo: 1, descricao: "1 - Diário" },
    { codigo: 2, descricao: "2 - Lembrança" },
    { codigo: 3, descricao: "3 - Dias Consecutivos" },
    { codigo: 4, descricao: "4 - Meses Ativos" },
];

export default function NewConquistaPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    // Estado local do formulário (strings facilitam inputs vazios)
    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        pontos: '',
        meta: '',
        tipo: 1,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 2 * 1024 * 1024) {
                enqueueSnackbar('A imagem deve ter no máximo 2MB.', { variant: 'warning' });
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validações
        if (!form.nome || !form.descricao || !form.pontos || !form.meta) {
            enqueueSnackbar('Preencha todos os campos obrigatórios.', { variant: 'warning' });
            return;
        }
        if (!selectedFile) {
            enqueueSnackbar('O ícone é obrigatório.', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const base64String = await toBase64(selectedFile);

            // Usando a interface importada do conquistas.ts para garantir tipagem
            const payload: CreateConquistaPayload = {
                nome: form.nome,
                descricao: form.descricao,
                meta: Number(form.meta),
                pontos: Number(form.pontos),
                tipo: Number(form.tipo),
                icone: base64String
            };

            await adminConquistasApi.criar(payload);

            enqueueSnackbar('Conquista criada com sucesso!', { variant: 'success' });
            navigate('/admin/conquistas');

        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao criar conquista.';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container sx={{ py: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <IconButton onClick={() => navigate(-1)} aria-label="Voltar">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h3">Nova Conquista</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={0} justifyContent="center">
                    <Grid item xs={12} md={8} lg={8}>

                        <Stack spacing={3} component={Paper} sx={{ p: 4, borderRadius: 2 }}>

                            <Typography variant="h5" color="primary">
                                Dados da Conquista
                            </Typography>

                            {/* UPLOAD IMAGEM */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                   * Clique na caixa para selecionar o ícone *
                                </Typography>

                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-button-file"
                                    type="file"
                                    onChange={handleFileChange}
                                />

                                <label htmlFor="upload-button-file">
                                    <Box
                                        sx={{
                                            width: 300,
                                            height: 300,
                                            bgcolor: '#fafafa',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            border: '2px dashed #ccc',
                                            cursor: 'pointer',
                                            transition: 'border 0.3s',
                                            '&:hover': { borderColor: '#1976d2', bgcolor: '#f0f7ff' }
                                        }}
                                    >
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <Stack alignItems="center" spacing={1} color="text.secondary">
                                                <CloudUploadIcon sx={{ fontSize: 60 }} />
                                                <Typography variant="caption">Selecionar Imagem</Typography>
                                            </Stack>
                                        )}
                                    </Box>
                                </label>
                            </Box>

                            {/* CAMPOS */}
                            <TextField
                                name="nome"
                                label="Nome da Conquista"
                                value={form.nome}
                                onChange={handleChange}
                                required
                                fullWidth
                                disabled={loading}
                            />

                            <TextField
                                name="descricao"
                                label="Descrição"
                                value={form.descricao}
                                onChange={handleChange}
                                required
                                fullWidth
                                multiline
                                rows={3}
                                disabled={loading}
                            />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <TextField
                                    name="pontos"
                                    label="Pontuação"
                                    type="number"
                                    value={form.pontos}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    disabled={loading}
                                />

                                <TextField
                                    name="meta"
                                    label="Meta"
                                    type="number"
                                    value={form.meta}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    disabled={loading}
                                />

                                <TextField
                                    select
                                    name="tipo"
                                    label="Tipo (Gatilho)"
                                    value={form.tipo}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    disabled={loading}
                                >
                                    {TIPOS_CONQUISTA.map((option) => (
                                        <MenuItem key={option.codigo} value={option.codigo}>
                                            {option.descricao}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ pt: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? 'Salvando...' : 'Criar Conquista'}
                                </Button>
                            </Stack>

                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}