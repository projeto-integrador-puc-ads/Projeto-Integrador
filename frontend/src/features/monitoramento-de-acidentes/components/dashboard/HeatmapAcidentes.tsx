import { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HCReact from 'highcharts-react-official';
import 'highcharts/modules/heatmap';
import { dashboardApi } from '@/features/monitoramento-de-acidentes/api/dashboard';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Snackbar,
} from '@mui/material';
import Alert from '@mui/material/Alert';

// ✅ Corrige export default de HighchartsReact
const HighchartsReact =
  typeof HCReact === 'object' && 'default' in HCReact ? HCReact.default : HCReact;

interface HeatmapAcidentesProps {
  userId?: string;
}

const HeatmapAcidentes = ({ userId }: HeatmapAcidentesProps) => {
  const [data, setData] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const heatmapData = await dashboardApi.acidentesHeatmap(userId);

        // Converte matriz 7x24 para formato [x, y, valor]
        const points = heatmapData.flatMap((row, y) =>
          row.map((value, x) => [x, y, value])
        );

        setData(points);
      } catch (err) {
        console.error('Erro ao carregar heatmap:', err);
        setError('Não foi possível carregar os dados do heatmap.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // Redimensiona automaticamente com o layout
  useEffect(() => {
    const handleResize = () => Highcharts.charts.forEach((chart) => chart?.reflow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const diasSemana = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado',
  ];
  const horas = Array.from({ length: 24 }, (_, i) => `${i}h`);

  const options: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      backgroundColor: 'rgba(102, 102, 102, 0.27)',
      borderRadius: 12,
      spacing: [40, 40, 40, 40],
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: horas,
      title: { text: 'Hora do Dia', style: { color: '#222' } },
      labels: { style: { color: '#555' } },
      gridLineColor: '#ccc',
    },
    yAxis: {
      categories: diasSemana,
      title: { text: 'Dia da Semana', style: { color: '#222' } },
      labels: { style: { color: '#555' } },
      gridLineColor: '#ccc',
    },
    colorAxis: {
      min: 0,
      minColor: '#cce0f5',
      maxColor: '#1565c0',
      labels: { style: { color: '#1565c0' } },
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'middle',
      itemStyle: { color: '#1565c0' },
    },
    tooltip: {
      backgroundColor: '#fff',
      borderColor: '#1565c0',
      style: { color: '#333' },
      formatter: function () {
        const point = this as any;
        return `<b>${diasSemana[point.y]}</b><br/>
                <b>${horas[point.x]}</b><br/>
                Acidentes: <b>${point.value}</b>`;
      },
    },
    series: [
      {
        type: 'heatmap',
        name: 'Acidentes',
        borderWidth: 1,
        borderColor: '#fff',
        data: data,
        dataLabels: { enabled: false },
      },
    ],
    credits: { enabled: false },
  };

  // Skeleton de carregamento
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
          Densidade de Acidentes por Dia e Horário
        </Typography>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          animation="wave"
          sx={{
            bgcolor: 'rgba(21,116,193,0.1)',
            borderRadius: 2,
          }}
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
        Densidade de Acidentes por Dia e Horário
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
          ref={chartComponentRef}
          highcharts={Highcharts}
          options={options}
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

export default HeatmapAcidentes;
