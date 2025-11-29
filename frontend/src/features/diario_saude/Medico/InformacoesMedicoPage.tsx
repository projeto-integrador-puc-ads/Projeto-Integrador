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

  const [editData, setEditData] = useState({
    nome: medicoLogado?.nome ?? "", // Mantemos o valor do localStorage como fallback imediato
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
  });

  useEffect(() => {
    if (medico) {
      setEditData({
        // Usa dados do backend, garantindo que o formulário tenha os valores mais recentes
        nome: medico.nome ?? editData.nome,
        local_trabalho: medico.local_trabalho ?? editData.local_trabalho,
      });
    }
  }, [medico]); 


  // -----------------------------
  // Atualizar dados
  // -----------------------------
  const atualizarMedicoMutation = useMutation({
    mutationFn: (payload: typeof editData) => medicoApi.atualizar({ id_medico: medicoId, ...payload }),
    onSuccess: (data) => {

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