import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import RoundedTextField from "../components/RoundedTextField";
import ListItemCard from "../components/ListItemCard";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

export default function InformacoesSaudePage() {
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");
  const token = localStorage.getItem("token");
  const pacienteId = usuarioLogado?.id_usuario;

  const [usuario, setUsuario] = useState<any>(null);
  const [editData, setEditData] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    alergias: "",
  });

  // ==========================
  // DOENÇAS
  // ==========================
  const [listaDoencasSistema, setListaDoencasSistema] = useState<any[]>([]);
  const [doencasUsuario, setDoencasUsuario] = useState<any[]>([]);
  const [dialogDoencaOpen, setDialogDoencaOpen] = useState(false);
  const [doencaSelecionada, setDoencaSelecionada] = useState<any>(null);

  // ==========================
  // ALERGIAS
  // ==========================
  const [listaAlergiasSistema, setListaAlergiasSistema] = useState<any[]>([]);
  const [alergiasUsuario, setAlergiasUsuario] = useState<any[]>([]);
  const [dialogAlergiaOpen, setDialogAlergiaOpen] = useState(false);
  const [alergiaSelecionada, setAlergiaSelecionada] = useState<any>(null);

  // ==========================
  // LOGIN / USUÁRIO
  // ==========================
  useEffect(() => {
    if (!usuarioLogado) navigate("/login");
  }, [usuarioLogado, navigate]);

  useEffect(() => {
    if (!pacienteId || !token) return;

    fetch(`http://localhost:8080/api/diario_saude/usuario/${pacienteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);
        setEditData({
          nome: data.nome || "",
          idade: data.idade || "",
          peso: data.peso || "",
          altura: data.altura || "",
          alergias: data.alergias || "",
        });
      })
      .catch(console.error);
  }, [pacienteId, token]);

  const handleChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const salvarAlteracoes = async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/diario_saude/usuario", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_usuario: pacienteId, ...editData }),
      });

      if (resp.ok) {
        alert("Informações atualizadas!");
        const atualizado = { ...usuarioLogado, ...editData };
        localStorage.setItem("usuario", JSON.stringify(atualizado));
        setUsuario(atualizado);
      } else {
        alert("Erro ao salvar informações.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // FETCH DOENÇAS
  // ==========================
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/diario_saude/doencas/listar", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setListaDoencasSistema(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  const loadDoencasUsuario = () => {
    fetch(`http://localhost:8080/api/diario_saude/usuario-doenca/usuario/${pacienteId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setDoencasUsuario(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => { if (pacienteId) loadDoencasUsuario(); }, [pacienteId]);

  const handleAddDoenca = async () => {
    if (!doencaSelecionada) return alert("Selecione uma doença.");

    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-doenca/add?usuarioId=${pacienteId}&doencaId=${doencaSelecionada.id}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );

    setDialogDoencaOpen(false);
    setDoencaSelecionada(null);
    loadDoencasUsuario();
  };

  const handleRemoveDoenca = async (id: number) => {
    await fetch(`http://localhost:8080/api/diario_saude/usuario-doenca/delete?usuarioId=${pacienteId}&doencaId=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadDoencasUsuario();
  };

  // ==========================
  // FETCH ALERGIAS
  // ==========================
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/diario_saude/alergia/listar", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setListaAlergiasSistema(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  const loadAlergiasUsuario = () => {
    fetch(`http://localhost:8080/api/diario_saude/usuario-alergia/usuario/${pacienteId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setAlergiasUsuario(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => { if (pacienteId) loadAlergiasUsuario(); }, [pacienteId]);

  const handleAddAlergia = async () => {
    if (!alergiaSelecionada) return alert("Selecione uma alergia.");

    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-alergia/add?usuarioId=${pacienteId}&alergiaId=${alergiaSelecionada.id}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );

    setDialogAlergiaOpen(false);
    setAlergiaSelecionada(null);
    loadAlergiasUsuario();
  };

  const handleRemoveAlergia = async (id: number) => {
    await fetch(
      `http://localhost:8080/api/diario_saude/usuario-alergia/delete?usuarioId=${pacienteId}&alergiaId=${id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    );
    loadAlergiasUsuario();
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <PageContainer>
      <BackButton to="/home" />
      <PageTitle>Informações de Saúde</PageTitle>

      <SectionTitle>Dados do Paciente</SectionTitle>
      <Stack spacing={2}>
        <RoundedTextField label="Nome" name="nome" value={editData.nome} onChange={handleChange} />
        <RoundedTextField label="Idade" name="idade" type="number" value={editData.idade} onChange={handleChange} />
        <RoundedTextField label="Peso (kg)" name="peso" type="number" value={editData.peso} onChange={handleChange} />
        <RoundedTextField label="Altura (m)" name="altura" type="number" value={editData.altura} onChange={handleChange} />
        <RoundedTextField label="Alergias (texto)" name="alergias" value={editData.alergias} onChange={handleChange} multiline />
      </Stack>
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={salvarAlteracoes}>Salvar Alterações</Button>

      <Divider sx={{ my: 3 }} />
      <SectionTitle>Doenças Cadastradas</SectionTitle>
      {doencasUsuario.length === 0 && <Typography color="text.secondary" align="center">Nenhuma doença cadastrada.</Typography>}
      {doencasUsuario.map((d) => <ListItemCard key={d.id} title={d.nome} onDelete={() => handleRemoveDoenca(d.id)} />)}
      <Button variant="contained" fullWidth startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setDialogDoencaOpen(true)}>Adicionar Doença</Button>

      <Divider sx={{ my: 3 }} />
      <SectionTitle>Alergias Cadastradas</SectionTitle>
      {alergiasUsuario.length === 0 && <Typography color="text.secondary" align="center">Nenhuma alergia cadastrada.</Typography>}
      {alergiasUsuario.map((a) => <ListItemCard key={a.id} title={a.nome} onDelete={() => handleRemoveAlergia(a.id)} />)}
      <Button variant="contained" fullWidth startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setDialogAlergiaOpen(true)}>Adicionar Alergia</Button>

      {/* DIALOG DOENÇAS */}
      <Dialog open={dialogDoencaOpen} fullWidth onClose={() => setDialogDoencaOpen(false)}>
        <DialogTitle>Adicionar Doença</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={listaDoencasSistema}
            getOptionLabel={(op) => op?.nome || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, v) => setDoencaSelecionada(v)}
            renderInput={(params) => <TextField {...params} label="Selecione a doença" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDoencaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddDoenca}>Adicionar</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG ALERGIAS */}
      <Dialog open={dialogAlergiaOpen} fullWidth onClose={() => setDialogAlergiaOpen(false)}>
        <DialogTitle>Adicionar Alergia</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={listaAlergiasSistema}
            getOptionLabel={(op) => op?.nome || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, v) => setAlergiaSelecionada(v)}
            renderInput={(params) => <TextField {...params} label="Selecione a alergia" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAlergiaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddAlergia}>Adicionar</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
