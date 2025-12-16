// src/pages/IncialPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Container,
} from "@mui/material";

import MedicationIcon from "@mui/icons-material/Medication";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HistoryIcon from "@mui/icons-material/History";

import MedicationNotifier from "@/features/medicamentos/components/MedicationNotifier";
import { medicamentoApi, type MedicamentoDTO } from "@/features/medicamentos/api/medicamentoApi";
import { getUsuarioId } from "@/features/medicamentos/utils/session";

const IncialPage: React.FC = () => {
  const [medicamentos, setMedicamentos] = useState<MedicamentoDTO[]>([]);
  const usuarioId = getUsuarioId();

  useEffect(() => {
    async function carregar() {
      if (!usuarioId) return;

      try {
        const lista = await medicamentoApi.listarPorUsuario(usuarioId);
        setMedicamentos(lista);
      } catch (e) {
        console.error("Erro ao carregar medicamentos na página inicial");
      }
    }
    carregar();
  }, []);

  return (
    <>
      {/* 🔔 Notificador ativo nesta página */}
      <MedicationNotifier medicamentos={medicamentos} />

      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Card
          sx={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.05)",
            borderRadius: 4,
            p: 4,
            textAlign: "center",
            maxWidth: 500,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700,
                fontSize: { xs: "1.8rem", sm: "2rem" },
                color: "primary.main",
              }}
            >
              DoseCerta 💊
            </Typography>

            <Typography
              sx={{
                mb: 3,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                color: "text.secondary",
              }}
            >
              Organize seus medicamentos com precisão e segurança.
            </Typography>

            <Stack spacing={2.5}>
              <Button
                component={Link}
                to="/medicamentos/cadastro"
                variant="contained"
                size="large"
                startIcon={<MedicationIcon />}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Cadastrar Medicamento
              </Button>

              <Button
                component={Link}
                to="/medicamentos/lista"
                variant="outlined"
                size="large"
                startIcon={<ListAltIcon />}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Lista de Medicamentos
              </Button>

              <Button
                component={Link}
                to="/medicamentos/historico"
                variant="outlined"
                size="large"
                startIcon={<HistoryIcon />}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Histórico
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default IncialPage;
