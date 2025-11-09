import { useMemo, useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Chip, FormControlLabel, Pagination, Stack, Switch, TextField, Typography, CircularProgress, Rating, Avatar, Divider, Paper } from '@mui/material';
import { cuidadoresApi } from '../api';
import type { CuidadorResponseDTO, Page } from '../types';
import { useQuery } from '@tanstack/react-query';
import { LocationOn, PersonSearch, Star, Chat } from '@mui/icons-material';
import { PageHeader } from '../components/PageHeader';
import { AvaliacaoModal } from '../components/AvaliacaoModal';

export default function CuidadoresPage() {
  const [q, setQ] = useState('');
  const [disp, setDisp] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [clienteId, setClienteId] = useState<number | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [cuidadorSelecionado, setCuidadorSelecionado] = useState<{ id: number; nome: string } | null>(null);
  

  // Recuperar clienteId do cabeçalho (simulado - em produção viria do contexto de auth)
  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      setClienteId(userId);
    }
  }, []);

  const params = useMemo(() => ({
    localizacao: q || undefined,
    disponibilidade: disp,
    page: page - 1,
    size: 6,
    sortBy: 'avaliacaoMedia',
    direction: 'DESC' as const,
  }), [q, disp, page]);

  const { data, isFetching, isError } = useQuery<Page<CuidadorResponseDTO>>({
    queryKey: ['cuidadores', params],
    queryFn: () => cuidadoresApi.buscar(params),
    staleTime: 10000, // Cache por 10 segundos para evitar refetch excessivo
    retry: 2,
  });

  const handleAvaliarClick = (cuidadorId: number, cuidadorNome: string) => {
    if (!clienteId) {
      alert('Você precisa estar logado para avaliar um cuidador.');
      return;
    }
    
    setCuidadorSelecionado({ id: cuidadorId, nome: cuidadorNome });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCuidadorSelecionado(null);
  };

  return (
    <Stack gap={3} sx={{ p: 2 }}>
      {/* Header com botão VOLTAR */}
      <PageHeader 
        title="Cuidadores Disponíveis"
        subtitle="Encontre o profissional ideal para suas necessidades"
        backTo="/carehub"
      />

      {/* Filtros */}
      <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
            <TextField 
              label="Localização (Cidade-UF)" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              size="small"
              placeholder="Ex: Goiânia-GO"
              sx={{ minWidth: 250 }}
            />
            <FormControlLabel 
              control={
                <Switch 
                  checked={!!disp} 
                  onChange={(e) => setDisp(e.target.checked ? true : undefined)} 
                />
              } 
              label="Apenas disponíveis" 
            />
            <Button 
              variant="contained" 
              onClick={() => { setPage(1); }}
              disabled={isFetching}
            >
              {isFetching ? 'Buscando...' : 'Buscar'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Loading */}
      {isFetching && (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Carregando cuidadores...
          </Typography>
        </Stack>
      )}

      {/* Error */}
      {isError && (
        <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
          <CardContent>
            <Typography>Erro ao carregar cuidadores. Verifique sua conexão.</Typography>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {!isFetching && data && data.content.length === 0 && (
        <Card variant="outlined" sx={{ py: 6, textAlign: 'center' }}>
          <PersonSearch sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            Nenhum cuidador encontrado.
          </Typography>
        </Card>
      )}

      {/* Lista */}
      {!isFetching && data && data.content.length > 0 && (
        <>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap={3}>
            {data.content.map((c) => (
              <Card 
                key={c.id} 
                sx={{ 
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    transform: 'translateY(-8px)', 
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)' 
                  }
                }}
              >
                {/* Badge de disponibilidade */}
                {c.disponibilidade && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: 16, 
                      bgcolor: 'success.main', 
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                      zIndex: 1
                    }}
                  >
                    ● DISPONÍVEL
                  </Box>
                )}
                
                <CardContent sx={{ p: 3 }}>
                  {/* Header com Avatar e Nome */}
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {c.nome?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" mb={0.5}>
                        {c.nome}
                      </Typography>
                      <Stack direction="row" alignItems="center" gap={0.5} color="text.secondary">
                        <LocationOn fontSize="small" />
                        <Typography variant="caption">
                          {c.cidade} - {c.estado}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Avaliação em destaque */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      bgcolor: 'primary.50', 
                      p: 1.5, 
                      mb: 2, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'primary.100'
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Rating 
                          value={c.avaliacaoMedia || 0} 
                          readOnly 
                          precision={0.1} 
                          size="small"
                          sx={{ color: 'warning.main' }}
                        />
                        <Typography variant="body2" fontWeight="bold" color="primary.dark">
                          {c.avaliacaoMedia?.toFixed(1) || '0.0'}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {c.totalAvaliacoes || 0} {c.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
                      </Typography>
                    </Stack>
                  </Paper>
                  
                  {/* Experiência */}
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      EXPERIÊNCIA
                    </Typography>
                    <Typography variant="body2" mt={0.5}>
                      {c.experiencia || 'Não informada'}
                    </Typography>
                  </Box>
                  
                  {/* Especialidades */}
                  {c.especialidades && c.especialidades.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="caption" color="text.secondary" fontWeight="medium" mb={1} display="block">
                        ESPECIALIDADES
                      </Typography>
                      <Stack direction="row" gap={0.5} flexWrap="wrap">
                        {c.especialidades.map((e, i) => (
                          <Chip 
                            key={i} 
                            label={e} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                  
                  {/* Botões de ação */}
                  <Stack direction="row" gap={1} mt={3}>
                    <Button 
                      variant="contained" 
                      size="medium" 
                      fullWidth
                      href={`/carehub/agendamentos?cuidadorId=${c.id}`}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        py: 1.2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #667eea 20%, #764ba2 120%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                        },
                        transition: 'all 0.3s'
                      }}
                    >
                      Agendar Consulta
                    </Button>
                  </Stack>
                  
                  <Stack direction="row" gap={1} mt={1.5}>
                    <Button 
                      size="small" 
                      href="/carehub/chat"
                      variant="outlined"
                      startIcon={<Chat />}
                      sx={{ 
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                    >
                      Chat
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handleAvaliarClick(c.id, c.nome)}
                      variant="outlined"
                      color="warning"
                      disabled={!clienteId}
                      startIcon={<Star />}
                      sx={{ 
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                      title={!clienteId ? "Faça login para avaliar" : "Avaliar cuidador"}
                    >
                      Avaliar
                    </Button>
                    <Button 
                      size="small" 
                      href={`/carehub/avaliacoes/${c.id}`}
                      variant="text"
                      sx={{ 
                        minWidth: 48,
                        borderRadius: 2,
                        color: 'warning.main'
                      }}
                      title="Ver todas as avaliações"
                    >
                      Ver {c.totalAvaliacoes || 0}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Stack alignItems="center" mt={2}>
            <Pagination 
              page={page} 
              onChange={(_, p) => setPage(p)} 
              count={data.totalPages}
              color="primary"
            />
            <Typography variant="caption" color="text.secondary" mt={1}>
              Total: {data.totalElements} cuidador(es)
            </Typography>
          </Stack>
        </>
      )}

      {/* Modal de Avaliação */}
      {modalOpen && cuidadorSelecionado && clienteId && (
        <AvaliacaoModal
          open={modalOpen}
          onClose={handleModalClose}
          cuidadorId={cuidadorSelecionado.id}
          cuidadorNome={cuidadorSelecionado.nome}
          clienteId={clienteId}
        />
      )}
    </Stack>
  );
}
