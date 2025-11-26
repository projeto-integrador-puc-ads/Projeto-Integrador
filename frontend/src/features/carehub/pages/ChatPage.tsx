import { useEffect, useState } from 'react';
import { mensagensApi } from '../api';
import { listarContatos, marcarConversaComoLida } from '../api/mensagens';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemText, 
  Avatar, 
  Divider,
  Badge,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageHeader } from '../components/PageHeader';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import { Chat, Send, Person, Search, FilterList, Close } from '@mui/icons-material';
import { getUserId } from '../components/auth';

// Configurar dayjs para mostrar tempo relativo em português
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default function ChatPage() {
  // feature-level accessibility styles
  import('../components/carehub-accessibility.css');
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [contatoSelecionado, setContatoSelecionado] = useState<number | undefined>(undefined);
  const [texto, setTexto] = useState('');
  const [busca, setBusca] = useState(''); // Campo de busca
  const [filtroNaoLidas, setFiltroNaoLidas] = useState(false); // Filtro de não lidas

  // Carrega o userId do localStorage
  useEffect(() => {
    const id = getUserId();
    if (id) {
      setUserId(id);
    } else {
      console.warn('⚠️ No userId found - user may not be logged in');
    }
  }, []);

  // Busca lista de contatos (pessoas com quem já trocou mensagens)
  const { data: contatos = [], isLoading: loadingContatos } = useQuery({
    queryKey: ['contatos', userId],
    queryFn: () => listarContatos(userId!),
    enabled: !!userId,
    refetchInterval: 10000, // Atualiza a cada 10 segundos
  });

  // Fetch conversa com polling a cada 5s
  const { data: msgs = [], isLoading, isError } = useQuery({
    queryKey: ['mensagens', userId, contatoSelecionado],
    queryFn: async () => {
      if (!userId || !contatoSelecionado) return [];
      const mensagens = await mensagensApi.conversa(userId, contatoSelecionado);
      
      // Marca mensagens como lidas quando abre a conversa
      if (mensagens.length > 0) {
        await marcarConversaComoLida(userId, contatoSelecionado);
        // Invalida o contador de não lidas para atualizar o badge
        queryClient.invalidateQueries({ queryKey: ['mensagens-nao-lidas', userId] });
      }
      
      return mensagens;
    },
    enabled: !!(userId && contatoSelecionado),
    refetchInterval: 5000, // Auto-refresh a cada 5s
  });

  const enviarMutation = useMutation({
    mutationFn: () => {
      if (!userId || !contatoSelecionado || !texto) throw new Error('Dados incompletos');
      return mensagensApi.enviar(userId, { destinatarioId: contatoSelecionado, conteudo: texto });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensagens', userId, contatoSelecionado] });
      queryClient.invalidateQueries({ queryKey: ['mensagens-nao-lidas', userId] });
      queryClient.invalidateQueries({ queryKey: ['contatos', userId] });
      setTexto('');
    },
    onError: () => {
      enqueueSnackbar('Erro ao enviar mensagem', { variant: 'error' });
    },
  });

  const enviar = () => {
    if (!texto.trim()) {
      enqueueSnackbar('Digite uma mensagem', { variant: 'warning' });
      return;
    }
    enviarMutation.mutate();
  };

  // Filtra e ordena contatos
  const contatosFiltrados = contatos
    .filter(contato => {
      // Filtro de busca por nome
      const matchBusca = busca === '' || 
        contato.nome.toLowerCase().includes(busca.toLowerCase());
      
      // Filtro de mensagens não lidas
      const matchNaoLidas = !filtroNaoLidas || 
        (contato.mensagensNaoLidas && contato.mensagensNaoLidas > 0);
      
      return matchBusca && matchNaoLidas;
    });

  const contatoAtual = contatos.find(c => c.id === contatoSelecionado);

  return (
    <Stack gap={3} sx={{ p: 2 }}>
      {/* Header */}
      <PageHeader 
        title="Mensagens"
        subtitle="Converse com cuidadores e clientes"
        backTo="/carehub"
      />

      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 250px)' }}>
        {/* Lista de Contatos */}
        <Box sx={{ 
          width: { xs: '100%', md: '350px' }, 
          display: { xs: contatoSelecionado ? 'none' : 'block', md: 'block' } 
        }}>
          <Paper variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">Conversas</Typography>
              <Typography variant="caption">
                {contatosFiltrados.length} {contatosFiltrados.length === 1 ? 'contato' : 'contatos'}
                {filtroNaoLidas && ' não lidas'}
              </Typography>
            </Box>
            
            {/* Campo de Busca e Filtro */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar contato..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: busca && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setBusca('')}>
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 1 }}
              />
              
              <Chip
                icon={<FilterList />}
                label={filtroNaoLidas ? 'Mostrar todas' : 'Apenas não lidas'}
                onClick={() => setFiltroNaoLidas(!filtroNaoLidas)}
                color={filtroNaoLidas ? 'primary' : 'default'}
                size="small"
                variant={filtroNaoLidas ? 'filled' : 'outlined'}
              />
            </Box>
            
            {loadingContatos && (
              <Stack alignItems="center" p={4}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary" mt={2}>
                  Carregando conversas...
                </Typography>
              </Stack>
            )}
            
            {!loadingContatos && contatosFiltrados.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Chat sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  {contatos.length === 0 
                    ? 'Nenhuma conversa ainda' 
                    : 'Nenhum contato encontrado'}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {contatos.length === 0 
                    ? 'Envie uma mensagem para começar'
                    : 'Tente ajustar os filtros de busca'}
                </Typography>
              </Box>
            )}
            
            <List sx={{ p: 0, overflow: 'auto', flex: 1 }}>
              {contatosFiltrados.map((contato) => (
                <Box key={contato.id}>
                  <ListItemButton
                    selected={contatoSelecionado === contato.id}
                    onClick={() => setContatoSelecionado(contato.id)}
                    sx={{
                      py: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        }
                      }
                    }}
                  >
                    <Badge
                      badgeContent={contato.mensagensNaoLidas || 0}
                      color="error"
                      overlap="circular"
                      invisible={!contato.mensagensNaoLidas || contato.mensagensNaoLidas === 0}
                      sx={{ mr: 2 }}
                    >
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                    </Badge>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography 
                            variant="body1" 
                            fontWeight={contato.mensagensNaoLidas ? 'bold' : 'medium'}
                          >
                            {contato.nome}
                          </Typography>
                          {contato.dataUltimaMensagem && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ ml: 1, whiteSpace: 'nowrap' }}
                            >
                              {dayjs(contato.dataUltimaMensagem).fromNow()}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="caption" 
                            color="primary"
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            {contato.perfil}
                          </Typography>
                          {contato.ultimaMensagem && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              fontWeight={contato.mensagensNaoLidas ? 'bold' : 'normal'}
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {contato.ultimaMensagem}
                            </Typography>
                          )}
                        </Box>
                      }
                      primaryTypographyProps={{ component: 'div' }}
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItemButton>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Área de Chat */}
        <Box sx={{ 
          flex: 1, 
          display: { xs: contatoSelecionado ? 'block' : 'none', md: 'block' } 
        }}>
          <Stack sx={{ height: '100%' }} gap={2}>
            {!contatoSelecionado && (
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderStyle: 'dashed'
                }}
              >
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Chat sx={{ fontSize: 72, color: 'primary.main', opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Selecione uma conversa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Escolha um contato na lista ao lado para começar
                  </Typography>
                </Box>
              </Card>
            )}

            {contatoSelecionado && (
              <>
                {/* Header da Conversa */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Button
                      variant="text"
                      onClick={() => setContatoSelecionado(undefined)}
                      sx={{ display: { xs: 'block', md: 'none' }, minWidth: 'auto' }}
                    >
                      ← Voltar
                    </Button>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{contatoAtual?.nome}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contatoAtual?.perfil}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Loading */}
                {isLoading && (
                  <Stack alignItems="center" flex={1} justifyContent="center">
                    <CircularProgress size={48} />
                    <Typography variant="body2" color="text.secondary" mt={2}>
                      Carregando mensagens...
                    </Typography>
                  </Stack>
                )}

                {/* Error */}
                {isError && (
                  <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                    <CardContent>
                      <Typography>Erro ao carregar mensagens. Verifique sua conexão.</Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Empty */}
                {!isLoading && msgs.length === 0 && (
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      py: 8, 
                      textAlign: 'center', 
                      flex: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderStyle: 'dashed',
                      bgcolor: 'background.default'
                    }}
                  >
                    <Box>
                      <Chat sx={{ fontSize: 72, color: 'primary.main', opacity: 0.3, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nenhuma mensagem ainda
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Inicie a conversa enviando uma mensagem abaixo!
                      </Typography>
                    </Box>
                  </Card>
                )}

                {/* Chat area */}
                {!isLoading && msgs.length > 0 && (
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      flex: 1, 
                      overflowY: 'auto', 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1.5,
                      bgcolor: 'grey.50',
                      backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(0,0,0,0.02) 100%)',
                      borderRadius: 2
                    }}
                  >
                    {msgs.map(m => (
                      <Box 
                        key={m.id} 
                        sx={{ 
                          alignSelf: m.remetenteId === userId ? 'flex-end' : 'flex-start', 
                          maxWidth: '70%',
                          animation: 'fadeIn 0.3s ease-in'
                        }}
                      >
                        <Paper
                          elevation={1}
                          sx={{ 
                            background: m.remetenteId === userId 
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                              : 'white', 
                            color: m.remetenteId === userId ? 'white' : 'text.primary',
                            p: 1.5, 
                            borderRadius: 2,
                            borderBottomRightRadius: m.remetenteId === userId ? 4 : 16,
                            borderBottomLeftRadius: m.remetenteId === userId ? 16 : 4,
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            {m.conteudo}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              opacity: 0.7, 
                              fontSize: 10, 
                              mt: 0.5, 
                              display: 'block',
                              textAlign: 'right'
                            }}
                          >
                            {dayjs(m.dataEnvio).format('DD/MM HH:mm')}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Paper>
                )}

                {/* Input */}
                <Card variant="outlined" sx={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }}>
                  <CardContent>
                    <Stack direction="row" gap={1} alignItems="flex-end">
                      <TextField 
                        fullWidth 
                        size="small" 
                        value={texto} 
                        onChange={(e) => setTexto(e.target.value)} 
                        placeholder="Digite sua mensagem..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            enviar();
                          }
                        }}
                        multiline
                        maxRows={3}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                      <Button 
                        variant="contained" 
                        onClick={enviar} 
                        disabled={enviarMutation.isPending || !texto.trim()}
                        endIcon={<Send />}
                        sx={{ 
                          minWidth: 110,
                          borderRadius: 2,
                          py: 1.2,
                          textTransform: 'none',
                          fontWeight: 'bold'
                        }}
                      >
                        Enviar
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
