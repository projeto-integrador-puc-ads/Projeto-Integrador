import { useParams } from 'react-router-dom';
import { listarAvaliacoesCuidador } from '../api/avaliacoes';
import { Box, Card, CardContent, CircularProgress, Rating, Stack, Typography, Paper, Divider, Avatar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Star, Person } from '@mui/icons-material';
import { PageHeader } from '../components/PageHeader';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default function AvaliacoesPage() {
  const { id } = useParams();
  const cuidadorId = Number(id);

  const { data: lista = [], isLoading, isError } = useQuery({
    queryKey: ['avaliacoes', cuidadorId],
    queryFn: () => listarAvaliacoesCuidador(cuidadorId),
    enabled: !!cuidadorId,
  });

  // Calcular média e distribuição de estrelas
  const mediaAvaliacoes = lista.length > 0 
    ? lista.reduce((acc, a) => acc + a.nota, 0) / lista.length 
    : 0;
  
  const distribuicao = [5, 4, 3, 2, 1].map(estrela => ({
    estrelas: estrela,
    quantidade: lista.filter(a => a.nota === estrela).length
  }));

  return (
    <Stack gap={3} sx={{ p: 2 }}>
      {/* Header com botão VOLTAR */}
      <PageHeader 
        title="Avaliações do Cuidador"
        subtitle="Veja o que outros clientes dizem sobre este profissional"
        backTo="/carehub/cuidadores"
      />

      {/* Estatísticas de Avaliação */}
      {lista.length > 0 && (
        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Decoração de fundo */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            }}
          />
          
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={4} alignItems="center">
              {/* Média geral */}
              <Box textAlign="center" flex={1}>
                <Typography variant="h1" fontWeight="bold" mb={1} sx={{ fontSize: { xs: '3rem', md: '4rem' } }}>
                  {mediaAvaliacoes.toFixed(1)}
                </Typography>
                <Rating 
                  value={mediaAvaliacoes} 
                  readOnly 
                  precision={0.1} 
                  size="large"
                  sx={{ 
                    color: '#FFD700',
                    mb: 1,
                    '& .MuiRating-iconFilled': {
                      filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.5))'
                    }
                  }}
                />
                <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 'medium' }}>
                  Baseado em {lista.length} {lista.length === 1 ? 'avaliação' : 'avaliações'}
                </Typography>
              </Box>

              <Divider 
                orientation="vertical" 
                flexItem 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  display: { xs: 'none', md: 'block' }
                }} 
              />

              {/* Distribuição de estrelas */}
              <Stack spacing={1.5} flex={2} width="100%">
                {distribuicao.map(({ estrelas, quantidade }) => {
                  const percentage = lista.length > 0 ? (quantidade / lista.length) * 100 : 0;
                  return (
                    <Stack key={estrelas} direction="row" alignItems="center" gap={1.5}>
                      <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 20 }}>
                        {estrelas}
                      </Typography>
                      <Star fontSize="small" sx={{ color: '#FFD700' }} />
                      <Box 
                        sx={{ 
                          flex: 1, 
                          height: 10, 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${percentage}%`,
                            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                            borderRadius: 2,
                            transition: 'width 0.5s ease-in-out',
                            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)'
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 50, opacity: 0.95, textAlign: 'right' }}>
                        {quantidade} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Carregando avaliações...
          </Typography>
        </Stack>
      )}

      {/* Error */}
      {isError && (
        <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
          <CardContent>
            <Typography>Erro ao carregar avaliações.</Typography>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {!isLoading && lista.length === 0 && (
        <Card variant="outlined" sx={{ py: 6, textAlign: 'center' }}>
          <Star sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            Nenhuma avaliação ainda. Seja o primeiro!
          </Typography>
        </Card>
      )}

      {/* Lista de Avaliações */}
      <Stack gap={2}>
        {lista.map(a => (
          <Card 
            key={a.id} 
            variant="outlined"
            sx={{ 
              transition: 'all 0.3s',
              borderRadius: 3,
              '&:hover': { 
                transform: 'translateX(8px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderColor: 'primary.main'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2.5}>
                <Stack direction="row" gap={2} alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {a.clienteNome?.charAt(0).toUpperCase() || <Person />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                      {a.clienteNome || 'Cliente'}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(a.dataAvaliacao).fromNow()}
                      </Typography>
                      <Box 
                        sx={{ 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          bgcolor: 'text.disabled' 
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(a.dataAvaliacao).format('DD/MM/YYYY')}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'warning.50',
                    border: '2px solid',
                    borderColor: 'warning.main',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <Rating 
                      value={a.nota} 
                      readOnly 
                      size="small" 
                      sx={{ color: 'warning.main' }} 
                    />
                    <Typography variant="body2" fontWeight="bold" color="warning.main">
                      {a.nota.toFixed(1)}
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
              
              {a.comentario && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: 'grey.50', 
                    p: 2.5, 
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      fontSize: '3rem',
                      color: 'primary.100',
                      lineHeight: 0,
                      fontFamily: 'Georgia, serif'
                    }}
                  >
                    "
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.8, 
                      fontStyle: 'italic',
                      pl: 2,
                      color: 'text.primary'
                    }}
                  >
                    {a.comentario}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
