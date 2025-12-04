import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';
import http from '../libHttp';
import { useSnackbar } from '../libSnackbar';

interface RepropostaDataModalProps {
  open: boolean;
  onClose: () => void;
  agendamentoId: number;
  clienteNome: string;
  dataOriginal: string;
  onSuccess: () => void;
}

export function RepropostaDataModal({
  open,
  onClose,
  agendamentoId,
  clienteNome,
  dataOriginal,
  onSuccess,
}: RepropostaDataModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [novaInicio, setNovaInicio] = useState<string>(
    dayjs(dataOriginal).add(1, 'day').hour(9).minute(0).format('YYYY-MM-DDTHH:mm')
  );
  const [novaFim, setNovaFim] = useState<string>(
    dayjs(dataOriginal).add(1, 'day').hour(11).minute(0).format('YYYY-MM-DDTHH:mm')
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validações
    const dInicio = dayjs(novaInicio);
    const dFim = dayjs(novaFim);

    if (dFim.isBefore(dInicio)) {
      enqueueSnackbar('A data/hora de fim deve ser posterior à de início', { variant: 'warning' });
      return;
    }

    if (dInicio.isBefore(dayjs())) {
      enqueueSnackbar('A data/hora de início não pode ser no passado', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);
      
      await http.post(
        `/api/carehub/agendamentos/${agendamentoId}/contraproposta`,
        {
          dataHoraInicio: dInicio.format('YYYY-MM-DDTHH:mm:ss'),
          dataHoraFim: dFim.format('YYYY-MM-DDTHH:mm:ss'),
        }
      );

      enqueueSnackbar('Nova data proposta com sucesso! Aguardando confirmação do cliente.', { variant: 'success' });
      onSuccess();
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erro ao propor nova data';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonth color="primary" />
        Propor Nova Data de Atendimento
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Cliente:</strong> {clienteNome}
            </Typography>
            <Typography variant="body2">
              <strong>Data Original:</strong> {dayjs(dataOriginal).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Alert>

          <Alert severity="warning">
            O cliente receberá uma notificação com a nova data proposta e poderá aceitar ou sugerir outro horário.
          </Alert>

          <TextField
            label="Nova Data/Hora de Início"
            type="datetime-local"
            value={novaInicio}
            onChange={(e) => setNovaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Nova Data/Hora de Término"
            type="datetime-local"
            value={novaFim}
            onChange={(e) => setNovaFim(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Propor Nova Data'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
