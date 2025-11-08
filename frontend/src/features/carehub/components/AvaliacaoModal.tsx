import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { criarAvaliacao, type AvaliacaoRequest } from '../api/avaliacoes';

interface AvaliacaoModalProps {
  open: boolean;
  onClose: () => void;
  cuidadorId: number;
  cuidadorNome: string;
  clienteId: number;
}

export function AvaliacaoModal({ open, onClose, cuidadorId, cuidadorNome, clienteId }: AvaliacaoModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState('');

  const mutation = useMutation({
    mutationFn: (avaliacao: AvaliacaoRequest) => criarAvaliacao(clienteId, avaliacao),
    onSuccess: () => {
      enqueueSnackbar('Avaliação enviada com sucesso!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['avaliacoes', cuidadorId] });
      queryClient.invalidateQueries({ queryKey: ['cuidadores'] });
      handleClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao enviar avaliação';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    if (nota < 1 || nota > 5) {
      enqueueSnackbar('Selecione uma nota de 1 a 5 estrelas', { variant: 'warning' });
      return;
    }

    mutation.mutate({
      cuidadorId,
      nota,
      comentario: comentario.trim(),
    });
  };

  const handleClose = () => {
    setNota(5);
    setComentario('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Avaliar Cuidador
        <Typography variant="body2" color="text.secondary">
          {cuidadorNome}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {/* Sistema de Estrelas */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Como foi o atendimento? *
            </Typography>
            <Rating
              value={nota}
              onChange={(_, newValue) => setNota(newValue || 1)}
              size="large"
              icon={<Star fontSize="inherit" />}
              emptyIcon={<Star fontSize="inherit" />}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {nota === 1 && 'Muito ruim'}
              {nota === 2 && 'Ruim'}
              {nota === 3 && 'Regular'}
              {nota === 4 && 'Bom'}
              {nota === 5 && 'Excelente'}
            </Typography>
          </Box>

          {/* Comentário */}
          <TextField
            label="Comentário (opcional)"
            multiline
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Conte como foi sua experiência..."
            fullWidth
            inputProps={{ maxLength: 500 }}
            helperText={`${comentario.length}/500 caracteres`}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={mutation.isPending}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mutation.isPending}
          sx={{ minWidth: 100 }}
        >
          {mutation.isPending ? 'Enviando...' : 'Avaliar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
