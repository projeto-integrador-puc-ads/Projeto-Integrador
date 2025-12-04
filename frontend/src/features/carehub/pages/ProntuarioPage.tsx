import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prontuariosApi, clientesApi } from '../api';
import { verificarPodeEditar } from '../api/prontuarios';
import type { ProntuarioResponseDTO } from '../types';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  Stack, 
  TextField, 
  Typography,
  Alert 
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageHeader } from '../components/PageHeader';
import { Save, Lock } from '@mui/icons-material';
import { getUserId, isCliente, checkAndCacheUserType } from '../components/auth';

export default function ProntuarioPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [clienteId, setClienteId] = useState<number | undefined>(undefined);
  const [podeEditar, setPodeEditar] = useState(false);
  const [verificandoPermissao, setVerificandoPermissao] = useState(true);
  const [_ehCliente, setEhCliente] = useState<boolean | null>(null);

  // Verificar se é cliente e bloquear acesso (prontuário é para cuidadores)
  useEffect(() => {
    const verificarTipo = async () => {
      await checkAndCacheUserType();
      const cliente = isCliente();
      setEhCliente(cliente);
      if (cliente) {
        enqueueSnackbar('Acesso negado: prontuários são exclusivos para cuidadores', { variant: 'error' });
        navigate('/carehub');
        return;
      }
    };
    verificarTipo();
  }, [navigate, enqueueSnackbar]);

  useEffect(() => {
    clientesApi.listarTodos().then(arr => setClienteId(arr[0]?.id));
  }, []);

  const { data: model, isLoading } = useQuery({
    queryKey: ['prontuario', clienteId],
    queryFn: () => prontuariosApi.porCliente(clienteId!),
    enabled: !!clienteId,
  });

  // Verificar se cuidador pode editar prontuário
  useEffect(() => {
    async function verificarPermissao() {
      if (!clienteId) {
        setVerificandoPermissao(false);
        return;
      }

      const userId = getUserId();
      if (!userId) {
        setPodeEditar(false);
        setVerificandoPermissao(false);
        return;
      }
      
      const pode = await verificarPodeEditar(clienteId, userId);
      setPodeEditar(pode);
      setVerificandoPermissao(false);
    }

    verificarPermissao();
  }, [clienteId]);

  const [form, setForm] = useState<Partial<ProntuarioResponseDTO>>({});

  useEffect(() => {
    if (model) setForm(model);
  }, [model]);

  const salvarMutation = useMutation({
    mutationFn: async () => {
      if (!clienteId) throw new Error('Cliente não identificado');
      
      const dto = {
        clienteId,
        historicoMedico: form.historicoMedico || '',
        medicamentosUso: form.medicamentosUso || '',
        alergias: form.alergias || '',
        tipoSanguineo: form.tipoSanguineo || '',
        contatoEmergencia: form.contatoEmergencia || '',
        observacoesGerais: form.observacoesGerais || '',
        necessidadesEspeciais: form.necessidadesEspeciais || '',
      };

      if (model?.id) {
        return prontuariosApi.atualizar(model.id, dto);
      } else {
        return prontuariosApi.criar(dto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuario', clienteId] });
      enqueueSnackbar('Prontuário salvo com sucesso!', { variant: 'success' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao salvar prontuário';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const updateField = (field: keyof ProntuarioResponseDTO, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const camposDesabilitados = !podeEditar || verificandoPermissao;

  return (
    <Stack gap={3} sx={{ p: 2 }}>
      <PageHeader 
        title="Prontuário Médico"
        subtitle="Mantenha as informações de saúde dos clientes atualizadas"
        backTo="/carehub"
      />

      {!podeEditar && !verificandoPermissao && (
        <Alert severity="warning" icon={<Lock />}> 
          <Typography variant="body2" fontWeight="medium">
            Modo Somente Leitura
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            Você só pode editar prontuários durante atendimentos agendados para hoje (status CONFIRMADO ou EM_ANDAMENTO).
          </Typography>
          <Box>
            <Button variant="outlined" size="small" onClick={() => navigate('/carehub/meus-agendamentos')}>
              Ver meus agendamentos
            </Button>
          </Box>
        </Alert>
      )}

      {isLoading && (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Carregando prontuário...
          </Typography>
        </Stack>
      )}

      {!isLoading && (
        <Card variant="outlined">
          <CardContent>
            <Stack gap={2.5}>
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  Informações Médicas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack gap={2}>
                  <TextField 
                    label="Histórico Médico" 
                    value={form?.historicoMedico || ''} 
                    onChange={(e) => updateField('historicoMedico', e.target.value)}
                    disabled={camposDesabilitados}
                    multiline
                    minRows={3}
                    placeholder="Descreva histórico de doenças, cirurgias, tratamentos..."
                    fullWidth
                  />
                  
                  <TextField 
                    label="Medicamentos em uso" 
                    value={form?.medicamentosUso || ''} 
                    onChange={(e) => updateField('medicamentosUso', e.target.value)}
                    disabled={camposDesabilitados}
                    multiline
                    minRows={2}
                    placeholder="Liste os medicamentos, dosagens e frequência"
                    fullWidth
                  />
                  
                  <TextField 
                    label="Alergias" 
                    value={form?.alergias || ''} 
                    onChange={(e) => updateField('alergias', e.target.value)}
                    disabled={camposDesabilitados}
                    placeholder="Alergias a medicamentos, alimentos, etc."
                    fullWidth
                  />
                  
                  <TextField 
                    label="Tipo Sanguíneo" 
                    value={form?.tipoSanguineo || ''} 
                    onChange={(e) => updateField('tipoSanguineo', e.target.value)}
                    disabled={camposDesabilitados}
                    placeholder="Ex: O+, A-, AB+"
                    sx={{ maxWidth: 200 }}
                  />
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  Informações de Contato e Cuidados
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack gap={2}>
                  <TextField 
                    label="Contato de Emergência" 
                    value={form?.contatoEmergencia || ''} 
                    onChange={(e) => updateField('contatoEmergencia', e.target.value)}
                    disabled={camposDesabilitados}
                    placeholder="Nome: (XX) XXXXX-XXXX"
                    fullWidth
                  />
                  
                  <TextField 
                    label="Necessidades Especiais" 
                    value={form?.necessidadesEspeciais || ''} 
                    onChange={(e) => updateField('necessidadesEspeciais', e.target.value)}
                    disabled={camposDesabilitados}
                    multiline
                    minRows={2}
                    placeholder="Descreva necessidades especiais de cuidado"
                    fullWidth
                  />
                  
                  <TextField 
                    label="Observações Gerais" 
                    multiline 
                    minRows={3} 
                    value={form?.observacoesGerais || ''} 
                    onChange={(e) => updateField('observacoesGerais', e.target.value)}
                    disabled={camposDesabilitados}
                    placeholder="Outras informações relevantes"
                    fullWidth
                  />
                </Stack>
              </Box>

              <Button 
                variant="contained" 
                size="large"
                startIcon={podeEditar ? <Save /> : <Lock />}
                onClick={() => salvarMutation.mutate()} 
                disabled={!podeEditar || salvarMutation.isPending || !clienteId}
                fullWidth
                sx={{ mt: 2 }}
              >
                {salvarMutation.isPending 
                  ? 'Salvando...' 
                  : !podeEditar 
                    ? 'Edição Bloqueada (Sem Agendamento Ativo)' 
                    : model?.id 
                      ? 'Atualizar Prontuário' 
                      : 'Criar Prontuário'
                }
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
