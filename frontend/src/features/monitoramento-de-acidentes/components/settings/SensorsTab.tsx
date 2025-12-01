import React, { useState, useEffect } from 'react';
import {
  Typography,
  Switch,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SaveIcon from '@mui/icons-material/Save';

import { type AdminUser } from '@/features/admin/api/users.ts';
import { sensorConfigApi } from '@/features/monitoramento-de-acidentes/api/sensorConfig';
import { GeofenceMap } from './GeofenceMap';

interface SensorConfig {
  geofence: {
    enabled: boolean;
    centerLat: number;
    centerLon: number;
    radiusMeters: number;
  };
  fall: {
    enabled: boolean;
    sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  immobility: {
    enabled: boolean;
    timeLimitMs: number;
  };
}

interface SensorsTabProps {
  users: AdminUser[];
  isLoadingUsers: boolean;
}

export const SensorsTab: React.FC<SensorsTabProps> = ({ users, isLoadingUsers }) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [config, setConfig] = useState<SensorConfig>({
    geofence: { enabled: false, centerLat: 0, centerLon: 0, radiusMeters: 100 },
    fall: { enabled: true, sensitivity: 'MEDIUM' },
    immobility: { enabled: true, timeLimitMs: 86400 * 1000 },
  });
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadConfig = async () => {
      if (!selectedUser) return;
      try {
        setIsLoadingConfig(true);
        const userConfig = await sensorConfigApi.obter(selectedUser.id);

        // Sempre usar valores fixos para geofence
        const geofence = {
          enabled: userConfig.geofence.enabled, // apenas o enabled vem do banco
          centerLat: -16.680882,               // valor fixo
          centerLon: -49.2532691,              // valor fixo
          radiusMeters: 0,                      // valor fixo
        };

        setConfig({ ...userConfig, geofence });
        setMapCenter({ lat: geofence.centerLat, lng: geofence.centerLon });
      } catch (err) {
        console.error(err);
        setToast({ open: true, message: 'Não foi possível carregar a configuração do usuário', severity: 'error' });
      } finally {
        setIsLoadingConfig(false);
      }
    };
    loadConfig();
  }, [selectedUser]);

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      setIsSaving(true);
      await sensorConfigApi.atualizar(selectedUser.id, config);
      setToast({ open: true, message: 'Configurações salvas com sucesso!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Erro ao salvar configurações', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseToast = () => setToast({ ...toast, open: false });
  const isDisabled = !selectedUser || isLoadingConfig;
  const secondaryColor = '#D5D5D5';

  const cardStyle: React.CSSProperties = {
    width: '100%',
    background: secondaryColor,
    padding: '20px',
    marginBottom: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  };

  const flexBetween: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const inputGroup: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5' }}>
      {/* Autocomplete usuário */}
      <div style={{ marginBottom: '24px', minWidth: 250 }}>
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.name}
          value={selectedUser}
          onChange={(_, newValue) => setSelectedUser(newValue)}
          disabled={isLoadingUsers}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          renderInput={(params) => <TextField {...params} label="Filtrar por usuário" size="small" />}
          clearOnEscape
        />
      </div>

      {isLoadingConfig ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Geofence Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapIcon />
              <Typography variant="h6">Cerca Geográfica</Typography>
            </div>

            <div style={flexBetween}>
              <Typography>Ativar cerca geográfica</Typography>
              <Switch
                checked={config.geofence.enabled}
                onChange={(e) =>
                  setConfig({ ...config, geofence: { ...config.geofence, enabled: e.target.checked } })
                }
                disabled={isDisabled}
                sx={{ '& .Mui-checked': { color: '#3178c8' } }}
              />
            </div>

            {config.geofence.enabled && (
              <>
                <TextField
                  label="Pesquisar endereço"
                  value={addressQuery}
                  onChange={(e) => setAddressQuery(e.target.value)}
                  fullWidth
                  style={{ marginBottom: '16px' }}
                  placeholder="Digite um endereço"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      try {
                        const response = await fetch(
                          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                            addressQuery
                          )}&key=${import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}`
                        );
                        const data = await response.json();
                        if (data.results && data.results.length > 0) {
                          const location = data.results[0].geometry.location;
                          setMapCenter({ lat: location.lat, lng: location.lng });
                          setConfig({
                            ...config,
                            geofence: {
                              ...config.geofence,
                              centerLat: location.lat,
                              centerLon: location.lng,
                            },
                          });
                          setToast({ open: true, message: 'Endereço localizado!', severity: 'success' });
                        } else {
                          setToast({ open: true, message: 'Endereço não encontrado.', severity: 'error' });
                        }
                      } catch (err) {
                        console.error(err);
                        setToast({ open: true, message: 'Erro ao buscar endereço.', severity: 'error' });
                      }
                    }
                  }}
                />

                <div style={inputGroup}>
                  <TextField label="Latitude" value={mapCenter.lat} disabled fullWidth />
                  <TextField label="Longitude" value={mapCenter.lng} disabled fullWidth />
                </div>

                <GeofenceMap
                  centerLat={mapCenter.lat}
                  centerLon={mapCenter.lng}
                  radiusMeters={config.geofence.radiusMeters}
                  onLocationSelect={(lat, lon) => {
                    setMapCenter({ lat, lng: lon });
                    setConfig({
                      ...config,
                      geofence: { ...config.geofence, centerLat: lat, centerLon: lon },
                    });
                  }}
                />

                <TextField
                  label="Raio (metros)"
                  type="number"
                  value={config.geofence.radiusMeters}
                  onChange={(e) =>
                    setConfig({ ...config, geofence: { ...config.geofence, radiusMeters: +e.target.value } })
                  }
                  fullWidth
                  style={{ marginTop: '16px' }}
                />
              </>
            )}
          </div>

          {/* Fall Detection Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <WarningIcon />
              <Typography variant="h6">Detecção de Queda</Typography>
            </div>
            <div style={flexBetween}>
              <Typography>Ativar detecção de queda</Typography>
              <Switch
                checked={config.fall.enabled}
                onChange={(e) => setConfig({ ...config, fall: { ...config.fall, enabled: e.target.checked } })}
                disabled={isDisabled}
                sx={{ '& .Mui-checked': { color: '#3178c8' } }}
              />
            </div>
            {config.fall.enabled && (
              <div>
                <Typography>Sensibilidade</Typography>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                    <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="radio"
                        value={level}
                        checked={config.fall.sensitivity === level}
                        onChange={(e) =>
                          setConfig({ ...config, fall: { ...config.fall, sensitivity: e.target.value as any } })
                        }
                        disabled={isDisabled}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Immobility Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AccessTimeIcon />
              <Typography variant="h6">Detecção de Imobilidade</Typography>
            </div>
            <div style={flexBetween}>
              <Typography>Ativar detecção de imobilidade</Typography>
              <Switch
                checked={config.immobility.enabled}
                onChange={(e) =>
                  setConfig({ ...config, immobility: { ...config.immobility, enabled: e.target.checked } })
                }
                disabled={isDisabled}
                sx={{ '& .Mui-checked': { color: '#3178c8' } }}
              />
            </div>
            {config.immobility.enabled && (
              <TextField
                label="Tempo Limite (minutos)"
                type="number"
                fullWidth
                value={Math.round(config.immobility.timeLimitMs / 60000)}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    immobility: { ...config.immobility, timeLimitMs: +e.target.value * 60000 },
                  })
                }
              />
            )}
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaving || isDisabled}
            >
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </>
      )}

      {/* Snackbar Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
