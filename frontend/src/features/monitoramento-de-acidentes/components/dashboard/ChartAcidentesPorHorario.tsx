import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HCReact from 'highcharts-react-official';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Snackbar,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { dashboardApi } from '@/features/monitoramento-de-acidentes/api/dashboard';

// ✅ Corrige export default do highcharts-react-official (funciona com Vite, CRA, Next etc.)
const HighchartsReact =
  typeof HCReact === 'object' && 'default' in HCReact ? HCReact.default : HCReact;

interface ChartAcidentesPorHorarioProps {
  className?: string;
  userId?: string;
}

const ChartAcidentesPorHorario = ({ className, userId }: ChartAcidentesPorHorarioProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await dashboardApi.acidentesPorHorario(userId);
        setChartData(data ?? []);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados de acidentes por horário.');
      } finally {
        setIsLoading(false);
      }
    };
    loadChartData();
  }, [userId]);

  // 🎨 Opções do gráfico
  const columnChartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'rgba(102, 102, 102, 0.27)',
      borderRadius: 12,
      spacing: [40, 40, 40, 40],
    },
    title: { text: '' },
    xAxis: {
      categories: [
        '0-2h', '2-4h', '4-6h', '6-8h', '8-10h', '10-12h',
        '12-14h', '14-16h', '16-18h', '18-20h', '20-22h', '22-24h',
      ],
      labels: { style: { color: '#555' } },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Quantidade de Acidentes',
        style: { color: '#222' },
      },
      labels: { style: { color: '#555' } },
      gridLineColor: '#ccc',
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        color: '#1976d2', // Azul MUI
      },
    },
    series: [
      {
        type: 'column',
        name: 'Acidentes',
        data: chartData,
      },
    ],
    credits: { enabled: false },
  };

  // 🔁 Redimensionamento automático do gráfico
  useEffect(() => {
    const handleResize = () => Highcharts.charts.forEach((chart) => chart?.reflow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (typeof window === 'undefined') {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  return (
    <Paper
      className={className}
      elevation={3}
      sx={{
        width: '100%',             // ✅ ocupa toda a largura da linha
        display: 'flex',
        flexDirection: 'column',   // título em cima, gráfico embaixo
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        p: 3,
        borderRadius: 2,
        bgcolor: 'rgba(102,102,102,0.27)',
        minHeight: 500,
        flex: '1 1 100%',          // ✅ ocupa toda a linha mesmo em layouts flex
        boxSizing: 'border-box',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            textAlign: 'center',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2, mx: 'auto' }} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Carregando dados do gráfico...
          </Typography>
        </Box>
      ) : (
        <>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'left',
            }}
          >
            Horário por Quantidade de Acidentes
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
              options={columnChartOptions}
              containerProps={{
                style: { width: '100%', height: '100%', flex: '1 1 auto' },
              }}
            />
          </Box>
        </>
      )}

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

export default ChartAcidentesPorHorario;
