import { useEffect, useState, useRef } from 'react';
import { mensagensApi } from '../api';
import http from '../libHttp';
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
import { Chat, Send, Person, Search, FilterList, Close, PlayArrow, Pause } from '@mui/icons-material';
import { Mic } from '@mui/icons-material';
import { getUserId, isCuidador, checkAndCacheUserType } from '../components/auth';

// Configurar dayjs para mostrar tempo relativo em português
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default function ChatPage() {
  // feature-level accessibility styles
  import('../components/carehub-accessibility.css');
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  
  const [userId, setUserId] = useState<number | undefined>(undefined);
  // role state removed - use helper isCuidador() when needed
  const [contatoSelecionado, setContatoSelecionado] = useState<number | undefined>(undefined);
  const [texto, setTexto] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<number | null>(null);
  const [pendingRecording, setPendingRecording] = useState<null | { file: File; url: string; duration?: number }>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [busca, setBusca] = useState(''); // Campo de busca
  const [filtroNaoLidas, setFiltroNaoLidas] = useState(false); // Filtro de não lidas

  // Carrega o userId do localStorage e verifica tipo de usuário
  useEffect(() => {
    const inicializar = async () => {
      await checkAndCacheUserType();
      const id = getUserId();
      if (id) {
        setUserId(id);
      } else {
        console.warn('⚠️ No userId found - user may not be logged in');
      }
    };
    inicializar();
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

  // Map of messageId -> local object URL for media fetched with auth header
  const [mediaObjectUrls, setMediaObjectUrls] = useState<Record<number, string>>({});
  const mediaObjectUrlsRef = useRef<Record<number, string>>({});

  // Fetch media blobs for messages that contain mediaUrl, using X-User-Id header so server can authorize
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!userId) return;
      for (const m of msgs) {
        if (m.mediaUrl && !mediaObjectUrlsRef.current[m.id]) {
          try {
            // usar axios/http para garantir Authorization header via interceptor
            const res = await http.get(m.mediaUrl, {
              responseType: 'blob',
              headers: { 'X-User-Id': String(userId) },
            });
            const blob = res.data as Blob;
            const url = URL.createObjectURL(blob);
            if (cancelled) {
              URL.revokeObjectURL(url);
              break;
            }
            setMediaObjectUrls(prev => {
              const next = { ...prev, [m.id]: url };
              mediaObjectUrlsRef.current = next;
              return next;
            });
          } catch (e) {
            console.warn('Erro ao baixar mídia da mensagem', e);
          }
        }
      }
    })();
    // Do not clear mediaObjectUrls here — clearing state in the effect cleanup
    // caused a re-fetch loop. We only mark cancelled so in-flight fetches stop.
    return () => { cancelled = true; };
  }, [msgs, userId]);

  // keep ref in sync with state
  useEffect(() => {
    mediaObjectUrlsRef.current = mediaObjectUrls;
  }, [mediaObjectUrls]);

  // On unmount revoke all created object URLs and clear state
  useEffect(() => {
    return () => {
      try {
        Object.values(mediaObjectUrlsRef.current).forEach(u => {
          try { URL.revokeObjectURL(u); } catch { /* ignore */ }
        });
      } finally {
        // best-effort clear
        mediaObjectUrlsRef.current = {};
      }
    };
  }, []);

  // Small audio player component (inline)
  function formatTime(seconds: number | undefined | null) {
    if (!seconds && seconds !== 0) return '--';
    const s = Math.floor(seconds || 0);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function AudioPlayer({ src, inverted = false }: { src: string; inverted?: boolean }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState<number | null>(null);
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
      const a = new Audio(src);
      audioRef.current = a;
      const onTime = () => setCurrent(a.currentTime);
      const onPlay = () => setPlaying(true);
      const onPause = () => setPlaying(false);
      const onEnded = () => { setPlaying(false); setCurrent(0); };
      const onLoaded = () => setDuration(a.duration || 0);
      a.addEventListener('timeupdate', onTime);
      a.addEventListener('play', onPlay);
      a.addEventListener('pause', onPause);
      a.addEventListener('ended', onEnded);
      a.addEventListener('loadedmetadata', onLoaded);
      return () => {
        a.pause();
        a.removeEventListener('timeupdate', onTime);
        a.removeEventListener('play', onPlay);
        a.removeEventListener('pause', onPause);
        a.removeEventListener('ended', onEnded);
        a.removeEventListener('loadedmetadata', onLoaded);
        audioRef.current = null;
      };
    }, [src]);

    const toggle = () => {
      const a = audioRef.current;
      if (!a) return;
      if (playing) a.pause(); else a.play();
    };

    const toggleSpeed = () => {
      const rates = [1, 1.5, 2];
      const currentIndex = rates.indexOf(playbackRate);
      const nextRate = rates[(currentIndex + 1) % rates.length];
      setPlaybackRate(nextRate);
      if (audioRef.current) audioRef.current.playbackRate = nextRate;
    };

    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
      const a = audioRef.current;
      if (!a || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      a.currentTime = percent * duration;
    };

    // Gera waveform visual simples (barras aleatórias estilizadas)
    const waveformBars = Array.from({ length: 28 }, (_, i) => {
      const seed = src.charCodeAt(i % src.length) + i;
      const height = 20 + ((seed % 30) / 30) * 80;
      return height;
    });

    const progress = duration ? (current / duration) * 100 : 0;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 240 }}>
        <IconButton
          size="small"
          onClick={toggle}
          sx={{
            bgcolor: inverted ? 'rgba(255,255,255,0.15)' : 'primary.main',
            color: inverted ? 'white' : 'white',
            width: 36,
            height: 36,
            boxShadow: inverted ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              bgcolor: inverted ? 'rgba(255,255,255,0.25)' : 'primary.dark',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s'
          }}
        >
          {playing ? <Pause sx={{ fontSize: 20 }} /> : <PlayArrow sx={{ fontSize: 20 }} />}
        </IconButton>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Waveform visual estilo WhatsApp */}
          <Box 
            onClick={seek}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.4, 
              height: 32, 
              cursor: 'pointer',
              mb: 0.5,
              '&:hover .waveform-bar': {
                opacity: 0.8
              }
            }}
          >
            {waveformBars.map((height, i) => (
              <Box
                key={i}
                className="waveform-bar"
                sx={{
                  flex: 1,
                  height: `${height}%`,
                  maxHeight: 32,
                  bgcolor: (i / waveformBars.length * 100) < progress 
                    ? (inverted ? 'rgba(255,255,255,0.9)' : 'primary.main')
                    : (inverted ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'),
                  borderRadius: 1,
                  transition: 'all 0.15s',
                  transform: playing && (i / waveformBars.length * 100) < progress ? 'scaleY(1.1)' : 'scaleY(1)'
                }}
              />
            ))}
          </Box>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: 11,
                fontWeight: 500,
                color: inverted ? 'rgba(255,255,255,0.85)' : 'text.secondary'
              }}
            >
              {playing ? formatTime(current) : formatTime(duration)}
            </Typography>
            
            {/* Botão de velocidade estilo WhatsApp */}
            <Chip
              label={`${playbackRate}x`}
              size="small"
              onClick={toggleSpeed}
              sx={{
                height: 18,
                fontSize: 10,
                fontWeight: 'bold',
                bgcolor: inverted ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                color: inverted ? 'white' : 'text.secondary',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: inverted ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)'
                },
                transition: 'all 0.2s'
              }}
            />
          </Stack>
        </Box>
      </Box>
    );
  }

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
    onError: (error: any) => {
      const msg = error?.message || 'Erro ao enviar mensagem';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  const enviar = () => {
    if (!texto.trim()) {
      enqueueSnackbar('Digite uma mensagem', { variant: 'warning' });
      return;
    }
    enviarMutation.mutate();
  };

  // Upload de mídia (áudio)
  const handleFileUpload = async (file?: File) => {
    if (!userId || !contatoSelecionado || !file) return;
    try {
      return await mensagensApi.uploadMedia(userId, contatoSelecionado, file);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Erro ao enviar mídia', { variant: 'error' });
      throw err;
    } finally {
      queryClient.invalidateQueries({ queryKey: ['mensagens', userId, contatoSelecionado] });
      queryClient.invalidateQueries({ queryKey: ['contatos', userId] });
    }
  };

  // Recording handlers (MediaRecorder)
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      enqueueSnackbar('Seu navegador não suporta gravação de áudio.', { variant: 'error' });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        try {
          const blob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || 'audio/webm' });
          const filename = `audio-${Date.now()}.webm`;
          const file = new File([blob], filename, { type: blob.type });
          const url = URL.createObjectURL(blob);

          // compute duration
          let duration: number | undefined = undefined;
          try {
            const audio = new Audio(url);
            await new Promise<void>((res) => {
              audio.addEventListener('loadedmetadata', () => {
                duration = audio.duration;
                res();
              });
              // fallback timeout
              setTimeout(() => res(), 1500);
            });
          } catch (e) {
            // ignore
          }

          setPendingRecording({ file, url, duration });
        } catch (err) {
          console.warn('Erro no onstop do MediaRecorder', err);
        }
        // stop all tracks
        stream.getTracks().forEach(t => t.stop());
        mediaRecorderRef.current = null;
        setIsRecording(false);
        // stop timer
        if (recordingIntervalRef.current) {
          window.clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }
        setRecordingTime(0);
      };
      mr.start();
      setIsRecording(true);
      setRecordingTime(0);
      // start timer
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (err: any) {
      enqueueSnackbar('Permissão de microfone negada ou erro ao acessar microfone.', { variant: 'error' });
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    } else {
      setIsRecording(false);
    }
  };

  const sendPendingRecording = async () => {
    if (!pendingRecording || !userId || !contatoSelecionado) return;
    setSendingMedia(true);
    const tempId = -Date.now();
    const optimistic = {
      id: tempId,
      remetenteId: userId,
      destinatarioId: contatoSelecionado,
      mediaUrl: pendingRecording.url,
      conteudo: null,
      dataEnvio: new Date().toISOString()
    };
    setOptimisticMessages(prev => [...prev, optimistic]);
    try {
      await handleFileUpload(pendingRecording.file);
      // remove optimistic message after upload success
      setOptimisticMessages(prev => prev.filter(m => m.id !== tempId));
      setPendingRecording(null);
      // after upload, queries will be invalidated in handleFileUpload
      queryClient.invalidateQueries({ queryKey: ['mensagens', userId, contatoSelecionado] });
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Erro ao enviar áudio', { variant: 'error' });
      setOptimisticMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSendingMedia(false);
    }
  };

  const cancelPendingRecording = () => {
    if (pendingRecording) {
      URL.revokeObjectURL(pendingRecording.url);
      setPendingRecording(null);
    }
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
      
      // Se o usuário logado for cuidador, escondemos outros cuidadores da lista (mostrar apenas clientes)
      const isUserCuidador = isCuidador();
      const perfilLower = (contato.perfil || '').toLowerCase();
      const hideBecauseRole = isUserCuidador ? perfilLower.includes('cuidador') : false;
      return matchBusca && matchNaoLidas && !hideBecauseRole;
    });

  const contatoAtual = contatos.find(c => c.id === contatoSelecionado);

  // Combine server messages with optimistic local messages and sort by date
  const displayMessages = [...(msgs || []), ...optimisticMessages]
    .slice()
    .sort((a, b) => new Date(a.dataEnvio).getTime() - new Date(b.dataEnvio).getTime());

  return (
    <Stack gap={{ xs: 1.5, sm: 2, md: 3 }} sx={{ p: { xs: 1, sm: 1.5, md: 2 }, height: '100%' }}>
      {/* Header */}
      <PageHeader 
        title="Mensagens"
        subtitle={isCuidador() ? 'Converse com seus clientes' : 'Converse com cuidadores e clientes'}
        backTo="/carehub"
      />

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 1, md: 2 }, 
        height: { xs: 'calc(100vh - 180px)', sm: 'calc(100vh - 200px)', md: 'calc(100vh - 250px)' },
        minHeight: { xs: 400, sm: 500 }
      }}>
        {/* Lista de Contatos */}
        <Box sx={{ 
          width: { xs: '100%', md: '320px', lg: '350px' }, 
          minWidth: { md: '280px' },
          display: { xs: contatoSelecionado ? 'none' : 'flex', md: 'flex' },
          flexDirection: 'column',
          height: { xs: '100%', md: 'auto' },
          maxHeight: { xs: 'none', md: '100%' }
        }}>
          <Paper variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'primary.main', color: 'white', flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}>Conversas</Typography>
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
          display: { xs: contatoSelecionado ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          minWidth: 0,
          height: { xs: '100%', md: 'auto' },
          overflow: 'hidden'
        }}>
          <Stack sx={{ height: '100%', overflow: 'hidden' }} gap={{ xs: 1, sm: 1.5, md: 2 }}>
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
                <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
                  <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 2 }}>
                    <Button
                      variant="text"
                      onClick={() => setContatoSelecionado(undefined)}
                      sx={{ 
                        display: { xs: 'flex', md: 'none' }, 
                        minWidth: 'auto',
                        p: 0.5,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}
                    >
                      ← Voltar
                    </Button>
                    <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>
                      <Person sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {contatoAtual?.nome}
                      </Typography>
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
                      p: { xs: 1, sm: 1.5, md: 2 }, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: { xs: 1, sm: 1.5 },
                      bgcolor: 'grey.50',
                      backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(0,0,0,0.02) 100%)',
                      borderRadius: 2,
                      minHeight: 0
                    }}
                  >
                    {displayMessages.map(m => (
                      <Box 
                        key={m.id} 
                        sx={{ 
                          alignSelf: m.remetenteId === userId ? 'flex-end' : 'flex-start', 
                          maxWidth: { xs: '85%', sm: '75%', md: '70%' },
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
                          {m.mediaUrl ? (
                            (() => {
                              const mediaSrc = m.id < 0 ? m.mediaUrl : mediaObjectUrls[m.id];
                              return mediaSrc ? (
                                <AudioPlayer src={mediaSrc} inverted={m.remetenteId === userId} />
                              ) : (
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
                                  <CircularProgress size={16} sx={{ color: m.remetenteId === userId ? 'rgba(255,255,255,0.7)' : 'primary.main' }} />
                                  <Typography variant="caption" sx={{ fontSize: 11, opacity: 0.8 }}>Carregando áudio...</Typography>
                                </Stack>
                              );
                            })()
                          ) : (
                            m.conteudo && (
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {m.conteudo}
                              </Typography>
                            )
                          )}
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            {m.id < 0 && <CircularProgress size={14} color="inherit" />}
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                opacity: 0.7, 
                                fontSize: 10
                              }}
                            >
                              {dayjs(m.dataEnvio).format('DD/MM HH:mm')}
                            </Typography>
                          </Box>
                        </Paper>
                      </Box>
                    ))}
                  </Paper>
                )}

                {/* Input */}
                <Card variant="outlined" sx={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                  <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1, sm: 1.5, md: 2 } } }}>
                    {/* Pending recording preview - layout responsivo */}
                    {pendingRecording && (
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'center' }, 
                          gap: { xs: 1, sm: 2 }, 
                          mb: 1.5,
                          p: { xs: 1, sm: 1.25 }, 
                          borderRadius: 2, 
                          bgcolor: 'grey.100'
                        }}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <AudioPlayer src={pendingRecording.url} />
                          <Typography variant="caption" color="text.secondary">
                            {pendingRecording.duration ? formatTime(pendingRecording.duration) : `${recordingTime}s`}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-end', sm: 'flex-start' }}>
                          <Button size="small" variant="contained" onClick={sendPendingRecording} disabled={sendingMedia}>
                            {sendingMedia ? 'Enviando...' : 'Enviar'}
                          </Button>
                          <Button size="small" variant="text" onClick={cancelPendingRecording}>
                            Cancelar
                          </Button>
                        </Stack>
                      </Paper>
                    )}
                    
                    <Stack direction="row" gap={{ xs: 0.5, sm: 1 }} alignItems="flex-end" flexWrap="nowrap">
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
                          flex: 1,
                          minWidth: 0,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          },
                          '& .MuiInputBase-input': {
                            p: { xs: '8px 12px', sm: '8.5px 14px' }
                          }
                        }}
                      />
                      {/* Botões de ação */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 }, flexShrink: 0 }}>
                        <IconButton
                          title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
                          color={isRecording ? 'error' : 'default'}
                          onClick={() => {
                            if (isRecording) stopRecording(); else startRecording();
                          }}
                          size="small"
                          sx={{ p: { xs: 0.75, sm: 1 } }}
                        >
                          <Mic sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        </IconButton>
                        {isRecording && (
                          <Chip 
                            label={`${recordingTime}s`} 
                            size="small" 
                            color="error" 
                            sx={{ display: { xs: 'none', sm: 'flex' } }} 
                          />
                        )}
                      </Box>
                      <Button 
                        variant="contained" 
                        onClick={enviar} 
                        disabled={enviarMutation.isPending || !texto.trim()}
                        endIcon={<Send sx={{ fontSize: { xs: 16, sm: 20 }, display: { xs: 'none', sm: 'block' } }} />}
                        sx={{ 
                          minWidth: { xs: 'auto', sm: 100, md: 110 },
                          borderRadius: 2,
                          py: { xs: 0.8, sm: 1, md: 1.2 },
                          px: { xs: 1.5, sm: 2, md: 2.5 },
                          textTransform: 'none',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9375rem' },
                          flexShrink: 0
                        }}
                      >
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Enviar</Box>
                        <Send sx={{ fontSize: 18, display: { xs: 'block', sm: 'none' } }} />
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
