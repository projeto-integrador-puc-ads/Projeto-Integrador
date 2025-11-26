import { Card, CardActionArea, CardContent, Typography, Stack, Box } from '@mui/material';
import type { ReactNode } from 'react';

export function AccessibleModuleCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'transform 0.16s ease, box-shadow 0.16s ease',
      }}
    >
      <CardActionArea
        onClick={onClick}
        aria-label={title}
        sx={{
          height: '100%',
          p: 3,
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'left',
          '&:hover': {
            transform: 'translateY(-3px)',
          },
          '&.Mui-focusVisible': {
            outline: '4px solid #ffeb3b',
            outlineOffset: '4px',
          },
        }}
      >
        <CardContent sx={{ width: '100%', p: 0 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box aria-hidden sx={{ fontSize: 48 }}>{icon}</Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={700} sx={{ fontSize: '1.25rem' }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                {description}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
