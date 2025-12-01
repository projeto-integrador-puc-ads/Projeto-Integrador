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

// ✅ Compatibilidade entre bundlers (Vite, CRA, Next etc.)
const HighchartsReact =
  typeof HCReact === 'object' && 'default' in HCReact ? HCReact.default : HCReact;

interface PieChartAcidentesProps {
  className?: string;
  userId?: string;
}

const PieChartAcidentes = ({ className, userId }: PieChartAcidentesProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<Array<{ name: string; y: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await dashboardApi.acidentesPorTipo(userId);

        // Formatar dados para o Highcharts
        const formattedData = data.map((item) => ({
          name: item.tipo,
          y: item.quantidade,
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados de acidentes por tipo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [userId]);

  const pieChartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'rgba(102, 102, 102, 0.27)',
      spacing: [40, 40, 40, 40],
      borderRadius: 12,
    },
    title: {
      text: '',
    },
    tooltip: {
      pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        colors: [
          '#1976d2',
          '#0288d1',
          '#26a69a',
          '#7cb342',
          '#fbc02d',
          '#f57c00',
          '#d32f2f',
        ],
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
          style: { color: '#222', textOutline: 'none' },
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Acidentes',
        data: chartData,
      },
    ],
    credits: { enabled: false },
  };

  // 🔁 Redimensiona automaticamente em layouts flex
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
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
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
            Distribuição de Acidentes por Tipo
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
              options={pieChartOptions}
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

export default PieChartAcidentes;
