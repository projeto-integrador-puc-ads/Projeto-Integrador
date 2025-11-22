import { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Componentes
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import RoundedTextField from "../components/RoundedTextField";
import BackButton from "../components/BackButton";

// React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { medicoApi } from "../api/medicoApi";

export default function InformacoesMedicoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const medicoLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  const medicoId = medicoLogado?.id_usuario;

  // -----------------------------
  // State do formulário
  // -----------------------------
  const [editData, setEditData] = useState({
    nome: medicoLogado?.nome ?? "",
    local_trabalho: medicoLogado?.local_trabalho ?? "",
  });

  // -----------------------------
  // Redireciona se não houver médico logado
  // -----------------------------
  useEffect(() => {
    if (!medicoLogado) navigate("/login");
  }, [medicoLogado, navigate]);

  // -----------------------------
  // Buscar dados do backend
  // -----------------------------
  const { data: medico } = useQuery({
    queryKey: ["medico", medicoId],
    queryFn: () => medicoApi.porId(medicoId),
    enabled: !!medicoId,
    onSuccess: (data) => {
      setEditData({
        nome: data.nome ?? editData.nome,
        local_trabalho: data.local_trabalho ?? editData.local_trabalho,
      });
    },
  });

  // -----------------------------
  // Atualizar dados
  // -----------------------------
  const atualizarMedicoMutation = useMutation({
    mutationFn: (payload: typeof editData) => medicoApi.atualizar({ id_medico: medicoId, ...payload }),
    onSuccess: (data) => {
      // Atualiza localStorage e cache do React Query
      localStorage.setItem("usuarioLogado", JSON.stringify({ ...medicoLogado, ...data }));
      queryClient.invalidateQueries(["medico", medicoId]);
      alert("Informações do médico atualizadas!");
    },
    onError: (err) => {
      console.error(err);
      alert("Erro ao salvar informações.");
    },
  });

  const salvarAlteracoes = () => {
    atualizarMedicoMutation.mutate(editData);
  };

  const handleChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <PageContainer>
      <BackButton to="/home" />
      <PageTitle>Informações do Médico</PageTitle>

      <SectionTitle>Dados do Médico</SectionTitle>
      <Stack spacing={2}>
        <RoundedTextField label="Nome" name="nome" value={editData.nome} onChange={handleChange} />
        <RoundedTextField
          label="Local de Trabalho"
          name="local_trabalho"
          value={editData.local_trabalho}
          onChange={handleChange}
        />
      </Stack>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={salvarAlteracoes}
        disabled={atualizarMedicoMutation.isLoading}
      >
        {atualizarMedicoMutation.isLoading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </PageContainer>
  );
}
