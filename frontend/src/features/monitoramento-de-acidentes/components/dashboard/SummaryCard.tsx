import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: SvgIconComponent;
  color?: string; // cor de fundo opcional
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color,
}) => {
  const theme = useTheme();

  const backgroundColor =
    color || theme.palette.primary.main; // azul padrão do tema
  const iconBackground = 'rgba(255, 255, 255, 0.25)';

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        backgroundColor,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%'
      }}
    >
      <CardContent
        sx={{
          p: 3,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Ícone */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Box
            sx={{
              p: 1.2,
              backgroundColor: iconBackground,
              borderRadius: 2,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon fontSize="medium" htmlColor="white" />
          </Box>
        </Box>

        {/* Conteúdo */}
        <Box
          sx={{
            textAlign: 'center',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
