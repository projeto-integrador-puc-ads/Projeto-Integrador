import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Person, MedicalServices } from '@mui/icons-material';
import { setDevUserId } from '../lib/http';

export function ProfileSelector() {
  const [selectedProfile, setSelectedProfile] = useState<string>('2');

  useEffect(() => {
    const savedUserId = localStorage.getItem('devUserId');
    if (savedUserId) {
      setSelectedProfile(savedUserId);
    }
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const userId = event.target.value;
    setSelectedProfile(userId);
    setDevUserId(parseInt(userId));
    localStorage.setItem('devUserId', userId);
    
    // Recarrega a página para aplicar o novo perfil
    window.location.reload();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1300,
        p: 2,
        minWidth: 280,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        🎭 Modo Desenvolvimento
      </Typography>
      
      <FormControl fullWidth size="small">
        <Select
          value={selectedProfile}
          onChange={handleChange}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            },
          }}
        >
          <MenuItem value="2">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Dona Maria (Cliente)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Idosa - Busca cuidadores
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          
          <MenuItem value="3">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicalServices color="success" />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  João Cuidador (Cuidador)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Profissional - Atende clientes
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Alterne entre os perfis para testar as funcionalidades
      </Typography>
    </Paper>
  );
}
