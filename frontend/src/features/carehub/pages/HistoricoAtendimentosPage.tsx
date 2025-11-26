import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Badge,
  Tooltip,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  CalendarToday,
  Person,
  LocalHospital,
  Medication,
  Restaurant,
  DirectionsWalk,
  MoodOutlined,
  Warning,
  MonitorHeart,
  Search,
  Assignment,
  Refresh,
} from '@mui/icons-material';
import { PageHeader } from '../components/PageHeader';
import http from '../libHttp';
import { getUserId, getUserRole } from '../components/auth';

interface RegistroAcompanhamento {
  id: number;
  agendamentoId: number;
  cuidadorId: number;
  cuidadorNome: string;
  clienteId: number;
  clienteNome: string;
  dataHoraRegistro: string;
  pressaoArterial?: string;
  glicemia?: string;
  medicamentosAdministrados?: string;
  alimentacao?: string;
  atividadesRealizadas?: string;
  observacoes?: string;
  intercorrencias?: string;
  humorEstado?: string;
  sinaisVitais?: string;
  dataCriacao: string;
}

export function HistoricoAtendimentosPage() {
  const [registros, setRegistros] = useState<RegistroAcompanhamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  
  const userId = getUserId();
  const userRole = getUserRole();
  // Verifica se é cuidador (aceita CUIDADOR ou ROLE_CUIDADOR)
  const isCuidador = userRole?.includes('CUIDADOR') || false;

  useEffect(() => {
    if (userId) {
      carregarHistorico();
    }
  }, [userId]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Debug Histórico:');
      console.log('  - userId:', userId);
      console.log('  - userRole:', userRole);
      console.log('  - isCuidador:', isCuidador);
      
      const endpoint = isCuidador 
        ? `/api/carehub/registros/cuidador/${userId}`
        : `/api/carehub/registros/cliente/${userId}`;
      
      console.log('  - endpoint:', endpoint);
      
      const response = await http.get(endpoint);
      console.log('  - response.data:', response.data);
      
      // Ordenar por data mais recente primeiro
      const registrosOrdenados = response.data.sort((a: RegistroAcompanhamento, b: RegistroAcompanhamento) => 
        new Date(b.dataHoraRegistro).getTime() - new Date(a.dataHoraRegistro).getTime()
      );
      setRegistros(registrosOrdenados);
      console.log('  - Total de registros:', registrosOrdenados.length);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico de atendimentos');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtrar registros pela busca
  const registrosFiltrados = registros.filter(registro => {
    const termoBusca = busca.toLowerCase();
    return (
      registro.clienteNome.toLowerCase().includes(termoBusca) ||
      registro.cuidadorNome.toLowerCase().includes(termoBusca) ||
      registro.observacoes?.toLowerCase().includes(termoBusca) ||
      registro.medicamentosAdministrados?.toLowerCase().includes(termoBusca)
    );
  });

  // Agrupar registros - por cliente se for cuidador, por cuidador se for cliente
  const registrosAgrupados = registrosFiltrados.reduce((acc, registro) => {
    const chave = isCuidador ? registro.clienteId : registro.cuidadorId;
    const nome = isCuidador ? registro.clienteNome : registro.cuidadorNome;
    
    if (!acc[chave]) {
      acc[chave] = {
        nome: nome,
        registros: []
      };
    }
    acc[chave].registros.push(registro);
    return acc;
  }, {} as Record<number, { nome: string; registros: RegistroAcompanhamento[] }>);

  if (loading) {
    return (
      <Box>
        <PageHeader title="Histórico de Atendimentos" backTo="/carehub" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Histórico de Atendimentos" 
        subtitle={isCuidador ? "Registros de atendimentos com seus clientes" : "Registros de atendimentos com seus cuidadores"}
        backTo="/carehub" 
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Botão de recarregar */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={carregarHistorico}
          disabled={loading}
        >
          Recarregar
        </Button>
      </Box>

      {registros.length === 0 ? (
        <Alert severity="info">
          Você ainda não possui registros de atendimentos. Os registros aparecerão aqui após cada sessão de atendimento.
        </Alert>
      ) : (
        <Stack spacing={3}>
          {/* Campo de busca */}
          <TextField
            fullWidth
            placeholder={`Buscar por ${isCuidador ? 'cliente' : 'cuidador'}, medicamentos, observações...`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Alert severity="info" icon={<Assignment />}>
            <Typography variant="body2">
              <strong>Total:</strong> {registrosFiltrados.length} registro(s) • {Object.keys(registrosAgrupados).length} {isCuidador ? 'cliente(s)' : 'cuidador(es)'}
            </Typography>
          </Alert>

          {Object.entries(registrosAgrupados).map(([id, { nome, registros: registrosPessoa }]) => (
            <Card key={id} sx={{ bgcolor: 'background.default' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    {nome}
                  </Typography>
                  <Chip 
                    label={`${registrosPessoa.length} registro${registrosPessoa.length > 1 ? 's' : ''}`} 
                    size="small" 
                    color="primary" 
                  />
                </Stack>

                <Stack spacing={2}>
                  {registrosPessoa.map((registro, index) => (
                    <Accordion key={registro.id} defaultExpanded={index === 0}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', flexWrap: 'wrap' }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body1" fontWeight={500}>
                            {formatarData(registro.dataHoraRegistro)}
                          </Typography>
                          {!isCuidador && (
                            <Tooltip title="Cuidador responsável">
                              <Chip 
                                icon={<LocalHospital />} 
                                label={registro.cuidadorNome} 
                                size="small" 
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                          {isCuidador && (
                            <Tooltip title="Cliente atendido">
                              <Chip 
                                icon={<Person />} 
                                label={registro.clienteNome} 
                                size="small" 
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                          {registro.intercorrencias && (
                            <Chip 
                              icon={<Warning />} 
                              label="Intercorrências" 
                              size="small" 
                              color="warning" 
                            />
                          )}
                          <Badge 
                            badgeContent={`#${registro.agendamentoId}`} 
                            color="secondary"
                            sx={{ ml: 'auto' }}
                          >
                            <Assignment fontSize="small" />
                          </Badge>
                        </Stack>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Stack spacing={2.5}>
                          {/* Sinais Vitais */}
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <MonitorHeart fontSize="small" color="error" />
                              Sinais Vitais
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                              {registro.pressaoArterial && (
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Pressão Arterial
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {registro.pressaoArterial}
                                  </Typography>
                                </Box>
                              )}
                              {registro.glicemia && (
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Glicemia
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {registro.glicemia}
                                  </Typography>
                                </Box>
                              )}
                              {registro.sinaisVitais && (
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Outros Sinais
                                  </Typography>
                                  <Typography variant="body2">
                                    {registro.sinaisVitais}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Paper>

                          {/* Medicamentos */}
                          {registro.medicamentosAdministrados && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Medication fontSize="small" color="primary" />
                                Medicamentos Administrados
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', pl: 3 }}>
                                {registro.medicamentosAdministrados}
                              </Typography>
                            </Box>
                          )}

                          {/* Alimentação */}
                          {registro.alimentacao && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Restaurant fontSize="small" color="success" />
                                Alimentação
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', pl: 3 }}>
                                {registro.alimentacao}
                              </Typography>
                            </Box>
                          )}

                          {/* Atividades */}
                          {registro.atividadesRealizadas && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DirectionsWalk fontSize="small" color="info" />
                                Atividades Realizadas
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', pl: 3 }}>
                                {registro.atividadesRealizadas}
                              </Typography>
                            </Box>
                          )}

                          {/* Humor */}
                          {registro.humorEstado && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MoodOutlined fontSize="small" sx={{ color: 'warning.main' }} />
                                Humor e Estado Emocional
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', pl: 3 }}>
                                {registro.humorEstado}
                              </Typography>
                            </Box>
                          )}

                          {/* Observações Gerais */}
                          {registro.observacoes && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalHospital fontSize="small" />
                                Observações Gerais
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', pl: 3 }}>
                                {registro.observacoes}
                              </Typography>
                            </Box>
                          )}

                          {/* Intercorrências */}
                          {registro.intercorrencias && (
                            <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.light' }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.dark' }}>
                                <Warning fontSize="small" />
                                ⚠️ Intercorrências
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'warning.dark' }}>
                                {registro.intercorrencias}
                              </Typography>
                            </Paper>
                          )}

                          {/* Metadados */}
                          <Divider />
                          <Typography variant="caption" color="text.secondary">
                            Agendamento #{registro.agendamentoId} • Registrado em {formatarData(registro.dataCriacao)}
                          </Typography>
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
