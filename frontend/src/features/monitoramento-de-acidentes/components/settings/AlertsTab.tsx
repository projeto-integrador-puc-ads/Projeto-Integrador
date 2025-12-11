import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Typography,
    Switch,
    CircularProgress,
    Snackbar,
    Alert,
    Button,
    Stack,
} from '@mui/material';
import { Refresh, RestartAlt, NotificationsActive, Shield } from '@mui/icons-material';
import { alertsApi, type UserAlertStatus } from '@/features/monitoramento-de-acidentes/api/alert';
import { adminUsersApi } from '@/features/admin/api/users';

export const AlertsTab: React.FC = () => {
    const [users, setUsers] = useState<UserAlertStatus[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

    const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const [alertStates, allUsers] = await Promise.all([
                alertsApi.listarEstados(),
                adminUsersApi.listar(),
            ]);

            const merged = alertStates.map((a) => {
                const u = allUsers.find((x) => x.id === a.userId);
                return {
                    id: a.id,
                    userId: a.userId,
                    alert: a.alert,
                    name: u?.name ?? `Usuário ${a.userId}`,
                    photoUrl: u?.photoUrl ?? undefined,
                };
            });

            setUsers(merged);
        } catch (error) {
            console.error('Erro ao carregar estados de alerta:', error);
            showToast('Não foi possível carregar os estados dos usuários.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleToggleAlert = async (userId: number, newState: boolean) => {
        try {
            const updated = await alertsApi.atualizarEstado(userId, newState);
            setUsers((prev) =>
                prev.map((u) => (u.userId === updated.userId ? { ...u, alert: updated.alert } : u))
            );

            const user = users.find((u) => u.userId === userId);
            const userName = user?.name ?? `Usuário ${userId}`;
            showToast(
                `${userName} agora está em estado ${updated.alert ? 'de alerta' : 'normal'}.`,
                'success'
            );
        } catch (error) {
            console.error(error);
            showToast('Erro ao atualizar estado do usuário.', 'error');
        }
    };

    const handleResetAll = async () => {
        try {
            setIsLoading(true);
            await alertsApi.resetarTodos();
            await loadUsers();
            showToast('Todos os alertas foram resetados com sucesso.', 'success');
        } catch (error) {
            console.error(error);
            showToast('Não foi possível resetar os alertas.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(255,255,255,0.5)',
                        zIndex: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            <Stack direction="row" justifyContent="flex-end" spacing={2} mb={2}>
                <Button startIcon={<Refresh />} variant="outlined" onClick={loadUsers}>
                    Atualizar Lista
                </Button>
                <Button
                    startIcon={<RestartAlt />}
                    variant="contained"
                    color="error"
                    onClick={handleResetAll}
                >
                    Resetar Todos os Alertas
                </Button>
            </Stack>

            {/* TableContainer com fundo cinza e bordas arredondadas */}
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuário</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Alerta Manual</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={user.photoUrl} alt={user.name}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Typography variant="body1" fontWeight={600}>
                                                {user.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {user.alert ? (
                                                <NotificationsActive sx={{ color: 'error.main' }} />
                                            ) : (
                                                <Shield sx={{ color: 'success.main' }} />
                                            )}
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: user.alert ? 'error.main' : 'success.main',
                                                }}
                                            >
                                                {user.alert ? 'EM ALERTA' : 'NORMAL'}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="right">
                                        <Switch
                                            checked={user.alert}
                                            onChange={(e) => handleToggleAlert(user.userId, e.target.checked)}
                                            color={user.alert ? 'error' : 'success'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={toastOpen}
                autoHideDuration={4000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};
