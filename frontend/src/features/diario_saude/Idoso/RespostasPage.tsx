import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Stack } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";

import { questionarioApi } from "../api/questionarioApi";
import type { RespostaDTO } from "../api/types";
import BackButton from "../components/BackButton";

export default function RespostasPage() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  if (!usuario) return null;

  const {
    data: respostas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["questionario", "respostas", usuario.id_usuario],
    queryFn: () => questionarioApi.obterRespostas(usuario.id_usuario),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography>Carregando respostas...</Typography>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography color="error">Erro ao carregar respostas.</Typography>
        <Box mt={2}>
          <Typography
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => refetch()}
          >
            Tentar novamente
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (respostas.length === 0) {
    return (
      <PageContainer>
        <BackButton to="/saude" />
        <Typography>Nenhuma resposta registrada.</Typography>
      </PageContainer>
    );
  }

  // Ordena as respostas pelo id da pergunta
  const respostasOrdenadas = respostas.slice().sort(
    (a, b) => a.perguntaId - b.perguntaId
  );

  // Calcula pontuação total
  const pontuacaoTotal = respostasOrdenadas.reduce((acc, r) => acc + r.peso, 0);

  // Interpretação baseada na pontuação
  let interpretacao = "";
  if (pontuacaoTotal <= 6) interpretacao = "baixa vulnerabilidade clínico funcional";
  else if (pontuacaoTotal <= 10) interpretacao = "moderada vulnerabilidade clínico funcional";
  else interpretacao = "alta vulnerabilidade clínico funcional";

  return (
    <PageContainer>
      <BackButton to="/saude" />
      <PageTitle>Respostas do Questionário</PageTitle>

      <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
        <Typography variant="h6">
          Pontuação total: {pontuacaoTotal} pontos
        </Typography>
        <Typography color="text.secondary">{interpretacao}</Typography>
      </Box>

      <Stack spacing={3}>
        {respostasOrdenadas.map(
          (r: RespostaDTO & { pergunta: any }, idx) => (
            <Box
              key={r.perguntaId}
              p={2}
              border="1px solid #ccc"
              borderRadius={2}
            >
              <SectionTitle>Pergunta {idx + 1}</SectionTitle>
              <Typography mb={1}>
                <strong>Texto:</strong> {r.pergunta.texto}
              </Typography>
              <Typography mb={1}>
                <strong>Resposta:</strong> {r.resposta}
              </Typography>
              <Typography color="text.secondary">
                <strong>Peso:</strong> {r.peso}
              </Typography>
            </Box>
          )
        )}
      </Stack>
    </PageContainer>
  );
}
