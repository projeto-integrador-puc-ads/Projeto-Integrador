import { Card, CardActionArea, CardContent, Typography, Stack } from '@mui/material';
import type { ReactNode } from 'react';

export function ModuleCard({
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
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Stack spacing={1.5} alignItems="flex-start">
            <div aria-hidden>{icon}</div>
            <Typography variant="h5" fontWeight={700}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
