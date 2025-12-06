import { Box, Container, Grid, Stack, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginForm from '../components/LoginForm';
import logo_unati_horizontal from '@/assets/logo_unati_horizontal.png';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 20% 20%, rgba(21,101,192,0.08), transparent 40%),
                      radial-gradient(circle at 80% 0%, rgba(46,125,50,0.08), transparent 35%),
                      linear-gradient(120deg, rgba(21,101,192,0.05), rgba(46,125,50,0.05))`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3} sx={{ pr: { md: 4 }, maxWidth: 560, mx: { xs: 'auto', md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                component="img"
                src={logo_unati_horizontal}
                alt="UNATI"
                sx={{
                  height: 64,
                  width: 'auto',
                  objectFit: 'contain',
                  mx: { xs: 'auto', md: 'inherit' },
                }}
              />
              <Typography variant="h2" sx={{ lineHeight: 1.1, fontSize: { xs: '1.8rem', md: '2.1rem' } }}>
                Plataforma de Auxílio ao Idoso
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Acesse a central administrativa para cuidar de cadastros, permissões e jornadas de atendimento
                com segurança e praticidade.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Chip icon={<CheckCircleIcon color="success" />} label="Acesso seguro" variant="outlined" />
                <Chip icon={<CheckCircleIcon color="success" />} label="Gestão centralizada" variant="outlined" />
                <Chip icon={<CheckCircleIcon color="success" />} label="Experiência simplificada" variant="outlined" />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 460, ml: { md: 'auto' }, mx: { xs: 'auto', md: 'inherit' } }}>
              <LoginForm />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
