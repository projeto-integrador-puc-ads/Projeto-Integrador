import { Box, IconButton, Typography, Stack } from '@mui/material';
import './carehub-accessibility.css';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string; // Se não fornecido, usa navigate(-1)
}

/**
 * Componente de cabeçalho padronizado para todas as páginas do CareHub
 * com botão VOLTAR grande e visível, ideal para idosos
 */
export function PageHeader({ title, subtitle, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1); // Volta para página anterior
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBack();
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 2,
        borderRadius: 2,
        mb: 3,
        boxShadow: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Botão VOLTAR - Grande e visível */}
        <IconButton
          onClick={handleBack}
          onKeyDown={handleKeyDown}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s',
          }}
          aria-label="Voltar"
        >
          <ArrowBack sx={{ fontSize: 32 }} />
        </IconButton>

        {/* Título e Subtítulo */}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              mb: subtitle ? 0.5 : 0 
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
