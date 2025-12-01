import http from '@/lib/http';

export interface GeofenceConfig {
  enabled: boolean;
  centerLat: number;
  centerLon: number;
  radiusMeters: number;
}

export interface FallConfig {
  enabled: boolean;
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ImmobilityConfig {
  enabled: boolean;
  timeLimitMs: number;
}

export interface SensorConfig {
  geofence: GeofenceConfig;
  fall: FallConfig;
  immobility: ImmobilityConfig;
}

export const sensorConfigApi = {
  obter: async (userId: number): Promise<SensorConfig> => {
    const { data } = await http.get<SensorConfig>(`/api/usuarios/${userId}/sensor-config`);
    return data;
  },

  atualizar: async (userId: number, payload: SensorConfig): Promise<SensorConfig> => {
    const { data } = await http.put<SensorConfig>(
      `/api/usuarios/${userId}/sensor-config`,
      payload
    );
    return data;
  },
};
