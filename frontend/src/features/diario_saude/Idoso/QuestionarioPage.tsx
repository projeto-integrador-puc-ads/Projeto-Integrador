import { useEffect, useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import { useNavigate } from "react-router-dom";

interface Opcao {
  texto: string;
  peso: number;
}

interface Pergunta {
  id: number;
  texto: string;
  opcoes: Opcao[];
}

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  role: string;
  idade?: string;
  peso?: number;
  altura?: number;
  alergias?: string;
  local_trabalho?: string;
}

interface RespostaDTO {
  perguntaId: number;
  resposta: string;
  peso: number;
}

export default function QuestionarioPage() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostaDTO[]>([]);
  const navigate = useNavigate();

  const usuario: Usuario | null = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );
  const token = localStorage.getItem("token") || "";

  // Busca perguntas do backend
  useEffect(() => {
    fetch("http://localhost:8080/api/diario_saude/questionario/perguntas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const perguntasConvertidas = data.map((p: any) => ({
          id: p.id,
          texto: p.texto,
          opcoes: (p.opcoes || []).map((o: any) => ({
            texto: o.texto,
            peso: o.peso,
          })),
        }));
        setPerguntas(perguntasConvertidas);
      })
      .catch((err) => console.error("Erro ao buscar perguntas:", err));
  }, [token]);

  if (!usuario) return null;

  if (perguntas.length === 0) {
    return (
      <PageContainer>
        <Typography>Carregando questionário...</Typography>
      </PageContainer>
    );
  }

  const perguntaAtual = perguntas[indiceAtual];

  const handleResponder = async (opcao: Opcao) => {
    const novaResposta: RespostaDTO = {
      perguntaId: perguntaAtual.id,
      resposta: opcao.texto,
      peso: opcao.peso,
    };

    // Atualiza o estado local (não bloqueia envio)
    setRespostas((prev) => [...prev, novaResposta]);

    if (indiceAtual < perguntas.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      // envia todas as respostas, incluindo a última
      try {
        const res = await fetch(
          `http://localhost:8080/api/diario_saude/questionario/responder/${usuario.id_usuario}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([...respostas, novaResposta]), // garante JSON completo
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro ao enviar respostas: ${text}`);
        }

        const data = await res.json();
        alert(`Questionário finalizado! Pontuação: ${data.pontuacao}`);
        navigate(-1);
      } catch (err) {
        console.error(err);
        alert("Erro ao enviar respostas. Confira o console para detalhes.");
      }
    }
  };

  return (
    <PageContainer>
      <PageTitle>Questionário de Saúde</PageTitle>
      <SectionTitle>
        Pergunta {indiceAtual + 1} de {perguntas.length}
      </SectionTitle>

      <Typography variant="h6" mb={3}>
        {perguntaAtual.texto}
      </Typography>

      <Stack spacing={2}>
        {perguntaAtual.opcoes.map((op, idx) => (
          <Button
            key={idx}
            variant="contained"
            fullWidth
            sx={{ borderRadius: 3, py: 2 }}
            onClick={() => handleResponder(op)}
          >
            {op.texto}
          </Button>
        ))}
      </Stack>

      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {respostas.length} respostas registradas
        </Typography>
      </Box>
    </PageContainer>
  );
}
