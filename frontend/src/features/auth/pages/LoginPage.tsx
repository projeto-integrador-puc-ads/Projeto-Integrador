import { Box, Container } from '@mui/material';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <Container sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <LoginForm />
      </Box>
    </Container>
  );
}

