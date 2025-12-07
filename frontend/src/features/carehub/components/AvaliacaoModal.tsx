import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  Paper,
  IconButton,
  Fade,
  Zoom,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Star, Close, SentimentVeryDissatisfied, SentimentDissatisfied, SentimentNeutral, SentimentSatisfied, SentimentVerySatisfied } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { criarAvaliacao, type AvaliacaoRequest } from '../api/avaliacoes';

interface AvaliacaoModalProps {
  open: boolean;
  onClose: () => void;
  cuidadorId: number;
  cuidadorNome: string;
  clienteId: number;
  initialAgendamentoId?: number;
}

interface RatingLabel {
  text: string;
  color: string;
  icon: React.ReactElement;
}

const ratingLabels: { [key: number]: RatingLabel } = {
  1: { 
    text: 'Muito Insatisfeito', 
    color: '#f44336',
    icon: <SentimentVeryDissatisfied sx={{ fontSize: 80 }} />
  },
  2: { 
    text: 'Insatisfeito', 
    color: '#ff9800',
    icon: <SentimentDissatisfied sx={{ fontSize: 80 }} />
  },
  3: { 
    text: 'Regular', 
    color: '#ffc107',
    icon: <SentimentNeutral sx={{ fontSize: 80 }} />
  },
  4: { 
    text: 'Satisfeito', 
    color: '#8bc34a',
    icon: <SentimentSatisfied sx={{ fontSize: 80 }} />
  },
  5: { 
    text: 'Muito Satisfeito', 
    color: '#4caf50',
    icon: <SentimentVerySatisfied sx={{ fontSize: 80 }} />
  },
};

export function AvaliacaoModal({ open, onClose, cuidadorId, cuidadorNome, clienteId, initialAgendamentoId }: AvaliacaoModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number>(-1);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Usar diretamente o agendamento passado como parâmetro (estilo Uber - avaliação direta do atendimento)
  const agendamentoId = initialAgendamentoId || null;

  const mutation = useMutation({
    mutationFn: (avaliacao: AvaliacaoRequest) => criarAvaliacao(clienteId, avaliacao),
    onSuccess: () => {
      enqueueSnackbar('✨ Avaliação enviada com sucesso! Obrigado pelo seu feedback.', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['avaliacoes', cuidadorId] });
      queryClient.invalidateQueries({ queryKey: ['cuidadores'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      handleClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Erro ao enviar avaliação';
      
      // Mensagens específicas para erros comuns
      if (message.includes('já avaliou')) {
        enqueueSnackbar('⚠️ Você já avaliou este cuidador anteriormente!', { variant: 'warning' });
      } else if (message.includes('não encontrado')) {
        enqueueSnackbar('❌ Cuidador não encontrado', { variant: 'error' });
      } else {
        enqueueSnackbar(`❌ ${message}`, { variant: 'error' });
      }
    },
  });

  const handleSubmit = () => {
    if (nota < 1 || nota > 5) {
      enqueueSnackbar('Selecione uma nota de 1 a 5 estrelas', { variant: 'warning' });
      return;
    }

    if (!agendamentoId) {
      enqueueSnackbar('Erro: Atendimento não identificado. Por favor, feche e tente novamente.', { variant: 'error' });
      return;
    }

    mutation.mutate({
      cuidadorId,
      nota,
      comentario: comentario.trim(),
      agendamentoId,
    });
  };

  const handleClose = () => {
    setNota(5);
    setComentario('');
    onClose();
  };

  const displayRating = hoveredRating !== -1 ? hoveredRating : nota;
  const ratingInfo = ratingLabels[displayRating];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="avaliacao-title"
      aria-describedby="avaliacao-desc"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header com gradiente */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${ratingInfo.color} 0%, ${ratingInfo.color}dd 100%)`,
          color: 'white',
          p: 3,
          position: 'relative'
        }}
      >
        <IconButton
          onClick={handleClose}
          aria-label="Fechar diálogo"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
          disabled={mutation.isPending}
        >
          <Close />
        </IconButton>
        
        <Typography id="avaliacao-title" variant="h5" fontWeight="bold" mb={1}>
          Avaliar Atendimento
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95 }}>
          {cuidadorNome}
        </Typography>
  <Typography id="avaliacao-desc" variant="caption" sx={{ opacity: 0.85, mt: 0.5, display: 'block' }}>
          💡 Sua avaliação ajuda outros clientes
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Ícone de Sentimento Animado */}
          <Zoom in={true} timeout={300}>
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 2,
                transition: 'all 0.3s ease-in-out',
                color: ratingInfo.color
              }}
            >
              {ratingInfo.icon}
            </Box>
          </Zoom>

          {/* Sistema de Estrelas Estilo Uber/99 */}
          <Box>
            <Stack direction="row" spacing={1} justifyContent="center" mb={2} role="radiogroup" aria-label="Nota da avaliação">
              {[1, 2, 3, 4, 5].map((value) => (
                <IconButton
                  key={value}
                  onClick={() => setNota(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(-1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setNota(value);
                    }
                    if (e.key === 'ArrowLeft' && value > 1) {
                      setNota(value - 1);
                    }
                    if (e.key === 'ArrowRight' && value < 5) {
                      setNota(value + 1);
                    }
                  }}
                  aria-checked={nota === value}
                  role="radio"
                  sx={{
                    p: 0.5,
                    transition: 'all 0.16s',
                    transform: displayRating >= value ? 'scale(1.08)' : 'scale(1)',
                    '&:hover': {
                      transform: 'scale(1.12)'
                    }
                  }}
                >
                  <Star
                    sx={{
                      fontSize: 44,
                      color: displayRating >= value ? '#FFD700' : '#e0e0e0',
                      transition: 'all 0.16s',
                      filter: displayRating >= value ? 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.35))' : 'none'
                    }}
                  />
                </IconButton>
              ))}
            </Stack>
            
            <Fade in={true}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: `${ratingInfo.color}15`,
                  border: `2px solid ${ratingInfo.color}40`,
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    color: ratingInfo.color,
                    mb: 0.5
                  }}
                >
                  {ratingInfo.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Toque nas estrelas para avaliar
                </Typography>
              </Paper>
            </Fade>
          </Box>

          {/* Comentário */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={1} fontWeight="medium">
              Deixe um comentário sobre sua experiência
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
              ⭐ Dica: Seja específico sobre o que mais gostou ou o que pode melhorar
            </Typography>
            <TextField
              multiline
              rows={4}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Seu feedback ajuda outros clientes a escolherem o melhor cuidador..."
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 500 }}
              helperText={`${comentario.length}/500 caracteres`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: ratingInfo.color,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: ratingInfo.color,
                  }
                }
              }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={mutation.isPending}
          size="large"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mutation.isPending}
          size="large"
          sx={{ 
            minWidth: 140,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            bgcolor: ratingInfo.color,
            '&:hover': {
              bgcolor: ratingInfo.color,
              filter: 'brightness(0.9)'
            }
          }}
        >
          {mutation.isPending ? 'Enviando...' : 'Enviar Avaliação'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
