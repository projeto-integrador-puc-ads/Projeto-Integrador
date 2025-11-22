import { List, ListItemButton, ListItemText, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import BackButton from "../components/BackButton";

import { prescricaoApi } from "../api/prescricaoApi";
import type { Prescricao } from "../api/prescricaoApi";

export default function HistoricoConsultasPage() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");

  useEffect(() => {
    if (!usuarioLogado) navigate("/login");
  }, [usuarioLogado, navigate]);

  const pacienteNome = usuarioLogado?.nome || "Paciente";
  const pacienteId = usuarioLogado?.id_usuario;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Prescricao | null>(null);

  const { data: consultas = [], isLoading } = useQuery({
    queryKey: ["prescricao", pacienteId],
    queryFn: () => prescricaoApi.porUsuario(pacienteId),
    enabled: !!pacienteId, // só busca quando tiver ID
    select: (lista) =>
      lista.sort(
        (a, b) =>
          new Date(b.data_prescricao).getTime() -
          new Date(a.data_prescricao).getTime()
      ),
  });

  const handleClickConsulta = (consulta: Prescricao) => {
    setConsultaSelecionada(consulta);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setConsultaSelecionada(null);
  };

  return (
    <PageContainer>
      <BackButton to="/home" />
      <PageTitle>Histórico de Consultas</PageTitle>
      <SectionTitle>
        Paciente: <b>{pacienteNome}</b>
      </SectionTitle>

      {isLoading ? (
        <Typography color="text.secondary" align="center" mt={2}>
          Carregando…
        </Typography>
      ) : consultas.length === 0 ? (
        <Typography color="text.secondary" align="center" mt={2}>
          Nenhuma consulta encontrada.
        </Typography>
      ) : (
        <List>
          {consultas.map((c) => (
            <ListItemButton
              key={c.id_prescricao}
              onClick={() => handleClickConsulta(c)}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: "#f5f5f5",
                "&:hover": { bgcolor: "#e0e0e0" },
                py: 2,
                px: 2,
              }}
            >
              <ListItemText
                primary={c.nomeMedico}
                secondary={`Data: ${c.data_prescricao}`}
              />
            </ListItemButton>
          ))}
        </List>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {consultaSelecionada?.nomeMedico} — {consultaSelecionada?.data_prescricao}
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="subtitle1" fontWeight="bold">
            Medicamentos:
          </Typography>
          <List dense>
            {consultaSelecionada?.medicamentos.map((m, i) => (
              <ListItemText key={i} primary={m} />
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold">
            Exames:
          </Typography>
          <List dense>
            {consultaSelecionada?.exames.map((e, i) => (
              <ListItemText key={i} primary={e} />
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
