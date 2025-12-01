import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  CircularProgress,
  IconButton,
  Autocomplete,
  TextField,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SettingsIcon from '@mui/icons-material/Settings';

import { SummaryCard } from '@/features/monitoramento-de-acidentes/components/dashboard/SummaryCard';
import MapaAcidentes from '@/features/monitoramento-de-acidentes/components/dashboard/MapaAcidentes';
import ChartAcidentesPorHorario from '@/features/monitoramento-de-acidentes/components/dashboard/ChartAcidentesPorHorario';
import PieChartAcidentes from '@/features/monitoramento-de-acidentes/components/dashboard/PieChartAcidentes';
import HeatmapAcidentes from '@/features/monitoramento-de-acidentes/components/dashboard/HeatmapAcidentes';
import { dashboardApi } from '@/features/monitoramento-de-acidentes/api/dashboard';
import { adminUsersApi, type AdminUser } from '@/features/admin/api/users.ts';
import SettingsPopup from '@/features/monitoramento-de-acidentes/components/settings/SettingsPopup';

/** Componente do seletor de usuário */
interface UserFilterSelectProps {
  users: AdminUser[];
  value: AdminUser | null;
  onChange: (value: AdminUser | null) => void;
  disabled?: boolean;
}

const UserFilterSelect: React.FC<UserFilterSelectProps> = ({
  users,
  value,
  onChange,
  disabled = false,
}) => (
  <Autocomplete
    options={users}
    getOptionLabel={(option) => option.name}
    value={value ?? null}
    onChange={(_, newValue) => onChange(newValue ?? null)}
    disabled={disabled}
    sx={{ minWidth: 250 }}
    isOptionEqualToValue={(option, val) => option.id === val.id}
    renderInput={(params) => <TextField {...params} label="Filtrar por usuário" size="small" />}
    clearOnEscape
  />
);

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [totalRegistros, setTotalRegistros] = useState(0);
  const [acidentesHoje, setAcidentesHoje] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const [acidentesMap, setAcidentesMap] = useState<
    Array<{ lat: number; lon: number; z: number; name: string }>
  >([]);

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Carrega usuários
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const data = await adminUsersApi.listar();
        setUsers(data);
      } catch (err) {
        console.error('Falha ao carregar usuários', err);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  // Carrega dados do dashboard (todos os gráficos e contadores respeitam filtro)
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoadingDashboard(true);
        const filterUserId = selectedFilter?.id ?? null;

        const [total, hoje, usuarios, localizacao] = await Promise.all([
          dashboardApi.totalRegistros(filterUserId),
          dashboardApi.acidentesHoje(filterUserId),
          adminUsersApi.contar(filterUserId), // se necessário, adaptar backend para filtrar por usuário
          dashboardApi.acidentesLocalizacao(filterUserId),
        ]);

        setTotalRegistros(total ?? 0);
        setAcidentesHoje(hoje ?? 0);
        setTotalUsuarios(usuarios ?? 0);

        const mapData = (localizacao || []).map((acidente, index) => ({
          lat: acidente.latitude,
          lon: acidente.longitude,
          z: 1,
          name: acidente.tipo || `Acidente ${index + 1}`,
        }));
        setAcidentesMap(mapData);
      } catch (err) {
        console.error('Erro ao carregar dashboard', err);
      } finally {
        setIsLoadingDashboard(false);
      }
    };
    loadDashboardData();
  }, [selectedFilter]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Loader geral */}
      {isLoadingDashboard && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Box component="main" sx={{ flexGrow: 1, transition: 'all 0.3s ease' }}>
        <Container maxWidth={false} sx={{ p: { xs: 2, md: 4 } }}>
          {/* Cabeçalho */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Monitoramento de Acidentes
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => setSettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>

              <UserFilterSelect
                users={users}
                value={selectedFilter}
                onChange={setSelectedFilter}
                disabled={isLoadingUsers}
              />
            </Box>
          </Box>

          {/* Cards de resumo */}
          <Box sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Resumo
            </Typography>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 0', minWidth: 250 }}>
                <SummaryCard
                  title="Acidentes Hoje"
                  value={acidentesHoje}
                  description="Registrados nas últimas 24h"
                  icon={DirectionsRunIcon}
                />
              </div>

              <div style={{ flex: '1 1 0', minWidth: 250 }}>
                <SummaryCard
                  title="Total de Acidentes"
                  value={totalRegistros}
                  description="Acumulado no período"
                  icon={WarningAmberIcon}
                />
              </div>

              <div style={{ flex: '1 1 0', minWidth: 250 }}>
                <SummaryCard
                  title="Idosos Monitorados"
                  value={totalUsuarios}
                  description="Usuários ativos"
                  icon={GroupsIcon}
                />
              </div>
            </div>
          </Box>

          {/* Gráficos */}
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <ChartAcidentesPorHorario userId={selectedFilter?.id ?? null} />
            </Grid>

            <Grid item xs={12}>
              <MapaAcidentes acidentesData={acidentesMap} />
            </Grid>

            <Grid item xs={12}>
              <PieChartAcidentes userId={selectedFilter?.id ?? null} />
            </Grid>

            <Grid item xs={12}>
              <HeatmapAcidentes userId={selectedFilter?.id ?? null} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Popup de configurações */}
      <SettingsPopup open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
};

export default Index;
