import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Divider,
  TextField,
} from '@mui/material';
import {
  ExpandMore,
  Person,
  CalendarToday,
  LocalHospital,
  Medication,
  Warning,
  Bloodtype,
  Phone,
} from '@mui/icons-material';
import { PageHeader } from '../components/PageHeader';
import http from '../libHttp';
import { getUserId, isCuidador as isRoleCuidador, checkAndCacheUserType } from '../components/auth';

interface Prontuario {
  id: number;
  clienteId: number;
  clienteNome: string;
  dataNascimento: string;
  historicoMedico?: string;
  medicamentosUso?: string;
  alergias?: string;
  tipoSanguineo?: string;
  contatoEmergencia?: string;
  observacoesGerais?: string;
  necessidadesEspeciais?: string;
}

interface Agendamento {
  id: number;
  clienteId: number;
  clienteNome: string;
}

export function ProntuariosClientesPage() {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCuidador, setIsCuidador] = useState(false);
  const [cuidadorId, setCuidadorId] = useState<number | null>(null);

  useEffect(() => {
    const verificarECarregar = async () => {
      // Verificar tipo de usuário via API
      await checkAndCacheUserType();
      
      const ehCuidador = isRoleCuidador();
      setIsCuidador(ehCuidador);
      const currentUserId = getUserId();
      setCuidadorId(currentUserId);
      setAuthChecked(true);
    };
    
    verificarECarregar();
  }, []);

  // Carregar prontuários quando cuidadorId estiver disponível
  useEffect(() => {
    if (cuidadorId && isCuidador) {
      carregarProntuarios();
    } else if (authChecked) {
      setLoading(false);
    }
  }, [cuidadorId, isCuidador, authChecked]);

  const carregarProntuarios = async () => {
    if (!cuidadorId) return;

    try {
      setLoading(true);
      
      // 1. Buscar agendamentos do cuidador logado
      const agendamentosResponse = await http.get(`/api/carehub/agendamentos/cuidador/${cuidadorId}`);
      const agendamentos: Agendamento[] = agendamentosResponse.data;

      // 2. Extrair IDs únicos dos clientes
      const clienteIds = [...new Set(agendamentos.map(ag => ag.clienteId))];

      if (clienteIds.length === 0) {
        setProntuarios([]);
        setError('Você ainda não tem agendamentos com clientes');
        setLoading(false);
        return;
      }

      // 3. Buscar prontuário de cada cliente
      const prontuariosPromises = clienteIds.map(async (clienteId) => {
        try {
          const prontuarioResponse = await http.get(
            `/api/carehub/prontuarios/cliente/${clienteId}`
          );
          return prontuarioResponse.data;
        } catch {
          return null; // Cliente sem prontuário
        }
      });

      const prontuariosData = await Promise.all(prontuariosPromises);
  const prontuariosValidos = prontuariosData.filter((p: Prontuario | null): p is Prontuario => p !== null);
      
      setProntuarios(prontuariosValidos);
      setError(null);
    } catch {
      setError('Erro ao carregar prontuários dos clientes');
    } finally {
      setLoading(false);
    }
  };

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  // Verificar autorização após checagem inicial
  if (authChecked && !isCuidador) {
    return (
      <Box>
        <PageHeader title="Prontuários dos Clientes" />
        <Alert severity="warning">
          Esta página é acessível apenas para cuidadores. Faça login com uma conta de cuidador para visualizar os prontuários dos seus clientes.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box>
        <PageHeader title="Prontuários dos Clientes" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Filtrar prontuários pela pesquisa
  const prontuariosFiltrados = prontuarios.filter(prontuario => {
    if (!searchTerm) return true;
    const termo = searchTerm.toLowerCase();
    return (
      prontuario.clienteNome.toLowerCase().includes(termo) ||
      prontuario.tipoSanguineo?.toLowerCase().includes(termo) ||
      prontuario.historicoMedico?.toLowerCase().includes(termo) ||
      prontuario.medicamentosUso?.toLowerCase().includes(termo) ||
      prontuario.alergias?.toLowerCase().includes(termo)
    );
  });

  return (
    <Box>
      <PageHeader title="Prontuários dos Clientes" />

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Atenção:</strong> Informações sensíveis. Mantenha a confidencialidade dos dados médicos.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Campo de Pesquisa */}
      {prontuarios.length > 0 && (
        <TextField
          fullWidth
          placeholder="Pesquisar por nome do cliente, tipo sanguíneo, histórico, medicamentos ou alergias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      )}

      {prontuariosFiltrados.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? 'Nenhum prontuário encontrado com o termo de busca.' : 'Nenhum prontuário disponível.'}
        </Alert>
      ) : (
        <Stack spacing={2}>
          {prontuariosFiltrados.map((prontuario) => (
            <Accordion key={prontuario.id} elevation={2}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Person color="primary" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {prontuario.clienteNome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {calcularIdade(prontuario.dataNascimento)} anos • {prontuario.tipoSanguineo || 'Tipo sanguíneo não informado'}
                    </Typography>
                  </Box>
                  <Chip label="Prontuário" color="primary" size="small" />
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Dados Básicos */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" />
                      Dados Básicos
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>Data de Nascimento:</strong> {formatarData(prontuario.dataNascimento)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Idade:</strong> {calcularIdade(prontuario.dataNascimento)} anos
                      </Typography>
                      {prontuario.tipoSanguineo && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Bloodtype fontSize="small" color="error" />
                          <Typography variant="body2">
                            <strong>Tipo Sanguíneo:</strong> {prontuario.tipoSanguineo}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  {/* Histórico Médico */}
                  {prontuario.historicoMedico && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalHospital fontSize="small" />
                        Histórico Médico
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {prontuario.historicoMedico}
                      </Typography>
                    </Box>
                  )}

                  {/* Medicamentos */}
                  {prontuario.medicamentosUso && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Medication fontSize="small" />
                        Medicamentos em Uso
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {prontuario.medicamentosUso}
                      </Typography>
                    </Box>
                  )}

                  {/* Alergias */}
                  {prontuario.alergias && (
                    <Box>
                      <Alert severity="warning" icon={<Warning />}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                          Alergias
                        </Typography>
                        <Typography variant="body2">
                          {prontuario.alergias}
                        </Typography>
                      </Alert>
                    </Box>
                  )}

                  {/* Contato de Emergência */}
                  {prontuario.contatoEmergencia && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" />
                        Contato de Emergência
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2">
                        {prontuario.contatoEmergencia}
                      </Typography>
                    </Box>
                  )}

                  {/* Necessidades Especiais */}
                  {prontuario.necessidadesEspeciais && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Necessidades Especiais
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {prontuario.necessidadesEspeciais}
                      </Typography>
                    </Box>
                  )}

                  {/* Observações Gerais */}
                  {prontuario.observacoesGerais && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Observações Gerais
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {prontuario.observacoesGerais}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}
    </Box>
  );
}
