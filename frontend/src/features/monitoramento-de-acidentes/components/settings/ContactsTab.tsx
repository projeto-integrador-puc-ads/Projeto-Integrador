import React, { useState } from 'react';
import { Mail } from '@mui/icons-material';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ContactsManager } from '@/features/monitoramento-de-acidentes/components/settings/ContactsManager';
import { type AdminUser } from '@/features/admin/api/users.ts';
import { Autocomplete, TextField } from '@mui/material';

interface ContactsTabProps {
  users: AdminUser[];
  isLoadingUsers: boolean;
}

/** Componente do seletor de usuário */
interface UserFilterSelectProps {
  users: AdminUser[];
  value: AdminUser | null;
  onChange: (value: AdminUser | null) => void;
  disabled?: boolean;
}

const UserFilterSelect: React.FC<UserFilterSelectProps> = ({ users, value, onChange, disabled = false }) => {
  return (
    <Autocomplete
      options={users}
      getOptionLabel={(option) => option.name}
      value={value ?? null}
      onChange={(_, newValue) => onChange(newValue ?? null)}
      disabled={disabled}
      sx={{ minWidth: 250 }}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderInput={(params) => (
        <TextField {...params} label="Filtrar por usuário" size="small" />
      )}
      clearOnEscape
    />
  );
};

/** Componente principal */
export const ContactsTab: React.FC<ContactsTabProps> = ({ users, isLoadingUsers }) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const isDisabled = !selectedUser;

  return (
    <Box sx={{ mt: 0, bgcolor: '#D5D5D5', p: 4, borderRadius: '16px' }}>
      {/* Seletor de Usuário */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        {isLoadingUsers ? (
          <CircularProgress size={24} />
        ) : (
          <UserFilterSelect
            users={users}
            value={selectedUser}
            onChange={setSelectedUser}
          />
        )}
      </Box>

      {/* Título e ícone */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        <Mail sx={{ fontSize: 28, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            E-mails de Contato
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os contatos de emergência que receberão notificações
          </Typography>
        </Box>
      </Box>

      {/* Manager ou mensagem de seleção */}
      <Box
        sx={{
          opacity: isDisabled ? 0.5 : 1,
          pointerEvents: isDisabled ? 'none' : 'auto',
          transition: 'opacity 0.2s',
        }}
      >
        {selectedUser ? (
          <ContactsManager selectedUserId={selectedUser.id} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            Selecione um usuário para gerenciar os contatos
          </Box>
        )}
      </Box>
    </Box>
  );
};
