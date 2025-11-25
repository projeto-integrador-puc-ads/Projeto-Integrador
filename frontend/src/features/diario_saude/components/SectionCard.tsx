import React from 'react';
import { Paper, Box } from '@mui/material';

interface SectionCardProps {
  children: React.ReactNode;
  // Permite sobrescrever estilos se necessário
  sx?: object; 
}

/**
 * Componente padrão para envolver o conteúdo principal de uma seção em um cartão.
 */
export default function SectionCard({ children, sx = {} }: SectionCardProps) {
  return (
    // Paper é o componente de "cartão" do Material UI
    <Paper 
      elevation={2} // Adiciona uma leve sombra
      sx={{ 
        p: 3, // Padding interno padrão
        mb: 4, // Margin Bottom padrão para separar seções
        borderRadius: 2, // Borda arredondada
        ...sx // Permite estilos personalizados
      }}
    >
      <Box>{children}</Box>
    </Paper>
  );
}