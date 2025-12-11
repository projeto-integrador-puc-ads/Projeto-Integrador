import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Stack
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import { type UsuarioConquistaDTO } from '../api/conquistasUsuario';

interface ConquistaCardProps {
    item: UsuarioConquistaDTO; // Recebe o objeto wrapper
}

export default function ConquistaCard({ item }: ConquistaCardProps) {

    // A data está no nível raiz
    const desbloqueada = !!item.dataObtencao;

    // Os detalhes estão dentro do objeto 'conquista'
    const detalhes = item.conquista;

    const dataFormatada = desbloqueada
        ? new Date(item.dataObtencao!).toLocaleDateString('pt-BR')
        : null;

    // Tratamento da imagem Base64
    let srcImagem = '';
    if (detalhes.icone) {
        srcImagem = detalhes.icone.startsWith('data:image')
            ? detalhes.icone
            : `data:image/png;base64,${detalhes.icone}`;
    }

    return (
        <Card
            elevation={desbloqueada ? 4 : 1}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                position: 'relative',
                transition: 'transform 0.2s',
                filter: desbloqueada ? 'none' : 'grayscale(100%)',
                opacity: desbloqueada ? 1 : 0.7,
                border: desbloqueada ? '2px solid #ffd700' : '1px dashed #ccc',
                bgcolor: desbloqueada ? '#fff' : '#f5f5f5',
                '&:hover': {
                    transform: desbloqueada ? 'scale(1.03)' : 'none'
                }
            }}
        >
            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>

                {/* ÍCONE */}
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#fafafa',
                        mb: 1,
                        border: '1px solid #eee'
                    }}
                >
                    {detalhes.icone ? (
                        <img
                            src={srcImagem}
                            alt={detalhes.nome}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <EmojiEventsIcon sx={{ fontSize: 50, color: '#bdbdbd' }} />
                    )}
                </Box>

                {/* TÍTULO (Vem do objeto aninhado) */}
                <Typography variant="h6" fontWeight="bold" color={desbloqueada ? "text.primary" : "text.disabled"}>
                    {detalhes.nome}
                </Typography>

                {/* PONTOS (Vem do objeto aninhado) */}
                <Chip
                    label={`${detalhes.pontos} Pontos`}
                    size="small"
                    color={desbloqueada ? "warning" : "default"}
                    variant={desbloqueada ? "filled" : "outlined"}
                    sx={{ fontWeight: 'bold' }}
                />

                {/* DESCRIÇÃO */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 40 }}>
                    {detalhes.descricao}
                </Typography>

                {/* STATUS */}
                <Box sx={{ mt: 2 }}>
                    {desbloqueada ? (
                        <Typography variant="caption" color="success.main" fontWeight="bold">
                            Conquistado em: {dataFormatada}
                        </Typography>
                    ) : (
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} color="text.disabled">
                            <LockIcon fontSize="small" />
                            <Typography variant="caption">Bloqueado</Typography>
                        </Stack>
                    )}
                </Box>

            </CardContent>
        </Card>
    );
}