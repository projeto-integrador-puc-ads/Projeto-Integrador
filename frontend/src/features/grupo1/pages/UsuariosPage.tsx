import { useQuery } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuarios';
import { Stack, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

export default function UsuariosPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['usuarios', 'listar'],
    queryFn: usuariosApi.listar,
  });

  return (
    <Stack spacing={2}>
      <Typography variant="h2">Usuários</Typography>
      <Typography variant="body1" color="text.secondary">
        Lista de usuários do sistema (lendo do backend Spring Boot).
      </Typography>
      <Button variant="contained" onClick={() => refetch()}>Atualizar</Button>
      {isLoading && <Typography>Carregando…</Typography>}
      <List>
        {data?.map(u => (
          <ListItem key={u.id ?? `${u.email}-${u.nome}`}>
            <ListItemText
              primary={`${u.nome} — ${u.tipoUsuario}`}
              secondary={`${u.email} • ${u.telefone} • Nasc.: ${u.dataNascimento} • ${u.ativo ? 'ATIVO' : 'INATIVO'}`}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
