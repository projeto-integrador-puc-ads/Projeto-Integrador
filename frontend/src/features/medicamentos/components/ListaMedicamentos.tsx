// src/features/medicamentos/pages/ListaMedicamentosPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Stack, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { loadMedicamentos, registrarTomada, loadHistorico } from '../service/medicamentoService';
import type { Medicamento } from '../service/medicamentoService';

const STORAGE_KEY = 'medmod:medicamentos';

export default function ListaMedicamentosPage() {
  const navigate = useNavigate();
  const [lista, setLista] = useState<Medicamento[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = () => {
    setLista(loadMedicamentos());
    setHistorico(loadHistorico());
  };

  useEffect(() => {
    loadAll();
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY || ev.key === 'medmod:medicamentos_history') loadAll();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 🔥 Converter horário texto → minutos absolutos
  const getMinutesFromHourString = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  // 🔥 Pega o próximo horário real do medicamento
  const getProximoHorario = (med: Medicamento): string | null => {
    if (!med.horarios || med.horarios.length === 0) return null;

    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    const futuros = med.horarios
      .map(h => ({ hora: h, minutos: getMinutesFromHourString(h) }))
      .filter(h => h.minutos >= minutosAgora);

    if (futuros.length === 0) return med.horarios[0]; // se já passou tudo, pega o primeiro do dia seguinte

    return futuros[0].hora;
  };

  // 🔥 Retorna quantos minutos faltam para o próximo horário
  const getMinutosAteProximo = (med: Medicamento): number => {
    const proximo = getProximoHorario(med);
    if (!proximo) return Infinity;

    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    return getMinutesFromHourString(proximo) - minutosAgora;
  };

  // 🔥 Ordenar lista pelo horário mais próximo
  const listaOrdenada = useMemo(() => {
    return [...lista].sort((a, b) => {
      return getMinutosAteProximo(a) - getMinutosAteProximo(b);
    });
  }, [lista]);

  // Quando foi tomado hoje
  const isSameLocalDay = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    } catch {
      return false;
    }
  };

  const tomadosHoje = useMemo(() => {
    const set = new Set<string>();
    for (const h of historico) {
      if (h.medicamentoId && isSameLocalDay(h.takenAt)) {
        set.add(String(h.medicamentoId));
      }
    }
    return set;
  }, [historico]);

  // 🔥 Formatar contagem regressiva
  const formatCountdown = (min: number) => {
    if (min === Infinity) return "";
    if (min <= 0) return "Agora";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h === 0) return `Faltam ${m} min`;
    return `Faltam ${h}h ${m}min`;
  };

  const onTomar = (medId?: string) => {
    if (!medId) return;
    if (!confirm('Deseja registrar que tomou este medicamento agora?')) return;

    setLoading(true);
    try {
      const res = registrarTomada(medId);
      if (!res) {
        alert('Erro ao registrar tomada (medicamento não encontrado).');
      }
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao registrar.');
    } finally {
      loadAll();
      setLoading(false);
    }
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (!confirm('Remover este medicamento?')) return;
    try {
      const meds = loadMedicamentos().filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meds));
      setLista(meds);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ py: 4, px: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 980, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 700, color: 'primary.main' }}>
              Medicamentos Cadastrados
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/medicamentos/historico')}>Histórico</Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/medicamentos/cadastro')}>Novo</Button>
            </Stack>
          </Stack>

          {listaOrdenada.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#e9f3ff', borderRadius: 2, border: '1px dashed #9ec9ff' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: 'primary.main', mb: 1 }}>Nenhum medicamento cadastrado</Typography>
              <Typography sx={{ fontSize: 16, color: 'text.secondary', mb: 3 }}>
                Comece cadastrando seu primeiro medicamento para gerenciar seus horários.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/medicamentos/cadastro')} startIcon={<AddIcon />}>+ Cadastrar Medicamento</Button>
            </Box>
          ) : (
            <List>
              {listaOrdenada.map((m, i) => {
                const remaining = Number(m.quantidadeTotal ?? 0);
                const amountLabel = m.tipo === 'liquido' ? `${remaining} ml` : `${remaining} comprimidos`;

                const alreadyTakenToday = m.id ? tomadosHoje.has(String(m.id)) : false;

                const proximo = getProximoHorario(m);
                const minutosAte = getMinutosAteProximo(m);
                const countdown = formatCountdown(minutosAte);

                const destaque = i === 0 ? {
                  bgcolor: "#fff7e6",
                  borderLeft: "6px solid #ff9800"
                } : {};

                return (
                  <React.Fragment key={m.id ?? Math.random()}>
                    <ListItem
                      sx={{ py: 2, ...destaque }}
                      secondaryAction={
                        <Stack direction="row" spacing={1} alignItems="center">
                          {alreadyTakenToday ? (
                            <Button
                              startIcon={<CheckCircleOutlineIcon />}
                              variant="contained"
                              color="success"
                              sx={{ fontSize: 16, px: 2, minHeight: 44 }}
                              disabled
                            >
                              Tomado
                            </Button>
                          ) : (
                            <Button
                              onClick={() => onTomar(m.id)}
                              startIcon={<CheckCircleOutlineIcon />}
                              variant="contained"
                              color="primary"
                              sx={{ fontSize: 16, px: 2, minHeight: 44 }}
                              disabled={loading}
                            >
                              Marcar como tomado
                            </Button>
                          )}

                          <IconButton onClick={() => navigate('/medicamentos/cadastro', { state: { medicamento: m } })}>
                            <EditIcon />
                          </IconButton>

                          <IconButton onClick={() => handleDelete(m.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                            {m.nome}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: 16, color: 'text.secondary' }}>
                            {m.tipo ? `${m.tipo} • ` : ''}
                            <strong style={{ fontSize: 18 }}>{amountLabel}</strong>
                            {` • Próximo: ${proximo}`}
                            {countdown ? ` • ${countdown}` : ""}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
