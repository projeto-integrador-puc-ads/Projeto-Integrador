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
  IconButton,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { contactApi, type Contact, type CreateContactPayload, type UpdateContactPayload } from '@/features/monitoramento-de-acidentes/api/contact';

interface ContactsManagerProps {
  selectedUserId: number | bigint;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({ selectedUserId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form states
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Contact>({
    name: '',
    email: '',
    ownerId: selectedUserId,
  });

  // Validation errors
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});

  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  useEffect(() => {
    if (selectedUserId) {
      loadContacts();
    } else {
      setContacts([]);
    }
  }, [selectedUserId]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.listarPorUsuario(selectedUserId);
      setContacts(data);
    } catch (error) {
      console.error(error);
      showToast('Não foi possível carregar os contatos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', ownerId: selectedUserId });
    setEditingContact(null);
    setFormErrors({});
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const errors: { name?: string; email?: string } = {};
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório.';
    else if (formData.name.length > 100) errors.name = 'Nome deve ter no máximo 100 caracteres.';
    if (!formData.email.trim()) errors.email = 'E-mail é obrigatório.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = async () => {
    if (!selectedUserId) return;
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const dto: CreateContactPayload = { name: formData.name, email: formData.email };
      const created = await contactApi.criar(selectedUserId, dto);
      setContacts([...contacts, created]);
      setIsAddDialogOpen(false);
      resetForm();
      showToast('Contato adicionado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Não foi possível adicionar o contato.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingContact?.id) return;
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const dto: UpdateContactPayload = { name: formData.name, email: formData.email };
      const updated = await contactApi.atualizar(editingContact.id, dto);
      setContacts(contacts.map(c => (c.id === updated.id ? updated : c)));
      setIsEditDialogOpen(false);
      resetForm();
      showToast('Contato atualizado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Não foi possível atualizar o contato.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingContact?.id) return;
    try {
      setIsLoading(true);
      await contactApi.remover(editingContact.id);
      setContacts(contacts.filter(c => c.id !== editingContact.id));
      setIsDeleteDialogOpen(false);
      setEditingContact(null);
      showToast('Contato deletado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Não foi possível deletar o contato.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedUserId) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'text.secondary' }}>
        Selecione um usuário para gerenciar os contatos
      </Box>
    );
  }

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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsAddDialogOpen(true)}>
          Adicionar Contato
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhum contato cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setEditingContact(contact);
                        setFormData(contact);
                        setFormErrors({});
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEditingContact(contact);
                        setIsDeleteDialogOpen(true);
                      }}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Adicionar Contato</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            margin="dense"
            value={formData.name}
            error={!!formErrors.name}
            helperText={formErrors.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="E-mail"
            margin="dense"
            value={formData.email}
            error={!!formErrors.email}
            helperText={formErrors.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleAdd} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Editar Contato</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            margin="dense"
            value={formData.name}
            error={!!formErrors.name}
            helperText={formErrors.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="E-mail"
            margin="dense"
            value={formData.email}
            error={!!formErrors.email}
            helperText={formErrors.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleEdit} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Deletar Contato</DialogTitle>
        <DialogContent>
          Tem certeza que deseja deletar o contato {editingContact?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Deletar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
