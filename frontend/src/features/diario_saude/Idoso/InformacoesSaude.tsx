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
import { useNavigate } from "react-router-dom";

import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import RoundedTextField from "../components/RoundedTextField";
import ListItemCard from "../components/ListItemCard";
import BackButton from "../components/BackButton";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuarioApi } from "../api/usuarioApi";
import { doencaApi } from "../api/doencaApi";
import { usuarioDoencaApi } from "../api/usuarioDoencaApi";
import { alergiaApi } from "../api/alergiaApi";
import { usuarioAlergiaApi } from "../api/usuarioAlergiaApi";

import type { Usuario, Doenca, Alergia } from "../api/types";

export default function InformacoesSaudePage() {
  const queryClient = useQueryClient();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");
  const pacienteId = usuarioLogado?.id_usuario as number | undefined;
  const navigate = useNavigate();

  // REDIRECIONA SE NÃO HOUVER USUARIO LOGADO
  useEffect(() => {
    if (!usuarioLogado) navigate("/login");
  }, [usuarioLogado, navigate]);

  // -----------------------------
  // DADOS DO USUÁRIO
  // -----------------------------
  const { data: usuario } = useQuery({
    queryKey: ["usuario", pacienteId],
    queryFn: () => usuarioApi.porId(pacienteId),
    enabled: !!pacienteId,
  });

  const [editData, setEditData] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    alergias: "",
  });

  useEffect(() => {
    if (usuario) {
      setEditData({
        nome: usuario.nome ?? "",
        idade: String(usuario.idade ?? ""),
        peso: String(usuario.peso ?? ""),
        altura: String(usuario.altura ?? ""),
        alergias: usuario.alergias ?? "",
      });
    }
  }, [usuario]);

  const atualizarUsuarioMutation = useMutation({
    mutationFn: (payload: Usuario) => usuarioApi.atualizar(payload),
    onSuccess: (data) => {
      localStorage.setItem("usuario", JSON.stringify({ ...usuarioLogado, ...data }));
      queryClient.invalidateQueries(["usuario", pacienteId]);
      alert("Informações atualizadas!");
    },
    onError: () => alert("Erro ao salvar informações."),
  });

  const salvarAlteracoes = () => {
    if (!pacienteId) return;
    const payload: Usuario = { id_usuario: pacienteId, ...editData } as Usuario;
    atualizarUsuarioMutation.mutate(payload);
  };

  const handleChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // DOENCAS
  // -----------------------------
  const { data: listaDoencasSistema = [] } = useQuery({
    queryKey: ["doencas", "sistema"],
    queryFn: () => doencaApi.listar(),
  });

  const { data: doencasUsuario = [] } = useQuery({
    queryKey: ["usuario", pacienteId, "doencas"],
    queryFn: () => usuarioDoencaApi.listar(pacienteId!),
    enabled: !!pacienteId,
  });

  const [dialogDoencaOpen, setDialogDoencaOpen] = useState(false);
  const [doencaSelecionada, setDoencaSelecionada] = useState<Doenca | null>(null);

  const addDoencaMutation = useMutation({
    mutationFn: ({ usuarioId, doencaId }: { usuarioId: number; doencaId: number }) =>
      usuarioDoencaApi.adicionar(usuarioId, doencaId),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuario", pacienteId, "doencas"]);
      setDialogDoencaOpen(false);
      setDoencaSelecionada(null);
    },
  });

  const removeDoencaMutation = useMutation({
    mutationFn: ({ usuarioId, doencaId }: { usuarioId: number; doencaId: number }) =>
      usuarioDoencaApi.remover(usuarioId, doencaId),
    onSuccess: () => queryClient.invalidateQueries(["usuario", pacienteId, "doencas"]),
  });

  const handleAddDoenca = () => {
    if (!doencaSelecionada || !pacienteId) return alert("Selecione uma doença.");
    addDoencaMutation.mutate({ usuarioId: pacienteId, doencaId: doencaSelecionada.id });
  };

  const handleRemoveDoenca = (id: number) => {
    if (!pacienteId) return;
    removeDoencaMutation.mutate({ usuarioId: pacienteId, doencaId: id });
  };

  // -----------------------------
  // ALERGIAS
  // -----------------------------
  const { data: listaAlergiasSistema = [] } = useQuery({
    queryKey: ["alergias", "sistema"],
    queryFn: () => alergiaApi.listarSistema(),
  });

  const { data: alergiasUsuario = [] } = useQuery({
    queryKey: ["usuario", pacienteId, "alergias"],
    queryFn: () => usuarioAlergiaApi.listar(pacienteId!),
    enabled: !!pacienteId,
  });

  const [dialogAlergiaOpen, setDialogAlergiaOpen] = useState(false);
  const [alergiaSelecionada, setAlergiaSelecionada] = useState<Alergia | null>(null);

  const addAlergiaMutation = useMutation({
    mutationFn: ({ usuarioId, alergiaId }: { usuarioId: number; alergiaId: number }) =>
      usuarioAlergiaApi.adicionar(usuarioId, alergiaId),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuario", pacienteId, "alergias"]);
      setDialogAlergiaOpen(false);
      setAlergiaSelecionada(null);
    },
  });

  const removeAlergiaMutation = useMutation({
    mutationFn: ({ usuarioId, alergiaId }: { usuarioId: number; alergiaId: number }) =>
      usuarioAlergiaApi.remover(usuarioId, alergiaId),
    onSuccess: () => queryClient.invalidateQueries(["usuario", pacienteId, "alergias"]),
  });

  const handleAddAlergia = () => {
    if (!alergiaSelecionada || !pacienteId) return alert("Selecione uma alergia.");
    addAlergiaMutation.mutate({ usuarioId: pacienteId, alergiaId: alergiaSelecionada.id });
  };

  const handleRemoveAlergia = (id: number) => {
    if (!pacienteId) return;
    removeAlergiaMutation.mutate({ usuarioId: pacienteId, alergiaId: id });
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <PageContainer>
      <BackButton to="/saude" />
      <PageTitle>Informações de Saúde</PageTitle>

      {/* DADOS DO PACIENTE */}
      <SectionTitle>Dados do Paciente</SectionTitle>
      <Stack spacing={2}>
        <RoundedTextField label="Nome" name="nome" value={editData.nome} onChange={handleChange} />
        <RoundedTextField label="Idade" name="idade" type="number" value={editData.idade} onChange={handleChange} />
        <RoundedTextField label="Peso (kg)" name="peso" type="number" value={editData.peso} onChange={handleChange} />
        <RoundedTextField label="Altura (m)" name="altura" type="number" value={editData.altura} onChange={handleChange} />
        <RoundedTextField label="Alergias (texto)" name="alergias" value={editData.alergias} onChange={handleChange} multiline />
      </Stack>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={salvarAlteracoes}
        disabled={atualizarUsuarioMutation.isLoading}
      >
        {atualizarUsuarioMutation.isLoading ? "Salvando..." : "Salvar Alterações"}
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* DOENCAS */}
      <SectionTitle>Doenças Cadastradas</SectionTitle>
      {doencasUsuario.length === 0 ? (
        <Typography color="text.secondary" align="center">Nenhuma doença cadastrada.</Typography>
      ) : (
        doencasUsuario.map((d: any) => (
          <ListItemCard
            key={d.id || d.doencaId}
            title={d.nome ?? d.doencaNome ?? ""}
            onDelete={() => handleRemoveDoenca(d.id ?? d.doencaId)}
          />
        ))
      )}
      <Button variant="contained" fullWidth startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setDialogDoencaOpen(true)}>
        Adicionar Doença
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* ALERGIAS */}
      <SectionTitle>Alergias Cadastradas</SectionTitle>
      {alergiasUsuario.length === 0 ? (
        <Typography color="text.secondary" align="center">Nenhuma alergia cadastrada.</Typography>
      ) : (
        alergiasUsuario.map((a: any) => (
          <ListItemCard
            key={a.id || a.alergiaId}
            title={a.nome ?? a.alergiaNome ?? ""}
            onDelete={() => handleRemoveAlergia(a.id ?? a.alergiaId)}
          />
        ))
      )}
      <Button variant="contained" fullWidth startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setDialogAlergiaOpen(true)}>
        Adicionar Alergia
      </Button>

      {/* DIALOG DOENÇAS */}
      <Dialog open={dialogDoencaOpen} fullWidth onClose={() => setDialogDoencaOpen(false)}>
        <DialogTitle>Adicionar Doença</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={listaDoencasSistema}
            getOptionLabel={(option) => option.nome}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={doencaSelecionada}
            onChange={(e, v) => setDoencaSelecionada(v)}

            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.nome}
              </li>
            )}

            renderInput={(params) => (
              <TextField {...params} label="Pesquise a doença" fullWidth />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDoencaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddDoenca} disabled={addDoencaMutation.isLoading}>
            {addDoencaMutation.isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG ALERGIAS */}
      <Dialog open={dialogAlergiaOpen} fullWidth onClose={() => setDialogAlergiaOpen(false)}>
        <DialogTitle>Adicionar Alergia</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={listaAlergiasSistema}
            getOptionLabel={(op: any) => op?.nome ?? ""}
            isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
            onChange={(e, v) => setAlergiaSelecionada(v)}
            renderInput={(params) => <TextField {...params} label="Selecione a alergia" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAlergiaOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddAlergia} disabled={addAlergiaMutation.isLoading}>
            {addAlergiaMutation.isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
