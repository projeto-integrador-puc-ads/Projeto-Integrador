import { useState } from "react";
import { Box, Button, Typography, Stack, Collapse } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { questionarioApi } from "../api/questionarioApi";
import type { Opcao, Pergunta, RespostaDTO } from "../api/types";
import BackButton from "../components/BackButton";

export default function QuestionarioPage() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  if (!usuario) return null;

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostaDTO[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const { data: perguntas, isLoading, isError, refetch } = useQuery({
    queryKey: ["questionario", "perguntas"],
    queryFn: questionarioApi.listarPerguntas,
    refetchOnWindowFocus: false,
  });

  const enviarMutation = useMutation({
    mutationFn: (resps: RespostaDTO[]) =>
      questionarioApi.enviarRespostas(usuario.id_usuario, resps),
    onSuccess: (retorno) => {
      alert(`Questionário finalizado! Pontuação: ${retorno.pontuacao}`);
      navigate(-1);
    },
    onError: (err: any) => {
      console.error("Erro ao enviar respostas:", err);
      alert("Erro ao enviar respostas. Veja console.");
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <BackButton to="/saude" />

        <Typography>Carregando questionário...</Typography>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <BackButton to="/saude" />

        <Typography color="error">Erro ao carregar perguntas.</Typography>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </PageContainer>
    );
  }

  if (!perguntas || perguntas.length === 0) {
    return (
      <PageContainer>
        <BackButton to="/saude" />

        <Typography>Nenhuma pergunta disponível no questionário.</Typography>
      </PageContainer>
    );
  }

  const perguntaAtual: Pergunta | undefined = perguntas[indiceAtual];
  if (!perguntaAtual) {
    return (
      <PageContainer>
        <Typography>Questionário concluído ou pergunta inválida.</Typography>
      </PageContainer>
    );
  }

  // Debug console (também mostrado via UI se necessário)
  console.debug("Questionario - perguntas (parsed):", perguntas);
  // Se quiser ver resposta crua do backend, habilite debug no questionarioApi e retorne 'raw'

  const handleResponder = (opcao: Opcao) => {
    const nova: RespostaDTO = {
      perguntaId: perguntaAtual.id,
      resposta: opcao.texto,
      peso: opcao.peso,
    };

    const novas = [...respostas, nova];
    setRespostas(novas);

    const ultima = indiceAtual === perguntas.length - 1;
    if (ultima) {
      enviarMutation.mutate(novas);
    } else {
      setIndiceAtual((n) => n + 1);
    }
  };

  return (
    <PageContainer>
      <BackButton to="/saude" />
      <PageTitle>Questionário de Saúde</PageTitle>

      <SectionTitle>
        Pergunta {indiceAtual + 1} de {perguntas.length}
      </SectionTitle>

      <Typography variant="h6" mb={3}>
        {perguntaAtual.texto || "— (pergunta sem texto) —"}
      </Typography>

      {perguntaAtual.opcoes.length === 0 ? (
        <Box>
          <Typography color="text.secondary" mb={2}>
            Esta pergunta não possui opções reconhecíveis pelo cliente.
          </Typography>

          <Button variant="outlined" onClick={() => setShowDebug((s) => !s)}>
            {showDebug ? "Ocultar debug" : "Mostrar debug (opções/objeto)"}
          </Button>

          <Collapse in={showDebug}>
            <Box mt={2} sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 13 }}>
              {JSON.stringify(perguntaAtual, null, 2)}
            </Box>
          </Collapse>
        </Box>
      ) : (
        <Stack spacing={2}>
          {perguntaAtual.opcoes.map((op, idx) => (
            <Button
              key={idx}
              variant="contained"
              fullWidth
              sx={{ borderRadius: 3, py: 2 }}
              onClick={() => handleResponder(op)}
              disabled={enviarMutation.isLoading}
            >
              {op.texto}
            </Button>
          ))}
        </Stack>
      )}

      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {respostas.length} respostas registradas
        </Typography>
      </Box>
    </PageContainer>
  );
}
