import { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highmaps';
import HCReact from 'highcharts-react-official';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Snackbar,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { goiasMap, type GoiasMap } from '@/assets/goias.geo.js';

// ✅ Corrige export default do highcharts-react-official
const HighchartsReact =
  typeof HCReact === 'object' && 'default' in HCReact ? HCReact.default : HCReact;

interface MapaAcidentesProps {
  acidentesData: Array<{
    lat: number;
    lon: number;
    z: number;
    name: string;
  }>;
}

const MapaAcidentes = ({ acidentesData }: MapaAcidentesProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Simula carregamento para visual do Skeleton
      setIsLoading(true);
      const timeout = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timeout);
    } catch (err) {
      console.error('Erro ao carregar mapa:', err);
      setError('Não foi possível carregar o mapa de acidentes.');
      setIsLoading(false);
    }
  }, [acidentesData]);

  // 🔁 Redimensionamento automático
  useEffect(() => {
    const handleResize = () => Highcharts.charts.forEach((chart) => chart?.reflow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mapOptions: Highcharts.Options = {
    chart: {
      map: goiasMap as GoiasMap,
      backgroundColor: 'rgba(102, 102, 102, 0.27)',
      spacing: [40, 40, 40, 40],
      borderRadius: 12,
    },
    title: {
      text: '',
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: { verticalAlign: 'bottom' },
    },
    colorAxis: {
      min: 0,
      minColor: '#e3f2fd',
      maxColor: '#1565c0',
    },
    legend: {
      enabled: true,
      title: { text: 'Número de Acidentes', style: { color: '#1565c0' } },
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'bottom',
      backgroundColor: '#ffffffcc',
    },
    series: [
      {
        type: 'map',
        name: 'Mapa Base',
        mapData: goiasMap as any,
        borderColor: '#666',
        nullColor: '#EEE',
        showInLegend: false,
        enableMouseTracking: false,
      },
      {
        type: 'mapbubble',
        name: 'Acidentes',
        data: acidentesData.map((a) => ({
          lat: a.lat,
          lon: a.lon,
          z: a.z,
          name: a.name,
        })),
        color: '#1976d2',
        minSize: 4,
        maxSize: 20,
        joinBy: null,
        tooltip: { pointFormat: '{point.name}<br/>Ocorrências: {point.z}' },
      },
    ],
    credits: { enabled: false },
  };

  if (isLoading) {
    return (
      <Paper
        sx={{
          width: '100%',
          height: 500,
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(102,102,102,0.27)',
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}
        >
          Mapa de Acidentes
        </Typography>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          animation="wave"
          sx={{ bgcolor: 'rgba(21,116,193,0.1)', borderRadius: 2 }}
        />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        p: 3,
        borderRadius: 2,
        bgcolor: 'rgba(102,102,102,0.27)',
        minHeight: 500,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          color: 'text.primary',
          textAlign: 'left',
        }}
      >
        Mapa de Acidentes
      </Typography>

      <Box
        sx={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          constructorType="mapChart"
          options={mapOptions}
          containerProps={{
            style: { width: '100%', height: '100%', flex: '1 1 auto' },
          }}
        />
      </Box>

      {/* Snackbar de erro */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          onClose={() => setError(null)}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default MapaAcidentes;
