import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Confetti from 'react-confetti';
import type { ConquistaDetalhes } from '../api/conquistasUsuario';

interface Props {
    open: boolean;
    onClose: () => void;
    conquista: ConquistaDetalhes | null;
}

export default function ConquistaDesbloqueadaModal({ open, onClose, conquista }: Props) {
    if (!conquista) return null;

    // Tratamento da imagem Base64
    const srcImagem = conquista.icone?.startsWith('data:image')
        ? conquista.icone
        : `data:image/png;base64,${conquista.icone}`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    textAlign: 'center',
                    p: 2,
                    overflow: 'visible',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    m: 2
                }
            }}
            scroll="body"
        >
            {open && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} style={{
                position: 'fixed', top: 0, left: 0, zIndex: 1500, pointerEvents: 'none'}} />}

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 6, pb: 4 }}>

                {/* Container da Medalha (Moldura Dourada) */}
                <Box sx={{
                    mt: -6,
                    mb: 3,
                    bgcolor: '#fff',
                    borderRadius: '50%', // O container é redondo
                    p: 1, // REDUZI O PADDING (de 2 para 1) para a imagem ficar maior
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)',
                    border: '4px solid #FFD700',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {conquista.icone ? (
                        // AQUI ESTÁ A CORREÇÃO NA IMAGEM:
                        <img
                            src={srcImagem}
                            alt="Conquista"
                            style={{
                                width: '100%', // Ocupa todo o espaço interno do container
                                height: '100%', // Ocupa todo o espaço interno do container
                                objectFit: 'cover', // Garante que a imagem preencha o círculo sem distorcer
                                borderRadius: '50%' // O PULO DO GATO: Arredonda a própria imagem
                            }}
                        />
                    ) : (
                        <EmojiEventsIcon sx={{ fontSize: 80, color: '#FFD700' }} />
                    )}
                </Box>

                <Typography variant="h4" fontWeight="bold" color="#ff9800" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Parabéns!
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    Você desbloqueou uma nova conquista:
                </Typography>

                <Box sx={{ my: 3, p: 2, bgcolor: '#fff8e1', borderRadius: 2, width: '100%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#333' }}>
                        {conquista.nome}
                    </Typography>
                    <Typography variant="subtitle1" color="warning.main" fontWeight="bold">
                        +{conquista.pontos} Pontos
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: '#666' }}>
                        "{conquista.descricao}"
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    onClick={onClose}
                    fullWidth
                    sx={{
                        borderRadius: 3,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        py: 1.5,
                        boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)'
                    }}
                >
                    Continuar
                </Button>
            </DialogContent>
        </Dialog>
    );
}