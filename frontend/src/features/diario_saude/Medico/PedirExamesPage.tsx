import { useState, useEffect } from "react";
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

  const token = localStorage.getItem("token");
  const prescricao = location.state?.prescricao;
  const idPrescricaoMedica =
    prescricao?.id_prescricao_medica ?? prescricao?.id_prescricao ?? prescricao?.id;

  const [listaExames, setListaExames] = useState<Array<any>>([]);
  const [exameSelecionado, setExameSelecionado] = useState<number | "">("");
  const [examesPrescritos, setExamesPrescritos] = useState<Array<any>>([]);
  const [loadingExames, setLoadingExames] = useState(false);

  // verifica se existe prescrição
  useEffect(() => {
    if (!idPrescricaoMedica) {
      alert("Prescrição médica não encontrada. Inicie a consulta primeiro.");
      navigate(-1);
    }
  }, [idPrescricaoMedica, navigate]);

  // busca exames
  useEffect(() => {
    if (!token) return;
    setLoadingExames(true);
    fetch("http://localhost:8080/api/diario_saude/exames", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => {
        if (resp.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          navigate("/login");
          throw new Error("401");
        }
        if (!resp.ok) throw new Error(`Falha ao buscar exames: ${resp.status}`);
        return resp.json();
      })
      .then((data) => setListaExames(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.message !== "401") console.error("Erro ao carregar exames:", err);
      })
      .finally(() => setLoadingExames(false));
  }, [token, navigate]);

  // adicionar exame
  const handleAddExame = () => {
    if (!exameSelecionado) return;
    const exame = listaExames.find((x) => x.id_exame === exameSelecionado);
    if (!exame) return alert("Exame selecionado não encontrado.");
    if (examesPrescritos.some((x) => x.id_exame === exameSelecionado)) return;
    setExamesPrescritos((prev) => [...prev, exame]);
  };

  // remover exame
  const handleRemove = (id: number) => {
    setExamesPrescritos((prev) => prev.filter((e) => e.id_exame !== id));
  };

  // salvar exames
  const handleSalvar = async () => {
    if (!token || !idPrescricaoMedica || examesPrescritos.length === 0) return;

    try {
      for (const e of examesPrescritos) {
        const body = {
          id_exame: e.id_exame,
          id_prescricao_medica: idPrescricaoMedica,
          data_prescricao: new Date().toISOString().split("T")[0],
          observacao: "",
        };

        const resp = await fetch("http://localhost:8080/api/diario_saude/prescricao/exame", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });

        if (!resp.ok) {
          let text = "";
          try { text = await resp.text(); } catch (e) {}
          console.error("Erro ao salvar exame:", resp.status, text);
          throw new Error(`Erro ao salvar exame (status ${resp.status})`);
        }
      }

      alert("Exames prescritos com sucesso!");
      navigate(-1);
    } catch (err) {
      console.error("Erro no handleSalvar:", err);
      alert("Erro ao prescrever exames. Veja o console para mais detalhes.");
    }
  };

  return (
    <PageContainer>
      <Paper sx={{ p: 3 }}>
        {/* Ícone de voltar azul */}
        <IconButton onClick={() => navigate(-1)} color="primary" sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <PageTitle>Prescrever Exames</PageTitle>

        <Box mb={1}>
          <Typography variant="body2" color="textSecondary">
            Paciente: {location.state?.paciente?.nome ?? "—"}
          </Typography>
        </Box>

        <TextField
          select
          label={loadingExames ? "Carregando exames..." : "Selecione o Exame"}
          fullWidth
          value={exameSelecionado}
          onChange={(e) => setExameSelecionado(Number(e.target.value))}
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

        {/* Botão adicionar azul */}
        <IconButton
          onClick={handleAddExame}
          size="small"
          color="primary"
          sx={{ mt: 2, display: "flex", alignItems: "center" }}
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
          disabled={examesPrescritos.length === 0}
        >
          Salvar Prescrição
        </Button>
      </Paper>
    </PageContainer>
  );
}
