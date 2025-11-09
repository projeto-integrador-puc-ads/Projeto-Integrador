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
import { useNavigate, useLocation } from "react-router-dom";

export default function PrescreverExamePage() {
  const navigate = useNavigate();
  const location = useLocation();

  //usa localStorage (mesmo modelo das outras páginas)
  const token = localStorage.getItem("token");

  //id da prescrição médica criada ao iniciar consulta
  const prescricao = location.state?.prescricao;
  const idPrescricaoMedica = prescricao?.id_prescricao_medica ?? prescricao?.id_prescricao ?? prescricao?.id;

  //estado
  const [listaExames, setListaExames] = useState<Array<any>>([]);
  const [exameSelecionado, setExameSelecionado] = useState<number | "">("");
  const [examesPrescritos, setExamesPrescritos] = useState<Array<any>>([]);
  const [loadingExames, setLoadingExames] = useState(false);

  //se não tiver idPrescricaoMedica - avisa e volta
  useEffect(() => {
    if (!idPrescricaoMedica) {
      alert("Prescrição médica não encontrada. Inicie a consulta primeiro.");
      navigate(-1);
    }
  }, [idPrescricaoMedica, navigate]);

  //busca exames disponíveis
  useEffect(() => {
    if (!token) {
      console.warn("Token não encontrado no localStorage.");
      return;
    }
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
        if (!resp.ok) {
          throw new Error(`Falha ao buscar exames: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        //espera um array de objetos com { id_exame, nome_exame }
        setListaExames(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err.message !== "401") console.error("Erro ao carregar exames:", err);
      })
      .finally(() => setLoadingExames(false));
  }, [token, navigate]);

  //adiciona exame à lista visual (evita duplicados)
  const handleAddExame = () => {
    if (!exameSelecionado) return;
    const exame = listaExames.find((x) => x.id_exame === exameSelecionado);
    if (!exame) {
      alert("Exame selecionado não encontrado.");
      return;
    }
    if (examesPrescritos.some((x) => x.id_exame === exameSelecionado)) {
      //já adicionado
      return;
    }
    setExamesPrescritos((prev) => [...prev, exame]);
  };

  //remove exame da lista visual
  const handleRemove = (id: number) => {
    setExamesPrescritos((prev) => prev.filter((e) => e.id_exame !== id));
  };

  //salva todos os exames prescritos no backend
  const handleSalvar = async () => {
    if (!token) {
      alert("Token não encontrado. Faça login.");
      return;
    }
    if (!idPrescricaoMedica) {
      alert("Prescrição médica inválida. Retorne e inicie a consulta.");
      return;
    }
    if (examesPrescritos.length === 0) {
      alert("Nenhum exame para salvar.");
      return;
    }

    try {
      for (const e of examesPrescritos) {
        const body = {
          id_exame: e.id_exame,
          id_prescricao_medica: idPrescricaoMedica,
          data_prescricao: new Date().toISOString().split("T")[0], //YYYY-MM-DD — compatível com LocalDate
          observacao: ""
        };

        const resp = await fetch("http://localhost:8080/api/diario_saude/prescricao/exame", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!resp.ok) {
          //tenta extrair corpo com detalhe do erro para log
          let text = "";
          try { text = await resp.text(); } catch (e) { /* ignore */ }
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Prescrever Exames
        </Typography>

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

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleAddExame}>
          Adicionar
        </Button>

        <List sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 2, maxHeight: 240, overflow: "auto" }}>
          {examesPrescritos.map((ex) => (
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
          ))}
          {examesPrescritos.length === 0 && (
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

        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Paper>
    </Container>
  );
}
