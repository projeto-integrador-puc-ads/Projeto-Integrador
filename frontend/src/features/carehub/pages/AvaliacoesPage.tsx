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
      />

      {/* Estatísticas de Avaliação */}
      {lista.length > 0 && (
        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={4} alignItems="center">
              {/* Média geral */}
              <Box textAlign="center" flex={1}>
                <Typography variant="h2" fontWeight="bold" mb={1}>
                  {mediaAvaliacoes.toFixed(1)}
                </Typography>
                <Rating 
                  value={mediaAvaliacoes} 
                  readOnly 
                  precision={0.1} 
                  size="large"
                  sx={{ color: '#FFD700', mb: 1 }}
                />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Baseado em {lista.length} {lista.length === 1 ? 'avaliação' : 'avaliações'}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

              {/* Distribuição de estrelas */}
              <Stack spacing={1} flex={2} width="100%">
                {distribuicao.map(({ estrelas, quantidade }) => (
                  <Stack key={estrelas} direction="row" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 20 }}>
                      {estrelas}
                    </Typography>
                    <Star fontSize="small" sx={{ color: '#FFD700' }} />
                    <Box 
                      sx={{ 
                        flex: 1, 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: '100%', 
                          width: `${lista.length > 0 ? (quantidade / lista.length) * 100 : 0}%`,
                          bgcolor: '#FFD700',
                          borderRadius: 1,
                          transition: 'width 0.3s'
                        }} 
                      />
                    </Box>
                    <Typography variant="caption" sx={{ minWidth: 30, opacity: 0.9 }}>
                      ({quantidade})
                    </Typography>
                  </Stack>
                ))}
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
              '&:hover': { 
                transform: 'translateX(4px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                <Stack direction="row" gap={2} alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48
                    }}
                  >
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {a.clienteNome || 'Cliente'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(a.dataAvaliacao).fromNow()}
                    </Typography>
                  </Box>
                </Stack>
                <Rating value={a.nota} readOnly size="medium" sx={{ color: 'warning.main' }} />
              </Stack>
              
              {a.comentario && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: 'grey.50', 
                    p: 2, 
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.7, fontStyle: 'italic' }}>
                    "{a.comentario}"
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
