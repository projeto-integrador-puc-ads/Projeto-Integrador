import { useState, useEffect } from 'react';
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
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Save, CheckCircle } from '@mui/icons-material';
import { PageHeader } from '../components/PageHeader';
import http from '../libHttp';
import { useSnackbar } from 'notistack';
import { getUserId, isCuidador } from '../components/auth';

interface Agendamento {
  id: number;
  clienteNome: string;
  dataHoraInicio: string;
  status: string;
}

export function RegistroAcompanhamentoPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const cuidadorId = getUserId(); // Cuidador logado
  const ehCuidador = isCuidador();

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

  // ✅ Captura agendamentoId da URL se vier de "Iniciar Atendimento"
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agendamentoId = params.get('agendamentoId');
    if (agendamentoId) {
      setAgendamentoSelecionado(agendamentoId);
    }
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
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        const msg = (error as any)?.message || 'Erro ao carregar agendamentos';
        enqueueSnackbar(msg, { variant: 'error' });
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
      
      console.log('💾 Salvando registro:');
      console.log('  - cuidadorId:', cuidadorId);
      console.log('  - agendamentoId:', parseInt(agendamentoSelecionado));
      console.log('  - formData:', formData);
      
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

      console.log('✅ Registro salvo! Response:', response.data);
      enqueueSnackbar('Registro salvo com sucesso!', { variant: 'success' });
      
      // Limpar formulário
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
      setAgendamentoSelecionado('');
      
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      const msg = (error as any)?.message || 'Erro ao salvar registro';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
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
                  label="Pressão Arterial"
                  name="pressaoArterial"
                  value={formData.pressaoArterial}
                  onChange={handleChange}
                  placeholder="Ex: 120/80 mmHg"
                  fullWidth
                />
                <TextField
                  label="Glicemia"
                  name="glicemia"
                  value={formData.glicemia}
                  onChange={handleChange}
                  placeholder="Ex: 95 mg/dL"
                  fullWidth
                />
                <TextField
                  label="Outros Sinais Vitais"
                  name="sinaisVitais"
                  value={formData.sinaisVitais}
                  onChange={handleChange}
                  placeholder="Ex: Temperatura 36.5°C, FC 72 bpm"
                  fullWidth
                  multiline
                  rows={2}
                />
              </Stack>
            </Paper>

            {/* Medicamentos */}
            <TextField
              label="Medicamentos Administrados"
              name="medicamentosAdministrados"
              value={formData.medicamentosAdministrados}
              onChange={handleChange}
              placeholder="Ex: Losartana 50mg às 9h, Metformina 850mg às 9h"
              fullWidth
              multiline
              rows={3}
            />

            {/* Alimentação */}
            <TextField
              label="Alimentação"
              name="alimentacao"
              value={formData.alimentacao}
              onChange={handleChange}
              placeholder="Ex: Café da manhã - aceitação boa, Almoço - aceitação regular"
              fullWidth
              multiline
              rows={3}
            />

            {/* Atividades */}
            <TextField
              label="Atividades Realizadas"
              name="atividadesRealizadas"
              value={formData.atividadesRealizadas}
              onChange={handleChange}
              placeholder="Ex: Caminhada de 15 minutos, Exercícios de memória, Leitura"
              fullWidth
              multiline
              rows={3}
            />

            {/* Humor e Estado */}
            <TextField
              label="Humor e Estado Emocional"
              name="humorEstado"
              value={formData.humorEstado}
              onChange={handleChange}
              placeholder="Ex: Alegre e comunicativo, Sonolento mas tranquilo"
              fullWidth
            />

            {/* Intercorrências */}
            <TextField
              label="Intercorrências"
              name="intercorrencias"
              value={formData.intercorrencias}
              onChange={handleChange}
              placeholder="Ex: Nenhuma, ou descreva qualquer evento incomum"
              fullWidth
              multiline
              rows={3}
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
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
        </>
      )}
    </Box>
  );
}
