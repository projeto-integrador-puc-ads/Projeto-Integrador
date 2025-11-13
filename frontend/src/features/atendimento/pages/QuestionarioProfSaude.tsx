import { useState } from "react";
import {
  Box, Container, Paper, Typography, Divider,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Button, Stack
} from "@mui/material";

type Pergunta = {
  id: string;
  titulo: string;
  opcoes: { valor: number; texto: string }[];
};

const perguntas: Pergunta[] = [
    { id: "Q1",  titulo: "Capacidade funcional / independência", opcoes: [
    { valor: 0, texto: "Sem dificuldade" }, { valor: 1, texto: "Alguma dificuldade" }, { valor: 2, texto: "Muita dificuldade" },
  ]},
  { id: "Q2",  titulo: "Mobilidade / marcha", opcoes: [
    { valor: 0, texto: "Normal" }, { valor: 1, texto: "Leve alteração" }, { valor: 2, texto: "Importante alteração" },
  ]},
  { id: "Q3",  titulo: "Humor / cognição", opcoes: [
    { valor: 0, texto: "Sem queixa" }, { valor: 1, texto: "Alguma queixa" }, { valor: 2, texto: "Queixa importante" },
  ]},
  { id: "Q4",  titulo: "Autopercepção de saúde", opcoes: [
    { valor: 0, texto: "Muito boa/Boa" }, { valor: 1, texto: "Regular" }, { valor: 2, texto: "Ruim/Muito ruim" },
  ]},
  { id: "Q5",  titulo: "Atividades básicas de vida diária (banho, vestir, higiene, etc.)", opcoes: [
    { valor: 0, texto: "Independente" }, { valor: 1, texto: "Ajuda parcial" }, { valor: 2, texto: "Dependente" },
  ]},
  { id: "Q6",  titulo: "Atividades instrumentais (compras, finanças, remédios, telefone)", opcoes: [
    { valor: 0, texto: "Independente" }, { valor: 1, texto: "Ajuda parcial" }, { valor: 2, texto: "Dependente" },
  ]},
  { id: "Q7",  titulo: "Memória/atenção (esquecimentos no dia a dia)", opcoes: [
    { valor: 0, texto: "Sem queixa" }, { valor: 1, texto: "Alguma queixa" }, { valor: 2, texto: "Queixa importante" },
  ]},
  { id: "Q8",  titulo: "Humor (tristeza/desânimo nas últimas semanas)", opcoes: [
    { valor: 0, texto: "Não" }, { valor: 1, texto: "Às vezes" }, { valor: 2, texto: "Frequentemente" },
  ]},
  { id: "Q9",  titulo: "Quedas no último ano", opcoes: [
    { valor: 0, texto: "Nenhuma" }, { valor: 1, texto: "1 queda" }, { valor: 2, texto: "2 ou mais quedas" },
  ]},
  { id: "Q10", titulo: "Marcha/equilíbrio (levantar, virar, caminhar)", opcoes: [
    { valor: 0, texto: "Sem dificuldade" }, { valor: 1, texto: "Alguma dificuldade" }, { valor: 2, texto: "Muita dificuldade" },
  ]},
  { id: "Q11", titulo: "Visão para atividades do dia a dia", opcoes: [
    { valor: 0, texto: "Boa" }, { valor: 1, texto: "Moderada" }, { valor: 2, texto: "Ruim" },
  ]},
  { id: "Q12", titulo: "Audição para conversas habituais", opcoes: [
    { valor: 0, texto: "Boa" }, { valor: 1, texto: "Moderada" }, { valor: 2, texto: "Ruim" },
  ]},
  { id: "Q13", titulo: "Comunicação (entende e se faz entender)", opcoes: [
    { valor: 0, texto: "Sem dificuldade" }, { valor: 1, texto: "Alguma dificuldade" }, { valor: 2, texto: "Grande dificuldade" },
  ]},
  { id: "Q14", titulo: "Incontinência urinária/fecal", opcoes: [
    { valor: 0, texto: "Não" }, { valor: 1, texto: "Ocasional" }, { valor: 2, texto: "Frequente" },
  ]},
  { id: "Q15", titulo: "Uso de múltiplos medicamentos", opcoes: [
    { valor: 0, texto: "≤4 medicamentos" }, { valor: 1, texto: "5–9 medicamentos" }, { valor: 2, texto: "≥10 medicamentos" },
  ]},
  { id: "Q16", titulo: "Doenças crônicas importantes", opcoes: [
    { valor: 0, texto: "0–1 doença" }, { valor: 1, texto: "2–3 doenças" }, { valor: 2, texto: "≥4 doenças" },
  ]},
  { id: "Q17", titulo: "Internação/hospitalização nos últimos 6–12 meses", opcoes: [
    { valor: 0, texto: "Nenhuma" }, { valor: 1, texto: "1 vez" }, { valor: 2, texto: "2 ou mais" },
  ]},
  { id: "Q18", titulo: "Perda de peso/apetite recente", opcoes: [
    { valor: 0, texto: "Não" }, { valor: 1, texto: "Leve" }, { valor: 2, texto: "Importante" },
  ]},
  { id: "Q19", titulo: "Atividade física (frequência/tempo)", opcoes: [
    { valor: 0, texto: "Adequada" }, { valor: 1, texto: "Insuficiente" }, { valor: 2, texto: "Quase nenhuma" },
  ]},
  { id: "Q20", titulo: "Suporte social/familiar", opcoes: [
    { valor: 0, texto: "Bom suporte" }, { valor: 1, texto: "Parcial" }, { valor: 2, texto: "Pouco ou nenhum" },
  ]},

];

export default function QuestionarioProfSaude() {
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const marcar = (id: string, valor: number) =>
    setRespostas((prev) => ({ ...prev, [id]: valor }));
  const salvar = () => {
    console.log("Respostas:", respostas);
    alert("Respostas salvas (exemplo).");
  };
  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Questionário – Profissional de Saúde (IVCF-20)
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={3}>
          {perguntas.map((p, i) => (
            <Box key={p.id}>
              <FormControl>
                <FormLabel sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {i + 1}. {p.titulo}
                  </Typography>
                </FormLabel>
                <RadioGroup
                  value={respostas[p.id] ?? ""}
                  onChange={(e) => marcar(p.id, Number(e.target.value))}
                >
                  {p.opcoes.map((op) => (
                    <FormControlLabel
                      key={op.valor}
                      value={op.valor}
                      control={<Radio />}
                      label={op.texto}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Button variant="contained" onClick={salvar}>Salvar respostas</Button>
      </Paper>
    </Container>
  );
}
