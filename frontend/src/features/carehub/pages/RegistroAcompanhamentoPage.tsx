import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Save, CheckCircle, Done } from '@mui/icons-material';
import { PageHeader } from '../components/PageHeader';
import http from '../libHttp';
import { useSnackbar } from 'notistack';
import { getUserId, isCuidador as isRoleCuidador, checkAndCacheUserType } from '../components/auth';

interface Agendamento {
  id: number;
  clienteNome: string;
  dataHoraInicio: string;
  status: string;
}

export function RegistroAcompanhamentoPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [ehCuidador, setEhCuidador] = useState<boolean>(false);
  const [registroSalvo, setRegistroSalvo] = useState(false);
  const [dialogFinalizarOpen, setDialogFinalizarOpen] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  
  const [cuidadorId, setCuidadorId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    pressaoArterial: '',
    glicemia: '',
    medicamentosAdministrados: '',
    alimentacao: '',
    atividadesRealizadas: '',
    observacoes: '',
    intercorrencias: '',
    humorEstado: '',
    sinaisVitais: '',
  });

  // ✅ Captura agendamentoId da URL se vier de "Iniciar Atendimento" e inicializa cache
  useEffect(() => {
    const inicializar = async () => {
      await checkAndCacheUserType();
      setEhCuidador(isRoleCuidador());
      const currentUserId = getUserId();
      setCuidadorId(currentUserId);
      
      const params = new URLSearchParams(window.location.search);
      const agendamentoId = params.get('agendamentoId');
      if (agendamentoId) {
        setAgendamentoSelecionado(agendamentoId);
      }
    };
    inicializar();
  }, []);

  useEffect(() => {
    if (cuidadorId && ehCuidador) {
      carregarAgendamentos();
    }
  }, [cuidadorId, ehCuidador]);

  const carregarAgendamentos = async () => {
    if (!cuidadorId) return;
    
    try {
      const response = await http.get(
        `/api/carehub/agendamentos/cuidador/${cuidadorId}`
      );
      // Filtrar apenas agendamentos em andamento (registro deve ser feito durante o atendimento)
      const agendamentosAtivos = response.data.filter(
        (ag: Agendamento) => ag.status === 'EM_ANDAMENTO'
      );
      setAgendamentos(agendamentosAtivos);
    } catch {
        enqueueSnackbar('Erro ao carregar agendamentos', { variant: 'error' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setAgendamentoSelecionado(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agendamentoSelecionado) {
      enqueueSnackbar('Selecione um agendamento', { variant: 'warning' });
      return;
    }

    if (!cuidadorId) {
      enqueueSnackbar('Erro: Usuário não autenticado', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      const response = await http.post(
        '/api/carehub/registros',
        {
          agendamentoId: parseInt(agendamentoSelecionado),
          ...formData,
        },
        {
          headers: {
            'X-User-Id': cuidadorId.toString(),
          },
        }
      );

      enqueueSnackbar('✅ Registro salvo com sucesso!', { variant: 'success' });
      setRegistroSalvo(true);
      
      // Abrir diálogo perguntando se deseja finalizar o atendimento
      setDialogFinalizarOpen(true);
      
    } catch {
      enqueueSnackbar('Erro ao salvar registro', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const finalizarAtendimento = async () => {
    if (!agendamentoSelecionado) return;
    
    try {
      setFinalizando(true);
      await http.put(
        `/api/carehub/agendamentos/${agendamentoSelecionado}/status?status=CONCLUIDO`
      );
      
      enqueueSnackbar('✅ Atendimento finalizado com sucesso!', { variant: 'success' });
      setDialogFinalizarOpen(false);
      
      // Redirecionar para Meus Agendamentos
      navigate('/carehub/cuidador/agendamentos');
    } catch (err: any) {
      console.error('Erro ao finalizar atendimento:', err);
      enqueueSnackbar('Erro ao finalizar atendimento', { variant: 'error' });
    } finally {
      setFinalizando(false);
    }
  };

  const continuarRegistrando = () => {
    setDialogFinalizarOpen(false);
    // Limpar formulário para novo registro ou continuar editando
    setFormData({
      pressaoArterial: '',
      glicemia: '',
      medicamentosAdministrados: '',
      alimentacao: '',
      atividadesRealizadas: '',
      observacoes: '',
      intercorrencias: '',
      humorEstado: '',
      sinaisVitais: '',
    });
    setRegistroSalvo(false);
    carregarAgendamentos();
  };

  return (
    <Box>
      <PageHeader title="Registro de Acompanhamento" backTo="/carehub/cuidador/agendamentos" />

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>📋 Documentação do Atendimento:</strong> Registre todos os detalhes do atendimento realizado. 
        Este registro será adicionado ao histórico do cliente e ficará disponível para consultas futuras.
      </Alert>

      {!ehCuidador && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Acesso restrito: apenas usuários com função de cuidador podem criar registros de acompanhamento. Se você acredita que seu perfil deveria ser cuidador, verifique sua conta ou contacte o administrador.
        </Alert>
      )}

      {ehCuidador && (
        <>
          {agendamentoSelecionado && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <strong>✅ Atendimento em Andamento:</strong> Você está registrando o acompanhamento em tempo real. 
              Preencha os dados conforme realiza as atividades.
            </Alert>
          )}

          <Card component="form" onSubmit={handleSubmit}>
        <CardContent>
          <Stack spacing={3}>
            {/* Seleção de Agendamento */}
            <FormControl fullWidth required>
              <InputLabel>Agendamento</InputLabel>
              <Select
                value={agendamentoSelecionado}
                onChange={handleSelectChange}
                label="Agendamento"
              >
                <MenuItem value="">
                  <em>Selecione um agendamento</em>
                </MenuItem>
                {agendamentos.map((agendamento) => (
                  <MenuItem key={agendamento.id} value={agendamento.id.toString()}>
                    {agendamento.clienteNome} - {new Date(agendamento.dataHoraInicio).toLocaleDateString('pt-BR')} ({agendamento.status})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider />

            {/* Sinais Vitais */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                Sinais Vitais
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Pressão Arterial *"
                  name="pressaoArterial"
                  value={formData.pressaoArterial}
                  onChange={handleChange}
                  placeholder="Ex: 120/80 mmHg"
                  fullWidth
                  required
                />
                <TextField
                  label="Glicemia *"
                  name="glicemia"
                  value={formData.glicemia}
                  onChange={handleChange}
                  placeholder="Ex: 95 mg/dL"
                  fullWidth
                  required
                />
                <TextField
                  label="Outros Sinais Vitais *"
                  name="sinaisVitais"
                  value={formData.sinaisVitais}
                  onChange={handleChange}
                  placeholder="Ex: Temperatura 36.5°C, FC 72 bpm"
                  fullWidth
                  multiline
                  rows={2}
                  required
                />
              </Stack>
            </Paper>

            {/* Medicamentos */}
            <TextField
              label="Medicamentos Administrados *"
              name="medicamentosAdministrados"
              value={formData.medicamentosAdministrados}
              onChange={handleChange}
              placeholder="Ex: Losartana 50mg às 9h, Metformina 850mg às 9h (ou 'Nenhum' se não houver)"
              fullWidth
              multiline
              rows={3}
              required
            />

            {/* Alimentação */}
            <TextField
              label="Alimentação *"
              name="alimentacao"
              value={formData.alimentacao}
              onChange={handleChange}
              placeholder="Ex: Café da manhã - aceitação boa, Almoço - aceitação regular"
              fullWidth
              multiline
              rows={3}
              required
            />

            {/* Atividades */}
            <TextField
              label="Atividades Realizadas *"
              name="atividadesRealizadas"
              value={formData.atividadesRealizadas}
              onChange={handleChange}
              placeholder="Ex: Caminhada de 15 minutos, Exercícios de memória, Leitura"
              fullWidth
              multiline
              rows={3}
              required
            />

            {/* Humor e Estado */}
            <TextField
              label="Humor e Estado Emocional *"
              name="humorEstado"
              value={formData.humorEstado}
              onChange={handleChange}
              placeholder="Ex: Alegre e comunicativo, Sonolento mas tranquilo"
              fullWidth
              required
            />

            {/* Intercorrências */}
            <TextField
              label="Intercorrências *"
              name="intercorrencias"
              value={formData.intercorrencias}
              onChange={handleChange}
              placeholder="Ex: Nenhuma, ou descreva qualquer evento incomum"
              fullWidth
              multiline
              rows={3}
              required
            />

            {/* Observações Gerais */}
            <TextField
              label="Observações Gerais"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Ex: Paciente apresentou boa disposição durante todo o atendimento"
              fullWidth
              multiline
              rows={4}
              required
            />

            <Divider />

            {/* Botão Salvar */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={loading || registroSalvo}
            >
              {loading ? 'Salvando...' : registroSalvo ? '✓ Registro Salvo' : 'Salvar Registro'}
            </Button>

            {registroSalvo && (
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<Done />}
                onClick={() => setDialogFinalizarOpen(true)}
              >
                ✓ Finalizar Atendimento
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
        </>
      )}

      {/* Dialog de Confirmação para Finalizar Atendimento */}
      <Dialog 
        open={dialogFinalizarOpen} 
        onClose={() => !finalizando && setDialogFinalizarOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" />
          Registro Salvo com Sucesso!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            O registro de acompanhamento foi salvo. Deseja finalizar o atendimento agora?
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Ao finalizar:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>O atendimento será marcado como <strong>Concluído</strong></li>
              <li>O cliente poderá avaliar o atendimento</li>
              <li>O registro ficará disponível no histórico</li>
            </ul>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Se precisar adicionar mais informações ao registro, clique em "Continuar Registrando".
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={continuarRegistrando} 
            variant="outlined"
            disabled={finalizando}
          >
            Continuar Registrando
          </Button>
          <Button 
            onClick={finalizarAtendimento} 
            variant="contained" 
            color="success"
            startIcon={<Done />}
            disabled={finalizando}
          >
            {finalizando ? 'Finalizando...' : 'Finalizar Atendimento'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
