import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  to: string;
  icon?: ReactNode;
};

export default function AdminModuleCard({ title, description, to, icon }: Props) {
  return (
    <Card>
      <CardActionArea component={RouterLink as any} to={to} sx={{ p: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            {icon}
            <Stack>
              <Typography variant="h5" fontWeight={700}>{title}</Typography>
              {description && (
                <Typography variant="body2" color="text.secondary">{description}</Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

