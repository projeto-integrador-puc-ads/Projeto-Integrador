import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate, useLocation } from "react-router-dom";

import { useQuery, useMutation } from "@tanstack/react-query";
import { examesApi } from "../api/examesApi";
import { prescricaoExameApi } from "../api/prescricaoExameApi";


//Tipos
interface Exame {
    id_exame: number;
    nome_exame: string;
}

//Tipos do Estado
interface ExamePrescrito {
    id_exame: number;
    nome_exame: string;
}


//Componentes reutilizáveis
function PageContainer({ children }: { children: React.ReactNode }) {
  return <Container maxWidth="sm" sx={{ mt: 4 }}>{children}</Container>;
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
      {children}
    </Typography>
  );
}

export default function PrescreverExamePage() {
  const navigate = useNavigate();
  const location = useLocation();

  //Dados da prescrição
  const prescricao = location.state?.prescricao;
  const idPrescricaoMedica =
    prescricao?.id_prescricao_medica ?? prescricao?.id_prescricao ?? prescricao?.id;

  //State local para o formulário
  const [exameSelecionadoId, setExameSelecionadoId] = useState<number | "">("");
  const [examesPrescritos, setExamesPrescritos] = useState<ExamePrescrito[]>([]);

  useEffect(() => {
    if (!idPrescricaoMedica) {
      alert("Prescrição médica não encontrada. Inicie a consulta primeiro.");
      navigate(-1);
    }
  }, [idPrescricaoMedica, navigate]);


    const {
        data: listaExames = [],
        isLoading: loadingExames,
        isError: errorExames
    } = useQuery<Exame[]>({
        queryKey: ["exames"],
        queryFn: examesApi.listar,
        enabled: !!idPrescricaoMedica,
    });

  const exameSelecionadoObj = useMemo(() => {
    return listaExames.find((x) => x.id_exame === exameSelecionadoId);
  }, [exameSelecionadoId, listaExames]);

  const handleAddExame = () => {
    if (!exameSelecionadoObj) return;
    if (examesPrescritos.some((x) => x.id_exame === exameSelecionadoObj.id_exame)) return;
    setExamesPrescritos((prev) => [
        ...prev,
        {
            id_exame: exameSelecionadoObj.id_exame,
            nome_exame: exameSelecionadoObj.nome_exame
        }
    ]);
  };

  const handleRemove = (id: number) => {
    setExamesPrescritos((prev) => prev.filter((e) => e.id_exame !== id));
  };

  const salvarExamesMutation = useMutation({
      mutationFn: async (exames: ExamePrescrito[]) => {
          if (!idPrescricaoMedica) throw new Error("ID da Prescrição inválida.");

          const promessas = exames.map(e => {
              const body = {
                  id_exame: e.id_exame,
                  id_prescricao_medica: idPrescricaoMedica,
                  data_prescricao: new Date().toISOString().split("T")[0],
                  observacao: "",
              };
              return prescricaoExameApi.salvar(body);
          });

          // Espera todas as chamadas terminarem
          return await Promise.all(promessas);
      },
      onSuccess: () => {
          alert("Exames prescritos com sucesso!");
          navigate(-1);
      },
      onError: (err) => {
          console.error("Erro no handleSalvar:", err);
          alert("Erro ao prescrever exames. Veja o console para mais detalhes.");
      },
  });

  const handleSalvar = () => {
    salvarExamesMutation.mutate(examesPrescritos);
  };

  // ----------------------------------------------------
  // 5. Render
  // ----------------------------------------------------
  return (
    <PageContainer>
      <Paper sx={{ p: 3 }}>
        <IconButton onClick={() => navigate(-1)} color="primary" sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <PageTitle>Prescrever Exames</PageTitle>

        <Box mb={1}>
          <Typography variant="body2" color="textSecondary">
            Paciente: {location.state?.paciente?.nome ?? "—"}
          </Typography>
        </Box>

        {errorExames ? (
            <Typography color="error">Erro ao carregar exames disponíveis.</Typography>
        ) : (
            <TextField
                select
                label={loadingExames ? "Carregando exames..." : "Selecione o Exame"}
                fullWidth
                // A prop value do TextField de select precisa ser string ou number (não undefined)
                value={exameSelecionadoId || ""}
                onChange={(e) => setExameSelecionadoId(Number(e.target.value))}
                sx={{ mt: 2 }}
                disabled={loadingExames}
            >
                <MenuItem value="">-- selecione --</MenuItem>
                {listaExames.map((ex) => (
                    <MenuItem key={ex.id_exame} value={ex.id_exame}>
                        {ex.nome_exame}
                    </MenuItem>
                ))}
            </TextField>
        )}

        <IconButton
          onClick={handleAddExame}
          size="small"
          color="primary"
          sx={{ mt: 2, display: "flex", alignItems: "center" }}
          disabled={!exameSelecionadoId} // Desabilita se nada estiver selecionado
        >
          <ArrowForwardIcon />
          <Typography ml={1} color="primary">Adicionar Exame</Typography>
        </IconButton>

        <List sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 2, maxHeight: 240, overflow: "auto" }}>
          {examesPrescritos.length
            ? examesPrescritos.map((ex) => (
                <ListItem
                  key={ex.id_exame}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemove(ex.id_exame)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={ex.nome_exame} />
                </ListItem>
              ))
            : (
              <ListItem>
                <ListItemText primary="Nenhum exame adicionado." />
              </ListItem>
            )}
        </List>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSalvar}
          disabled={examesPrescritos.length === 0 || salvarExamesMutation.isLoading}
        >
          {salvarExamesMutation.isLoading ? "Salvando..." : "Salvar Prescrição"}
        </Button>
      </Paper>
    </PageContainer>
  );
}