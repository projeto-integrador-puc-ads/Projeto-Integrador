import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { SensorsTab } from '@/features/monitoramento-de-acidentes/components/settings/SensorsTab';
import { ContactsTab } from '@/features/monitoramento-de-acidentes/components/settings/ContactsTab';
import { adminUsersApi, type AdminUser } from '@/features/admin/api/users.ts';

interface SettingsPopupProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsPopup: React.FC<SettingsPopupProps> = ({ open, onClose }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const usersData: AdminUser[] = await adminUsersApi.listar();
        setUsers(usersData);
      } catch (err) {
        console.error('❌ Erro ao carregar usuários:', err);
        setError('Não foi possível carregar a lista de usuários.');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (open) {
      loadUsers();
    }
  }, [open]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 1,
            p: 0,
            overflow: 'hidden',
            padding: 3,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              variant="fullWidth" // faz as tabs ocuparem toda a largura disponível
              aria-label="tabs de configurações"
            >
              <Tab label="Sensores" sx={{ width: '50%' }} />
              <Tab label="Gerenciar E-mails de Contato" sx={{ width: '50%' }} />
            </Tabs>
          </Box>

          <Box sx={{ p: 3, minHeight: 400 }}>
            {isLoadingUsers ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {tabIndex === 0 && <SensorsTab users={users} isLoadingUsers={isLoadingUsers} />}
                {tabIndex === 1 && <ContactsTab users={users} isLoadingUsers={isLoadingUsers} />}
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar de erro */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsPopup;